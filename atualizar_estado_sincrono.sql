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
