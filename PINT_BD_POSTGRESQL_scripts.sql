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
    p_last_login TIMESTAMPTZ
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


-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS trigger_notificar_inicio_curso ON inscricao;

-- Trigger para criar notificação quando um curso começa
CREATE OR REPLACE FUNCTION notificar_inicio_curso()
RETURNS TRIGGER AS $$
DECLARE
    data_inicio DATE;
BEGIN
    -- Criar notificação de inscrição
    INSERT INTO notificacao (formando_id, curso_id, descricao)
    SELECT 
        NEW.formando_id,
        NEW.curso_id,
        'Você foi inscrito no curso "' || c.titulo || '"'
    FROM curso c
    WHERE c.curso_id = NEW.curso_id;

    -- Obter a data de início do curso
    SELECT s.data_inicio INTO data_inicio
    FROM sincrono s
    WHERE s.curso_id = NEW.curso_id;

    -- Se for um curso síncrono, criar notificações adicionais
    IF data_inicio IS NOT NULL THEN
        -- Notificação 3 dias antes
        INSERT INTO notificacao (formando_id, curso_id, descricao)
        SELECT 
            NEW.formando_id,
            NEW.curso_id,
            'O curso "' || c.titulo || '" começa em 3 dias!'
        FROM curso c
        WHERE c.curso_id = NEW.curso_id
        AND data_inicio = CURRENT_DATE + INTERVAL '3 days';

        -- Notificação no dia
        INSERT INTO notificacao (formando_id, curso_id, descricao)
        SELECT 
            NEW.formando_id,
            NEW.curso_id,
            'O curso "' || c.titulo || '" começa hoje!'
        FROM curso c
        WHERE c.curso_id = NEW.curso_id
        AND data_inicio = CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificar_inicio_curso
AFTER INSERT ON inscricao
FOR EACH ROW
EXECUTE FUNCTION notificar_inicio_curso();


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

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

