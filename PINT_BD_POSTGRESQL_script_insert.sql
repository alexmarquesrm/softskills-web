-- Inserção na Tabela CATEGORIA
INSERT INTO CATEGORIA (DESCRICAO) VALUES 
('Desenvolvimento'),
('Design'),
('Marketing'),
('TI e Software'),
('Fotografia e Vídeo'),
('Negócios'),
('Música'),
('Desenvolvimento Pessoal'),
('Saúde e Bem-estar'),
('Culinária');

-- Inserção na Tabela AREA
INSERT INTO AREA (CATEGORIA_ID, DESCRICAO) VALUES
(1, 'Desenvolvimento Web'),
(1, 'Desenvolvimento de Software'),
(1, 'Desenvolvimento de Jogos'),
(1, 'Inteligência Artificial'),
(2, 'Design Gráfico'),
(2, 'Design de Interface'),
(2, 'UX/UI Design'),
(3, 'Marketing Digital'),
(3, 'Marketing de Influência'),
(4, 'Redes de Computadores'),
(4, 'Cibersegurança'),
(5, 'Fotografia Digital'),
(5, 'Edição de Vídeo'),
(6, 'Gestão de Projetos'),
(6, 'Liderança e Negócios'),
(7, 'Teoria Musical'),
(7, 'Produção Musical'),
(8, 'Mindfulness'),
(8, 'Desenvolvimento Pessoal e Produtividade'),
(9, 'Nutrição e Dieta'),
(9, 'Exercícios Físicos');

-- Inserção na Tabela TOPICO
INSERT INTO TOPICO (AREA_ID, DESCRICAO) VALUES
(1, 'JavaScript'),
(1, 'HTML e CSS'),
(1, 'React'),
(1, 'Node.js'),
(2, 'Python'),
(2, 'Java'),
(2, 'C#'),
(3, 'Desenvolvimento de Jogos com Unity'),
(3, 'Desenvolvimento de Jogos com Unreal Engine'),
(4, 'Introdução à IA'),
(4, 'Machine Learning com Python'),
(5, 'Photoshop para Iniciantes'),
(5, 'Illustrator para Iniciantes'),
(6, 'Design Gráfico com Canva'),
(6, 'UI/UX Design com Figma'),
(7, 'Marketing no Instagram'),
(7, 'SEO Avançado'),
(8, 'Redes de Computadores'),
(8, 'Cibersegurança e Pentesting'),
(9, 'Fotografia para Iniciantes'),
(9, 'Edição de Vídeo no Adobe Premiere'),
(10, 'Gestão de Projetos Agile'),
(10, 'Marketing Digital para Pequenos Negócios'),
(11, 'Teoria Musical Básica'),
(11, 'Produção Musical no FL Studio'),
(12, 'Mindfulness para Iniciantes'),
(12, 'Produtividade e Gestão de Tempo'),
(13, 'Nutrição e Dieta Balanceada'),
(13, 'Exercícios Físicos em Casa');

-- Inserção na Tabela FORUM
INSERT INTO FORUM (TOPICO_ID, DESCRICAO) VALUES
(1, 'Fundamentos do JavaScript'),
(2, 'Introdução ao HTML e CSS'),
(3, 'React para Iniciantes'),
(4, 'Node.js e Express'),
(5, 'Python para Iniciantes'),
(6, 'Desenvolvimento com Java'),
(7, 'Desenvolvimento de Jogos com Unity'),
(8, 'Fundamentos de IA'),
(9, 'Edição de Imagens no Photoshop'),
(10, 'Figma: Design de Interface'),
(11, 'SEO: Como otimizar seu site'),
(12, 'Segurança em Redes de Computadores'),
(13, 'Técnicas de Fotografia Profissional'),
(14, 'Edição de Vídeos Profissionais'),
(15, 'Liderança e Gestão de Equipes'),
(16, 'Produtividade Pessoal'),
(17, 'Gestão de Projetos com Scrum'),
(18, 'Estratégias para Aumentar suas Vendas no Instagram'),
(19, 'Como Criar Música no FL Studio'),
(20, 'Mindfulness e Meditação');
   
-- Inserção na Tabela COLABORADOR (pass= 123)
INSERT INTO COLABORADOR (NOME, EMAIL, USERNAME, PSSWORD, DATA_NASC, CARGO, DEPARTAMENTO, TELEFONE, SCORE) VALUES
('Ana Costa', 'ana.costa@exemplo.com', 'ana123', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1985-02-20', 'Gestora de TI', 'Tecnologia', 912345670, 95),
('Carlos Silva', 'carlos.silva@exemplo.com', 'carlos90', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1990-06-15', 'Desenvolvedor Web', 'Desenvolvimento', 912345671, 88),
('Mariana Alves', 'mariana.alves@exemplo.com', 'marianaA', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1992-04-10', 'Designer Gráfico', 'Design',912345672, 90),
('João Pereira', 'joao.pereira@exemplo.com', 'joaoPereira', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1988-03-12', 'Especialista em SEO', 'Marketing',912345673, 80),
('Rita Santos', 'rita.santos@exemplo.com', 'ritaS', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1995-01-25', 'Gestora de Projetos', 'Negócios',912345674, 92),
('Pedro Rocha', 'pedro.rocha@exemplo.com', 'pedro123', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1983-11-10', 'Instrutor de Fotografia', 'Fotografia', 912345675, 85),
('Lucas Souza', 'lucas.souza@exemplo.com', 'lucasUI', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1994-02-28', 'Desenvolvedor Frontend', 'Desenvolvimento', 912345676, 91),
('Tiago Martins', 'tiago.martins@exemplo.com', 'tiago01', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1987-07-05', 'Consultor de Marketing Digital', 'Marketing', 912345677, 89),
('Carla Lima', 'carla.lima@exemplo.com', 'carlaLima', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1993-10-17', 'Instrutora de Música', 'Música', 912345678, 95),
('Fábio Almeida', 'fabio.almeida@exemplo.com', 'fabioF', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1986-09-30', 'Treinador de Saúde e Bem-estar', 'Saúde', 912345679, 85);

-- Inserção na Tabela GESTOR
INSERT INTO GESTOR (GESTOR_ID) VALUES
(1);

-- Inserção na Tabela FORMANDO
INSERT INTO FORMANDO (FORMANDO_ID) VALUES
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

-- Inserção na Tabela FORMADOR (3 Formadores)
INSERT INTO FORMADOR (FORMADOR_ID, ESPECIALIDADE) VALUES
(2, 'Desenvolvimento Web'),
(3, 'Design Gráfico'),
(5, 'Gestão de Projetos');

-- Inserção na Tabela CURSO - Corrigido com PENDENTE TRUE indicando pedidos de curso
INSERT INTO CURSO (GESTOR_ID, TOPICO_ID, TIPO, TOTAL_HORAS, TITULO, DESCRICAO, PENDENTE, CERTIFICADO, NIVEL) VALUES
(1, 1, 'S', 40, 'Introdução ao JavaScript', 'Curso básico de JavaScript, para iniciantes.', FALSE, TRUE,  1),
(1, 2, 'A', 50, 'Fundamentos de Python', 'Curso para iniciantes em Python, abordando conceitos básicos.', FALSE, TRUE, 1),
(1, 3, 'S', 60, 'Desenvolvimento com React', 'Curso avançado de React para criar aplicações dinâmicas.', FALSE, TRUE, 3),
(1, 4, 'A', 45, 'Introdução ao Node.js', 'Curso básico sobre Node.js e como utilizá-lo no desenvolvimento web.', TRUE, FALSE, 1),
(1, 5, 'S', 70, 'Design Gráfico com Illustrator', 'Curso avançado de design gráfico usando o Illustrator.', FALSE, FALSE, 3),
(1, 6, 'A', 55, 'Introdução ao C#', 'Curso para iniciantes em C#, abordando sintaxe básica e estrutura de dados.', TRUE, TRUE, 1),
(1, 7, 'A', 65, 'Desenvolvimento de Jogos com Unity', 'Curso avançado de Unity para criação de jogos.', TRUE, FALSE, 3),
(1, 8, 'A', 80, 'Desenvolvimento de Jogos com Unreal Engine', 'Curso sobre o desenvolvimento de jogos usando Unreal Engine.', TRUE, TRUE, 2),
(1, 9, 'A', 90, 'Fotografia Digital Avançada', 'Curso avançado de técnicas de fotografia digital e edição de imagens.', TRUE, FALSE, 4),
(1, 10, 'S', 40, 'Gestão de Projetos com Scrum', 'Curso sobre gestão de projetos ágeis utilizando Scrum.', FALSE, TRUE, 2);

-- Inserção na Tabela ASSINCRONO
INSERT INTO ASSINCRONO (CURSO_ID) VALUES
(2),  -- Curso 2 é assíncrono (Fundamentos de Python)
(4),  -- Curso 4 é assíncrono (Introdução ao Node.js)
(6),  -- Curso 6 é assíncrono (Introdução ao C#)
(7),  -- Curso 7 é assíncrono (Desenvolvimento de Jogos com Unity)
(8),  -- Curso 8 é assíncrono (Desenvolvimento de Jogos com Unreal Engine)
(9);  -- Curso 9 é assíncrono (Fotografia Digital Avançada)

-- Inserção na Tabela SINCRONO
INSERT INTO SINCRONO (CURSO_ID, FORMADOR_ID, LIMITE_VAGAS, DATA_LIMITE_INSCRICAO, DATA_INICIO, DATA_FIM, ESTADO) VALUES
(1, 2, 30, '2025-01-15 23:59:59', '2025-02-23 09:00:00', '2025-03-30 18:00:00', TRUE),
(3, 2, 25, '2025-02-01 23:59:59', '2025-02-12 09:00:00', '2025-04-12 18:00:00', TRUE),
(5, 3, 40, '2025-06-10 23:59:59', '2025-06-15 09:00:00', '2025-07-15 18:00:00', FALSE),
(10, 5, 35, '2025-11-20 23:59:59', '2025-11-25 09:00:00', '2025-12-25 18:00:00', FALSE);

-- Inserção na Tabela CURSO_COPIA
INSERT INTO CURSO_COPIA (CURSO_COPIA_ID, PARENT_CURSO_ID) VALUES
(2, 1),  -- Copia do curso 1 para o curso 2
(3, 2);  -- Copia do curso 2 para o curso 3

-- Inserção na Tabela PEDIDO_CURSO - Corrigido para incluir todos os cursos com PENDENTE = TRUE
INSERT INTO PEDIDO_CURSO (FORMADOR_ID, CURSO_ID, DATA) VALUES
(2, 2, CURRENT_TIMESTAMP),  -- Fundamentos de Python (PENDENTE = TRUE)
(2, 4, CURRENT_TIMESTAMP),  -- Introdução ao Node.js (PENDENTE = TRUE)
(3, 6, CURRENT_TIMESTAMP),  -- Introdução ao C# (PENDENTE = TRUE)
(3, 7, CURRENT_TIMESTAMP),  -- Desenvolvimento de Jogos com Unity (PENDENTE = TRUE)
(2, 8, CURRENT_TIMESTAMP),  -- Desenvolvimento de Jogos com Unreal Engine (PENDENTE = TRUE) 
(3, 9, CURRENT_TIMESTAMP);  -- Fotografia Digital Avançada (PENDENTE = TRUE)

-- Inserção na Tabela AULA
INSERT INTO AULA (FORMADOR_ID, SINCRONO_ID, DESCRICAO, HORA_INICIO, HORA_FIM) VALUES
(2, 1, 'Aula de Introdução ao SQL', '2025-04-10 09:00:00+00', '2025-04-10 11:00:00+00'),  -- AULA_ID = 1
(3, 3, 'Conceitos Avançados de Java', '2025-04-11 14:00:00+00', '2025-04-11 16:00:00+00');  -- AULA_ID = 2

-- Inserção na Tabela PRESENCA_FORM_SINC
INSERT INTO PRESENCA_FORM_SINC (FORMANDO_ID, AULA_ID) VALUES
(1, 1),
(2, 1),
(1, 2),
(3, 2);

-- Inserção na Tabela INSCRICAO
INSERT INTO INSCRICAO (FORMANDO_ID, CURSO_ID, TIPO_AVALIACAO, NOTA, DATA_CERTIFICADO, DATA_INSCRICAO, ESTADO) VALUES
(1, 1, 'Quiz', 85.0, '2025-04-12 10:00:00+00', CURRENT_TIMESTAMP, TRUE),
(2, 1, 'Quiz', 78.5, NULL, CURRENT_TIMESTAMP, TRUE),
(3, 3, 'Trabalho', 91.0, '2025-04-13 15:00:00+00', CURRENT_TIMESTAMP, TRUE);

-- Inserção na Tabela TRABALHO
INSERT INTO TRABALHO (SINCRONO_ID, DESCRICAO, NOTA, DATA) VALUES
(1, 'Trabalho Final - SQL', 100, '2025-04-15 23:59:00+00'),  -- TRABALHO_ID = 1
(3, 'Projeto Java Modular', 100, '2025-04-18 23:59:00+00');  -- TRABALHO_ID = 2

-- Inserção na Tabela TRABALHOS_FORMANDO
INSERT INTO TRABALHOS_FORMANDO (FORMANDO_ID, TRABALHO_ID) VALUES
(1, 1),
(2, 1),
(3, 2);

-- Inserção na Tabela NOTIFICACAO
INSERT INTO NOTIFICACAO (CURSO_ID, DESCRICAO) VALUES
(1, 'Nova aula marcada para amanhã às 9h.'),  -- NOTIFICACAO_ID = 1
(3, 'Entrega do projeto Java até sexta-feira.');  -- NOTIFICACAO_ID = 2

-- Inserção na Tabela NOTIFICACOES_FORMANDO
INSERT INTO NOTIFICACOES_FORMANDO (FORMANDO_ID, NOTIFICACAO_ID) VALUES
(1, 1),
(2, 1),
(3, 2);

-- Inserção na Tabela PREFERENCIAS_CATEGORIA
INSERT INTO PREFERENCIAS_CATEGORIA (FORMANDO_ID, DESIGNACAO) VALUES
(1, 'Tecnologia'),
(2, 'Negócios'),
(3, 'Desenvolvimento Pessoal');

-- Inserção na Tabela THREADS
INSERT INTO THREADS (FORUM_ID, COLABORADOR_ID, TITULO, DESCRICAO) VALUES
(1, 2, 'Introdução ao JavaScript', 'Discussão sobre os fundamentos do JavaScript e melhores práticas.'),
(3, 4, 'SEO Avançado', 'Como otimizar um site para mecanismos de busca utilizando técnicas avançadas.'),
(7, 6, 'Edição de Vídeo Profissional', 'Aprendendo as técnicas de edição no Adobe Premiere para profissionais.');

-- Inserção na Tabela THREADS_AVALIACAO
INSERT INTO THREADS_AVALIACAO (THREAD_ID, FORMANDO_ID, VOTE) VALUES
(1, 1, 1),  -- Formando 1 votou positivamente na thread 1
(2, 2, -1), -- Formando 2 votou negativamente na thread 2
(3, 3, 1);  -- Formando 3 votou positivamente na thread 3

-- Inserção na Tabela DENUNCIAS
INSERT INTO DENUNCIAS (THREAD_ID, FORMANDO_ID, MOTIVO, DESCRICAO, DATA) VALUES
(1, 1, 'I' ,'Post com conteúdo irrelevante para o tópico.', CURRENT_TIMESTAMP),
(2, 2, 'S', 'Spam na descrição do tópico, irrelevante para SEO.', CURRENT_TIMESTAMP),
(3, 3, 'O', 'Conteúdo de baixa qualidade na descrição do tópico.', CURRENT_TIMESTAMP);

-- Inserção na Tabela COMENTARIOS
INSERT INTO COMENTARIOS (THREAD_ID, COLABORADOR_ID, DESCRICAO) VALUES
(1, 2, 'Excelente tópico! Eu aprendi muito com essa discussão.'),  -- Comentário ID 1
(2, 4, 'Estou aplicando as dicas de SEO e obtendo bons resultados!'),  -- Comentário ID 2
(3, 6, 'Estou aprendendo a editar melhor meus vídeos com essas dicas.');  -- Comentário ID 3

-- Inserção na Tabela COMENTARIOS - respostas aos comentários
INSERT INTO COMENTARIOS (THREAD_ID, COLABORADOR_ID, DESCRICAO) VALUES
(1, 3, 'Também achei muito útil, obrigado por compartilhar!'),   -- Comentário ID 4 (resposta ao 1)
(2, 5, 'SEO realmente faz diferença, bons resultados mesmo!'),   -- Comentário ID 5 (resposta ao 2)
(3, 1, 'Boa explicação! Vou tentar essas técnicas também.');      -- Comentário ID 6 (resposta ao 3)

-- Inserção na Tabela COMENTARIO_RESPOSTA
INSERT INTO COMENTARIO_RESPOSTA (COMENTARIOPAI_ID, RESPOSTA_ID) VALUES
(1, 4),  -- Resposta ao comentário 1
(2, 5),  -- Resposta ao comentário 2
(3, 6);  -- Resposta ao comentário 3

-- Inserção na Tabela QUIZZ
INSERT INTO QUIZZ (QUIZZ_ID, CURSO_ID, GESTOR_ID, DESCRICAO, TIPO, LIMITE_TEMPO) VALUES
(1, 1, 1, 'Quiz Final de SQL', 'Teórico', 30),
(2, 3, 1, 'Quiz Java Básico', 'Teórico', 45);

-- Inserção na Tabela QUESTOES_QUIZZ
INSERT INTO QUESTOES_QUIZZ (QUESTAO_ID, QUIZZ_ID, PERGUNTA) VALUES
(1, 1, 'O que é uma chave primária?'),
(2, 2, 'O que é uma classe em Java?');

-- Inserção na Tabela RESPOSTAS_QUIZZ
INSERT INTO RESPOSTAS_QUIZZ (FORMANDO_ID, QUESTAO_ID, RESPOSTA) VALUES
(1, 1, 'Uma coluna que identifica unicamente uma linha.'),
(3, 2, 'É um molde para objetos.');

-- Inserção na Tabela AVALIACAO_QUIZZ
INSERT INTO AVALIACAO_QUIZZ (QUIZZ_ID, FORMANDO_ID, NOTA) VALUES
(1, 1, 90.0),
(2, 3, 95.0);