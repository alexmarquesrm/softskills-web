CREATE OR REPLACE FUNCTION criar_colaborador_default_formando(
    p_nome TEXT,
    p_email TEXT,
    p_data_nasc DATE,
    p_cargo TEXT,
    p_departamento TEXT,
    p_telefone NUMERIC(9),
    p_score INTEGER,
    p_username TEXT,
    p_pssword TEXT
)
RETURNS VOID AS $$
DECLARE
    novo_colaborador_id INTEGER;
BEGIN
    -- Criar colaborador
    INSERT INTO colaborador (nome, email, data_nasc, cargo, departamento, telefone, score, username, pssword)
    VALUES (p_nome, p_email, p_data_nasc, p_cargo, p_departamento, p_telefone, p_score, p_username, p_pssword)
    RETURNING colaborador_id INTO novo_colaborador_id;

    -- Criar formando com o mesmo ID das credenciais
    INSERT INTO formando (formando_id)
    VALUES (novo_colaborador_id);
END;
$$ LANGUAGE plpgsql;


-- Função que será chamada pela trigger
CREATE OR REPLACE FUNCTION criar_assincrono_automaticamente()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se o tipo é 'A'
  IF NEW.tipo = 'A' THEN
    INSERT INTO assincrono (curso_id)
    VALUES (NEW.curso_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que chama a função após inserção na tabela curso
CREATE TRIGGER trigger_criar_assincrono
AFTER INSERT ON curso
FOR EACH ROW
EXECUTE FUNCTION criar_assincrono_automaticamente();