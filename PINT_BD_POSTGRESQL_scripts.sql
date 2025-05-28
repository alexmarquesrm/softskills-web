CREATE OR REPLACE FUNCTION criar_colaborador_default_formando(
    p_nome TEXT,
    p_email TEXT,
    p_data_nasc DATE,
    p_funcao_id INTEGER,
    p_telefone NUMERIC(9),
    p_score INTEGER,
    p_sobre_mim TEXT,
    p_username TEXT,
    p_pssword TEXT,
    p_last_login TIMESTAMP
)
RETURNS VOID AS $$
DECLARE
    novo_colaborador_id INTEGER;
BEGIN
    -- Criar colaborador
    INSERT INTO colaborador (nome, email, data_nasc, funcao_id, telefone, score, sobre_mim, username, pssword, inativo, last_login)
    VALUES (p_nome, p_email, p_data_nasc, p_funcao_id, p_telefone, p_score, p_sobre_mim, p_username, p_pssword, false, p_last_login)
    RETURNING colaborador_id INTO novo_colaborador_id;

    -- Criar formando com o mesmo ID das credenciais
    INSERT INTO formando (formando_id)
    VALUES (novo_colaborador_id);
END;
$$ LANGUAGE plpgsql;


-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------


-- Função para obter saudação baseada na hora do dia
CREATE OR REPLACE FUNCTION obter_saudacao()
RETURNS TEXT AS $$
DECLARE
    hora_atual INTEGER;
    saudacao TEXT;
BEGIN
    hora_atual := EXTRACT(HOUR FROM CURRENT_TIME);
    
    IF hora_atual >= 5 AND hora_atual < 12 THEN
        saudacao := 'Bom dia';
    ELSIF hora_atual >= 12 AND hora_atual < 18 THEN
        saudacao := 'Boa tarde';
    ELSE
        saudacao := 'Boa noite';
    END IF;
    
    RETURN saudacao;
END;
$$ LANGUAGE plpgsql;


-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------


-- 1. TRIGGER PARA NOTIFICAÇÃO DE INSCRIÇÃO (executa imediatamente)
-- Remover trigger existente
DROP TRIGGER IF EXISTS trigger_notificar_inscricao ON inscricao;
DROP FUNCTION IF EXISTS notificar_inicio_curso();

-- Função para notificar inscrição
CREATE OR REPLACE FUNCTION notificar_inscricao()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar apenas notificação de inscrição
    INSERT INTO notificacao (formando_id, curso_id, descricao)
    SELECT 
        NEW.formando_id,
        NEW.curso_id,
        'Você foi inscrito no curso "' || c.titulo || '"'
    FROM curso c
    WHERE c.curso_id = NEW.curso_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para inscrição
CREATE TRIGGER trigger_notificar_inscricao
AFTER INSERT ON inscricao
FOR EACH ROW
EXECUTE FUNCTION notificar_inscricao();

-- 2. FUNÇÃO PARA PROCESSAR NOTIFICAÇÕES DE INÍCIO DE CURSO
-- Esta função deve ser executada por um cron job ou agendador
CREATE OR REPLACE FUNCTION processar_notificacoes_inicio_curso()
RETURNS INTEGER AS $$
DECLARE
    notificacoes_criadas INTEGER := 0;
    rec RECORD;
BEGIN
    -- Notificações para cursos que começam em 3 dias
    FOR rec IN 
        SELECT DISTINCT i.formando_id, i.curso_id, c.titulo
        FROM inscricao i
        JOIN curso c ON c.curso_id = i.curso_id
        JOIN sincrono s ON s.curso_id = i.curso_id
        WHERE s.data_inicio = CURRENT_DATE + INTERVAL '3 days'
        AND NOT EXISTS (
            SELECT 1 FROM notificacao n 
            WHERE n.formando_id = i.formando_id 
            AND n.curso_id = i.curso_id 
            AND n.descricao LIKE '%começa em 3 dias%'
        )
    LOOP
        INSERT INTO notificacao (formando_id, curso_id, descricao)
        VALUES (
            rec.formando_id,
            rec.curso_id,
            'O curso "' || rec.titulo || '" começa em 3 dias!'
        );
        notificacoes_criadas := notificacoes_criadas + 1;
    END LOOP;

    -- Notificações para cursos que começam hoje
    FOR rec IN 
        SELECT DISTINCT i.formando_id, i.curso_id, c.titulo
        FROM inscricao i
        JOIN curso c ON c.curso_id = i.curso_id
        JOIN sincrono s ON s.curso_id = i.curso_id
        WHERE s.data_inicio = CURRENT_DATE
        AND NOT EXISTS (
            SELECT 1 FROM notificacao n 
            WHERE n.formando_id = i.formando_id 
            AND n.curso_id = i.curso_id 
            AND n.descricao LIKE '%começa hoje%'
        )
    LOOP
        INSERT INTO notificacao (formando_id, curso_id, descricao)
        VALUES (
            rec.formando_id,
            rec.curso_id,
            'O curso "' || rec.titulo || '" começa hoje!'
        );
        notificacoes_criadas := notificacoes_criadas + 1;
    END LOOP;

    RETURN notificacoes_criadas;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNÇÃO PARA EXECUTAR MANUALMENTE (para testes)
CREATE OR REPLACE FUNCTION executar_notificacoes_teste()
RETURNS TEXT AS $$
DECLARE
    resultado INTEGER;
BEGIN
    SELECT processar_notificacoes_inicio_curso() INTO resultado;
    RETURN 'Notificações criadas: ' || resultado;
END;
$$ LANGUAGE plpgsql;

-- 4. TESTES
-- Primeiro, vamos testar com um curso que começa em 3 dias
UPDATE sincrono
SET data_inicio = CURRENT_DATE + INTERVAL '3 days'
WHERE curso_id = 21;

-- Executar processamento de notificações
SELECT executar_notificacoes_teste();

-- Verificar notificações criadas
SELECT n.*, c.titulo
FROM notificacao n
JOIN curso c ON c.curso_id = n.curso_id
WHERE n.curso_id = 21
ORDER BY n.data_criacao DESC;

-- Teste para curso que começa hoje
UPDATE sincrono
SET data_inicio = CURRENT_DATE
WHERE curso_id = 21;

-- Executar novamente
SELECT executar_notificacoes_teste();

-- Verificar todas as notificações
SELECT n.*, c.titulo
FROM notificacao n
JOIN curso c ON c.curso_id = n.curso_id
WHERE n.curso_id = 21
ORDER BY n.data_criacao DESC;

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------


-- Função para calcular a média de notas dos formandos em um curso
CREATE OR REPLACE FUNCTION calcular_media_notas_curso(p_curso_id INTEGER)
RETURNS TABLE (
    curso_id INTEGER,
    titulo TEXT,
    media_notas NUMERIC,
    total_formandos INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.curso_id,
        c.titulo,
        ROUND(AVG(i.nota)::NUMERIC, 2) as media_notas,
        COUNT(i.formando_id) as total_formandos
    FROM curso c
    LEFT JOIN inscricao i ON c.curso_id = i.curso_id
    WHERE c.curso_id = p_curso_id
    GROUP BY c.curso_id, c.titulo;
END;
$$ LANGUAGE plpgsql;


-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------


CREATE OR REPLACE PROCEDURE gerir_inscricao_curso(
    p_formando_id INTEGER,
    p_curso_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_curso_tipo TEXT;
    v_limite_vagas INTEGER;
    v_vagas_ocupadas INTEGER;
    v_inscricao_existente BOOLEAN;
BEGIN
    -- Verificar se o curso existe e obter seu tipo
    SELECT tipo INTO v_curso_tipo
    FROM curso
    WHERE curso_id = p_curso_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Curso não encontrado';
    END IF;
    
    -- Verificar se já existe inscrição
    SELECT EXISTS (
        SELECT 1 FROM inscricao 
        WHERE formando_id = p_formando_id 
        AND curso_id = p_curso_id
    ) INTO v_inscricao_existente;
    
    IF v_inscricao_existente THEN
        RAISE EXCEPTION 'Formando já está inscrito neste curso';
    END IF;
    
    -- Para cursos síncronos, verificar limite de vagas
    IF v_curso_tipo = 'S' THEN
        SELECT limite_vagas, 
               (SELECT COUNT(*) FROM inscricao WHERE curso_id = p_curso_id)
        INTO v_limite_vagas, v_vagas_ocupadas
        FROM sincrono
        WHERE curso_id = p_curso_id;
        
        IF v_vagas_ocupadas >= v_limite_vagas THEN
            RAISE EXCEPTION 'Curso já atingiu o limite de vagas';
        END IF;
    END IF;
    
    -- Realizar inscrição
    INSERT INTO inscricao (
        formando_id,
        curso_id,
        data_inscricao,
        estado
    ) VALUES (
        p_formando_id,
        p_curso_id,
        CURRENT_TIMESTAMP,
        FALSE
    );
    
    RAISE NOTICE 'Inscrição realizada com sucesso';
END;
$$;


--- First drop the existing trigger and function

DROP TRIGGER IF EXISTS calculate_final_grade_trigger ON SINCRONO;
DROP FUNCTION IF EXISTS calculate_final_grade();
DROP FUNCTION IF EXISTS calculate_final_grade_trigger();

-- Função para chamada direta
CREATE OR REPLACE FUNCTION calculate_final_grade(p_curso_id INTEGER)
RETURNS VOID AS $$
DECLARE
    total_works INTEGER;
    submitted_works INTEGER;
    avg_grade FLOAT;
    formando_rec RECORD;
BEGIN
    -- Count total works required for the course
    SELECT COUNT(*) INTO total_works
    FROM MATERIAL
    WHERE CURSO_ID = p_curso_id
    AND TIPO = 'trabalho';

    -- For each formando in the course
    FOR formando_rec IN 
        SELECT DISTINCT i.FORMANDO_ID
        FROM INSCRICAO i
        WHERE i.CURSO_ID = p_curso_id
    LOOP
        -- Count submitted works and calculate average grade
        SELECT 
            COUNT(*),
            ROUND(AVG(t.NOTA)::NUMERIC, 2)
        INTO 
            submitted_works,
            avg_grade
        FROM TRABALHO t
        WHERE t.FORMANDO_ID = formando_rec.FORMANDO_ID
        AND t.SINCRONO_ID = p_curso_id
        AND t.NOTA IS NOT NULL;

        -- Update the final grade in INSCRICAO
        IF submitted_works > 0 THEN
            UPDATE INSCRICAO
            SET NOTA = avg_grade,
                DATA_CERTIFICADO = CURRENT_TIMESTAMP,
                ESTADO = true  -- Mark as completed
            WHERE FORMANDO_ID = formando_rec.FORMANDO_ID
            AND CURSO_ID = p_curso_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para o trigger
CREATE OR REPLACE FUNCTION calculate_final_grade_trigger()
RETURNS TRIGGER AS $$
DECLARE
    total_works INTEGER;
    submitted_works INTEGER;
    avg_grade FLOAT;
    formando_rec RECORD;
BEGIN
    -- Count total works required for the course
    SELECT COUNT(*) INTO total_works
    FROM MATERIAL
    WHERE CURSO_ID = NEW.CURSO_ID
    AND TIPO = 'trabalho';

    -- For each formando in the course
    FOR formando_rec IN 
        SELECT DISTINCT i.FORMANDO_ID
        FROM INSCRICAO i
        WHERE i.CURSO_ID = NEW.CURSO_ID
    LOOP
        -- Count submitted works and calculate average grade
        SELECT 
            COUNT(*),
            ROUND(AVG(t.NOTA)::NUMERIC, 2)
        INTO 
            submitted_works,
            avg_grade
        FROM TRABALHO t
        WHERE t.FORMANDO_ID = formando_rec.FORMANDO_ID
        AND t.SINCRONO_ID = NEW.CURSO_ID
        AND t.NOTA IS NOT NULL;

        -- Update the final grade in INSCRICAO
        IF submitted_works > 0 THEN
            UPDATE INSCRICAO
            SET NOTA = avg_grade,
                DATA_CERTIFICADO = CURRENT_TIMESTAMP,
                ESTADO = true  -- Mark as completed
            WHERE FORMANDO_ID = formando_rec.FORMANDO_ID
            AND CURSO_ID = NEW.CURSO_ID;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run when a course ends
CREATE TRIGGER calculate_final_grade_trigger
AFTER UPDATE OF DATA_FIM ON SINCRONO
FOR EACH ROW
WHEN (NEW.DATA_FIM <= CURRENT_TIMESTAMP)
EXECUTE FUNCTION calculate_final_grade_trigger();


-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

-- OPÇÃO 2: PROCEDIMENTO ARMAZENADO PARA EXECUÇÃO MANUAL OU AGENDADA
-- Esta opção permite executar a atualização manualmente ou agendar via cron job

CREATE OR REPLACE FUNCTION verificar_e_atualizar_estados_sincrono()
RETURNS INTEGER AS $$
DECLARE
    cursos_atualizados INTEGER;
BEGIN
    -- Atualiza o estado dos cursos que terminaram hoje
    UPDATE SINCRONO 
    SET ESTADO = TRUE 
    WHERE DATE(DATA_FIM) = CURRENT_DATE 
      AND (ESTADO IS NULL OR ESTADO = FALSE);
    
    -- Retorna o número de cursos atualizados
    GET DIAGNOSTICS cursos_atualizados = ROW_COUNT;
    
    -- Log da operação (opcional)
    RAISE NOTICE 'Atualizados % cursos síncronos que terminaram hoje', cursos_atualizados;
    
    RETURN cursos_atualizados;
END;
$$ LANGUAGE plpgsql;
