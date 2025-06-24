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
DROP TRIGGER IF EXISTS trigger_notificar_inscricao ON inscricao;
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

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
-- SISTEMA COMPLETO DE ATUALIZAÇÃO DE NOTAS PARA CURSOS SÍNCRONOS E ASSÍNCRONOS
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

-- Remover triggers existentes primeiro (pois dependem das funções)
DROP TRIGGER IF EXISTS trigger_curso_sincrono_concluido ON sincrono;
DROP TRIGGER IF EXISTS trigger_quiz_completado ON avaliacao_quizz;

-- Remover funções existentes se existirem
DROP FUNCTION IF EXISTS calcular_nota_final_sincrono(INTEGER);
DROP FUNCTION IF EXISTS calcular_nota_final_assincrono(INTEGER);
DROP FUNCTION IF EXISTS atualizar_notas_inscricao(INTEGER);
DROP FUNCTION IF EXISTS trigger_atualizar_notas_sincrono();
DROP FUNCTION IF EXISTS trigger_atualizar_nota_assincrono();
DROP FUNCTION IF EXISTS processar_cursos_sincronos_terminados();
DROP FUNCTION IF EXISTS reprocessar_notas_curso(INTEGER);
DROP FUNCTION IF EXISTS relatorio_notas_curso(INTEGER);

-- 1. FUNÇÃO PARA CALCULAR NOTA FINAL DE CURSOS SÍNCRONOS
-- Verifica trabalhos entregues vs trabalhos totais e calcula média das notas
CREATE OR REPLACE FUNCTION calcular_nota_final_sincrono(p_curso_id INTEGER)
RETURNS TABLE (
    formando_id INTEGER,
    nota_final FLOAT,
    trabalhos_entregues INTEGER,
    trabalhos_totais INTEGER,
    percentual_entrega FLOAT
) AS $$
DECLARE
    total_trabalhos INTEGER;
    formando_rec RECORD;
    trabalhos_entregues INTEGER;
    media_notas FLOAT;
    percentual_conclusao FLOAT;
BEGIN
    -- Contar total de trabalhos/materiais de entrega do curso
    SELECT COUNT(*) INTO total_trabalhos
    FROM material
    WHERE curso_id = p_curso_id
    AND tipo IN ('trabalho', 'entrega');

    -- Se não há trabalhos, não há nota a calcular
    IF total_trabalhos = 0 THEN
        RETURN;
    END IF;

    -- Para cada formando inscrito no curso
    FOR formando_rec IN 
        SELECT DISTINCT i.formando_id
        FROM inscricao i
        WHERE i.curso_id = p_curso_id
    LOOP
        -- Contar trabalhos entregues e calcular média das notas
        SELECT 
            COUNT(*),
            COALESCE(AVG(t.nota)::NUMERIC, 0.0)
        INTO 
            trabalhos_entregues,
            media_notas
        FROM trabalho t
        INNER JOIN material m ON t.material_id = m.material_id
        WHERE t.formando_id = formando_rec.formando_id
        AND t.sincrono_id = p_curso_id
        AND t.nota IS NOT NULL
        AND m.tipo IN ('trabalho', 'entrega');

        -- Calcular percentual de conclusão usando CAST para NUMERIC
        percentual_conclusao := (trabalhos_entregues::NUMERIC / total_trabalhos::NUMERIC) * 100;

        -- Retornar dados do formando
        RETURN QUERY SELECT 
            formando_rec.formando_id,
            media_notas,
            trabalhos_entregues,
            total_trabalhos,
            percentual_conclusao;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. FUNÇÃO PARA CALCULAR NOTA FINAL DE CURSOS ASSÍNCRONOS
-- Verifica a nota do quiz e determina se o formando passou
CREATE OR REPLACE FUNCTION calcular_nota_final_assincrono(p_curso_id INTEGER)
RETURNS TABLE (
    formando_id INTEGER,
    nota_quiz FLOAT,
    nota_minima FLOAT,
    aprovado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aq.formando_id,
        ROUND(aq.nota::NUMERIC, 2)::FLOAT as nota_quiz,
        ROUND(q.nota::NUMERIC, 2)::FLOAT as nota_minima,
        (aq.nota >= q.nota) as aprovado
    FROM avaliacao_quizz aq
    INNER JOIN quizz q ON aq.quizz_id = q.quizz_id
    INNER JOIN inscricao i ON i.formando_id = aq.formando_id AND i.curso_id = q.curso_id
    WHERE q.curso_id = p_curso_id;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNÇÃO PRINCIPAL PARA ATUALIZAR NOTAS DE INSCRIÇÃO
CREATE OR REPLACE FUNCTION atualizar_notas_inscricao(p_curso_id INTEGER)
RETURNS TEXT AS $$
DECLARE
    curso_tipo TEXT;
    formandos_atualizados INTEGER := 0;
    rec RECORD;
    resultado TEXT;
BEGIN
    -- Verificar tipo do curso
    SELECT tipo INTO curso_tipo
    FROM curso
    WHERE curso_id = p_curso_id;
    
    IF NOT FOUND THEN
        RETURN 'Curso não encontrado';
    END IF;

    -- Processar conforme o tipo do curso
    IF curso_tipo = 'S' THEN
        -- CURSO SÍNCRONO: Processar baseado em trabalhos
        FOR rec IN 
            SELECT * FROM calcular_nota_final_sincrono(p_curso_id)
        LOOP
            -- Atualizar inscrição apenas se há trabalhos entregues
            IF rec.trabalhos_entregues > 0 THEN
                UPDATE inscricao
                SET 
                    nota = rec.nota_final,
                    estado = CASE 
                        WHEN rec.percentual_entrega >= 70 AND rec.nota_final >= 10 THEN TRUE 
                        ELSE FALSE 
                    END,
                    data_certificado = CASE 
                        WHEN rec.percentual_entrega >= 70 AND rec.nota_final >= 10 THEN CURRENT_TIMESTAMP 
                        ELSE NULL 
                    END
                WHERE formando_id = rec.formando_id 
                AND curso_id = p_curso_id;
                
                formandos_atualizados := formandos_atualizados + 1;
            END IF;
        END LOOP;
        
        resultado := 'Curso Síncrono: ' || formandos_atualizados || ' formandos atualizados';
        
    ELSIF curso_tipo = 'A' THEN
        -- CURSO ASSÍNCRONO: Processar baseado em quiz
        FOR rec IN 
            SELECT * FROM calcular_nota_final_assincrono(p_curso_id)
        LOOP
            UPDATE inscricao
            SET 
                nota = rec.nota_quiz,
                estado = rec.aprovado,
                data_certificado = CASE 
                    WHEN rec.aprovado THEN CURRENT_TIMESTAMP 
                    ELSE NULL 
                END
            WHERE formando_id = rec.formando_id 
            AND curso_id = p_curso_id;
            
            formandos_atualizados := formandos_atualizados + 1;
        END LOOP;
        
        resultado := 'Curso Assíncrono: ' || formandos_atualizados || ' formandos atualizados';
    ELSE
        resultado := 'Tipo de curso inválido';
    END IF;

    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGER PARA CURSOS SÍNCRONOS (executa quando data_fim é atingida)
CREATE OR REPLACE FUNCTION trigger_atualizar_notas_sincrono()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se a data fim foi atingida ou passou
    IF NEW.data_fim IS NOT NULL AND NEW.data_fim <= CURRENT_TIMESTAMP THEN
        -- Atualizar estado do curso para concluído
        NEW.estado := TRUE;
        
        -- Executar atualização de notas
        PERFORM atualizar_notas_inscricao(NEW.curso_id);
        
        -- Log da operação
        RAISE NOTICE 'Curso % concluído. Notas atualizadas automaticamente.', NEW.curso_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para cursos síncronos
CREATE TRIGGER trigger_curso_sincrono_concluido
    BEFORE UPDATE ON sincrono
    FOR EACH ROW
    WHEN (NEW.data_fim IS NOT NULL AND NEW.data_fim <= CURRENT_TIMESTAMP AND (OLD.estado IS NULL OR OLD.estado = FALSE))
    EXECUTE FUNCTION trigger_atualizar_notas_sincrono();

-- 5. TRIGGER PARA CURSOS ASSÍNCRONOS (executa quando quiz é completado)
CREATE OR REPLACE FUNCTION trigger_atualizar_nota_assincrono()
RETURNS TRIGGER AS $$
DECLARE
    curso_id_quiz INTEGER;
BEGIN
    -- Obter o curso_id do quiz
    SELECT q.curso_id INTO curso_id_quiz
    FROM quizz q
    WHERE q.quizz_id = NEW.quizz_id;
    
    -- Atualizar nota da inscrição deste formando
    PERFORM atualizar_notas_inscricao(curso_id_quiz);
    
    RAISE NOTICE 'Quiz completado para formando % no curso %. Nota atualizada.', NEW.formando_id, curso_id_quiz;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para quando quiz é completado
CREATE TRIGGER trigger_quiz_completado
    AFTER INSERT ON avaliacao_quizz
    FOR EACH ROW
    EXECUTE FUNCTION trigger_atualizar_nota_assincrono();

-- 6. FUNÇÃO PARA PROCESSAR CURSOS SÍNCRONOS QUE JÁ TERMINARAM (execução manual/agendada)
CREATE OR REPLACE FUNCTION processar_cursos_sincronos_terminados()
RETURNS TEXT AS $$
DECLARE
    cursos_processados INTEGER := 0;
    curso_rec RECORD;
    resultado TEXT;
BEGIN
    -- Buscar cursos síncronos que terminaram mas ainda não foram marcados como concluídos
    FOR curso_rec IN 
        SELECT s.curso_id, s.data_fim
        FROM sincrono s
        WHERE s.data_fim <= CURRENT_TIMESTAMP
        AND (s.estado IS NULL OR s.estado = FALSE)
    LOOP
        -- Marcar curso como concluído
        UPDATE sincrono 
        SET estado = TRUE 
        WHERE curso_id = curso_rec.curso_id;
        
        -- Atualizar notas
        PERFORM atualizar_notas_inscricao(curso_rec.curso_id);
        
        cursos_processados := cursos_processados + 1;
        
        RAISE NOTICE 'Curso % processado e marcado como concluído', curso_rec.curso_id;
    END LOOP;
    
    resultado := 'Processados ' || cursos_processados || ' cursos síncronos terminados';
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNÇÃO PARA REPROCESSAR NOTAS DE UM CURSO ESPECÍFICO (útil para correções)
CREATE OR REPLACE FUNCTION reprocessar_notas_curso(p_curso_id INTEGER)
RETURNS TEXT AS $$
DECLARE
    resultado TEXT;
BEGIN
    -- Resetar estado das inscrições
    UPDATE inscricao 
    SET 
        nota = 0,
        estado = FALSE,
        data_certificado = NULL
    WHERE curso_id = p_curso_id;
    
    -- Reprocessar notas
    SELECT atualizar_notas_inscricao(p_curso_id) INTO resultado;
    
    RETURN 'Curso reprocessado: ' || resultado;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNÇÃO PARA OBTER RELATÓRIO DE NOTAS DE UM CURSO
CREATE OR REPLACE FUNCTION relatorio_notas_curso(p_curso_id INTEGER)
RETURNS TABLE (
    formando_id INTEGER,
    nome_formando TEXT,
    email_formando TEXT,
    nota_final FLOAT,
    estado_conclusao BOOLEAN,
    data_certificado TIMESTAMPTZ,
    tipo_curso TEXT,
    detalhes_adicionais TEXT
) AS $$
DECLARE
    curso_tipo TEXT;
BEGIN
    -- Obter tipo do curso
    SELECT tipo INTO curso_tipo FROM curso WHERE curso_id = p_curso_id;
    
    IF curso_tipo = 'S' THEN
        -- Relatório para curso síncrono
        RETURN QUERY
        SELECT 
            i.formando_id,
            c.nome,
            c.email,
            COALESCE(i.nota, 0.0)::FLOAT as nota_final,
            i.estado,
            i.data_certificado,
            'Síncrono'::TEXT as tipo_curso,
            ('Trabalhos: ' || COALESCE(nfs.trabalhos_entregues, 0) || '/' || COALESCE(nfs.trabalhos_totais, 0) || 
             ' (' || COALESCE(nfs.percentual_entrega, 0) || '%)') as detalhes_adicionais
        FROM inscricao i
        INNER JOIN formando f ON i.formando_id = f.formando_id
        INNER JOIN colaborador c ON f.formando_id = c.colaborador_id
        LEFT JOIN calcular_nota_final_sincrono(p_curso_id) nfs ON nfs.formando_id = i.formando_id
        WHERE i.curso_id = p_curso_id;
        
    ELSIF curso_tipo = 'A' THEN
        -- Relatório para curso assíncrono
        RETURN QUERY
        SELECT 
            i.formando_id,
            c.nome,
            c.email,
            COALESCE(i.nota, 0.0)::FLOAT as nota_final,
            i.estado,
            i.data_certificado,
            'Assíncrono'::TEXT as tipo_curso,
            ('Quiz: ' || COALESCE(nfa.nota_quiz, 0) || '/' || COALESCE(nfa.nota_minima, 0) || 
             ' (Mín: ' || COALESCE(nfa.nota_minima, 0) || ')') as detalhes_adicionais
        FROM inscricao i
        INNER JOIN formando f ON i.formando_id = f.formando_id
        INNER JOIN colaborador c ON f.formando_id = c.colaborador_id
        LEFT JOIN calcular_nota_final_assincrono(p_curso_id) nfa ON nfa.formando_id = i.formando_id
        WHERE i.curso_id = p_curso_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION processar_cursos_assincronos_terminados()
RETURNS INTEGER AS $$
DECLARE
    cursos_processados INTEGER := 0;
    curso_record RECORD;
BEGIN
    -- Buscar todos os cursos assíncronos que têm quizzes
    FOR curso_record IN 
        SELECT DISTINCT c.curso_id
        FROM curso c
        JOIN quizz q ON q.curso_id = c.curso_id
        WHERE c.tipo = 'A'
    LOOP
        -- Atualizar notas para cada curso
        PERFORM atualizar_notas_inscricao(curso_record.curso_id);
        cursos_processados := cursos_processados + 1;
    END LOOP;

    RETURN cursos_processados;
END;
$$ LANGUAGE plpgsql;


-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------


