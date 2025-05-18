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

-- Inserção na Tabela CURSO - Atualizando com mais cursos e estados corretos
INSERT INTO CURSO (GESTOR_ID, TOPICO_ID, TIPO, TOTAL_HORAS, TITULO, DESCRICAO, PENDENTE, CERTIFICADO, NIVEL) VALUES
-- Cursos Síncronos (21)
(1, 1, 'S', 40, 'Introdução ao JavaScript', 'Curso básico de JavaScript, para iniciantes.', FALSE, TRUE, 1),
(1, 2, 'S', 50, 'Fundamentos de Python', 'Curso para iniciantes em Python, abordando conceitos básicos.', FALSE, TRUE, 1),
(1, 3, 'S', 60, 'Desenvolvimento com React', 'Curso avançado de React para criar aplicações dinâmicas.', FALSE, TRUE, 3),
(1, 5, 'S', 70, 'Design Gráfico com Illustrator', 'Curso avançado de design gráfico usando o Illustrator.', FALSE, FALSE, 3),
(1, 10, 'S', 40, 'Gestão de Projetos com Scrum', 'Curso sobre gestão de projetos ágeis utilizando Scrum.', FALSE, TRUE, 2),
(1, 11, 'S', 45, 'Desenvolvimento Web Full Stack', 'Curso completo de desenvolvimento web frontend e backend.', FALSE, TRUE, 3),
(1, 12, 'S', 50, 'Python para Data Science', 'Introdução à análise de dados e machine learning com Python.', FALSE, TRUE, 2),
(1, 13, 'S', 55, 'Desenvolvimento Mobile com Flutter', 'Criação de aplicativos multiplataforma com Flutter.', FALSE, TRUE, 3),
(1, 14, 'S', 60, 'DevOps e CI/CD', 'Práticas modernas de desenvolvimento e entrega contínua.', FALSE, TRUE, 3),
(1, 15, 'S', 45, 'Segurança da Informação', 'Fundamentos de segurança em desenvolvimento de software.', FALSE, TRUE, 2),
(1, 16, 'S', 50, 'Cloud Computing com AWS', 'Introdução aos serviços cloud da Amazon Web Services.', FALSE, TRUE, 2),
(1, 17, 'S', 55, 'Desenvolvimento de APIs REST', 'Criação de APIs RESTful com Node.js e Express.', FALSE, TRUE, 3),
(1, 18, 'S', 60, 'Testes Automatizados', 'Implementação de testes unitários e de integração.', FALSE, TRUE, 3),
(1, 19, 'S', 45, 'UI/UX Design', 'Princípios de design de interface e experiência do usuário.', FALSE, TRUE, 2),
(1, 20, 'S', 50, 'Desenvolvimento de Jogos Unity', 'Criação de jogos 2D e 3D com Unity.', FALSE, TRUE, 3),
(1, 21, 'S', 55, 'Blockchain e Smart Contracts', 'Introdução ao desenvolvimento de aplicações blockchain.', FALSE, TRUE, 3),
(1, 22, 'S', 60, 'Machine Learning com Python', 'Implementação de algoritmos de machine learning.', FALSE, TRUE, 4),
(1, 23, 'S', 45, 'Desenvolvimento Android', 'Criação de aplicativos nativos para Android.', FALSE, TRUE, 3),
(1, 24, 'S', 50, 'Desenvolvimento iOS', 'Desenvolvimento de aplicativos para iOS com Swift.', FALSE, TRUE, 3),
(1, 25, 'S', 55, 'Microserviços com Spring Boot', 'Arquitetura de microserviços com Java e Spring.', FALSE, TRUE, 4),
(1, 26, 'S', 60, 'Desenvolvimento de Chatbots', 'Criação de chatbots com Python e NLP.', FALSE, TRUE, 3),

-- Cursos Assíncronos (14)
(1, 4, 'A', 45, 'Introdução ao Node.js', 'Curso básico sobre Node.js e como utilizá-lo no desenvolvimento web.', TRUE, FALSE, 1),
(1, 6, 'A', 55, 'Introdução ao C#', 'Curso para iniciantes em C#, abordando sintaxe básica e estrutura de dados.', TRUE, TRUE, 1),
(1, 7, 'A', 65, 'Desenvolvimento de Jogos com Unity', 'Curso avançado de Unity para criação de jogos.', TRUE, FALSE, 3),
(1, 8, 'A', 80, 'Desenvolvimento de Jogos com Unreal Engine', 'Curso sobre o desenvolvimento de jogos usando Unreal Engine.', TRUE, TRUE, 2),
(1, 9, 'A', 90, 'Fotografia Digital Avançada', 'Curso avançado de técnicas de fotografia digital e edição de imagens.', TRUE, FALSE, 4),
(1, 1, 'A', 40, 'HTML5 e CSS3 Moderno', 'Aprenda as últimas features do HTML5 e CSS3.', FALSE, TRUE, 1),
(1, 3, 'A', 45, 'JavaScript Avançado', 'Conceitos avançados de JavaScript e ES6+.', FALSE, TRUE, 3),
(1, 5, 'A', 50, 'TypeScript para Desenvolvedores', 'Introdução ao TypeScript e suas vantagens.', FALSE, TRUE, 2),
(1, 10, 'A', 55, 'React Native', 'Desenvolvimento de aplicativos móveis com React Native.', FALSE, TRUE, 3),
(1, 11, 'A', 60, 'Vue.js Framework', 'Desenvolvimento de aplicações web com Vue.js.', FALSE, TRUE, 2),
(1, 12, 'A', 45, 'MongoDB e NoSQL', 'Banco de dados NoSQL e MongoDB.', FALSE, TRUE, 2),
(1, 13, 'A', 50, 'GraphQL', 'Desenvolvimento de APIs com GraphQL.', FALSE, TRUE, 3),
(1, 14, 'A', 55, 'Docker e Containers', 'Containerização de aplicações com Docker.', FALSE, TRUE, 3),
(1, 15, 'A', 60, 'Kubernetes', 'Orquestração de containers com Kubernetes.', FALSE, TRUE, 4);

-- Inserção na Tabela ASSINCRONO (15 cursos)
INSERT INTO ASSINCRONO (CURSO_ID) VALUES
(21), (22), (23), (24), (25), (26), (27), (28), (29), (30), (31), (32), (33), (34), (35);

-- Inserção na Tabela SINCRONO (20 cursos)
INSERT INTO SINCRONO (CURSO_ID, FORMADOR_ID, LIMITE_VAGAS, DATA_LIMITE_INSCRICAO, DATA_INICIO, DATA_FIM, ESTADO) VALUES
-- Cursos Concluídos (10)
(1, 2, 30, '2024-01-15 23:59:59', '2024-02-01 09:00:00', '2024-02-28 18:00:00', TRUE),
(3, 2, 25, '2024-02-01 23:59:59', '2024-02-15 09:00:00', '2024-03-15 18:00:00', TRUE),
(5, 3, 40, '2024-03-01 23:59:59', '2024-03-15 09:00:00', '2024-04-15 18:00:00', TRUE),
(10, 5, 35, '2024-04-01 23:59:59', '2024-04-15 09:00:00', '2024-05-15 18:00:00', TRUE),
(11, 2, 30, '2024-05-01 23:59:59', '2024-05-15 09:00:00', '2024-06-15 18:00:00', TRUE),
(12, 3, 25, '2024-06-01 23:59:59', '2024-06-15 09:00:00', '2024-07-15 18:00:00', TRUE),
(13, 2, 35, '2024-07-01 23:59:59', '2024-07-15 09:00:00', '2024-08-15 18:00:00', TRUE),
(14, 3, 30, '2024-08-01 23:59:59', '2024-08-15 09:00:00', '2024-09-15 18:00:00', TRUE),
(15, 2, 25, '2024-09-01 23:59:59', '2024-09-15 09:00:00', '2024-10-15 18:00:00', TRUE),
(16, 3, 35, '2024-10-01 23:59:59', '2024-10-15 09:00:00', '2024-11-15 18:00:00', TRUE),

-- Cursos Ativos (10) - Ajustados para datas futuras a partir de 18-05-2025
(17, 2, 30, '2025-05-15 23:59:59', '2025-06-01 09:00:00', '2025-06-30 18:00:00', FALSE),
(18, 3, 25, '2025-06-01 23:59:59', '2025-06-15 09:00:00', '2025-07-15 18:00:00', FALSE),
(19, 2, 35, '2025-06-15 23:59:59', '2025-07-01 09:00:00', '2025-07-31 18:00:00', FALSE),
(20, 3, 30, '2025-07-01 23:59:59', '2025-07-15 09:00:00', '2025-08-15 18:00:00', FALSE),
(21, 2, 25, '2025-07-15 23:59:59', '2025-08-01 09:00:00', '2025-08-31 18:00:00', FALSE),
(22, 3, 35, '2025-08-01 23:59:59', '2025-08-15 09:00:00', '2025-09-15 18:00:00', FALSE),
(23, 2, 30, '2025-08-15 23:59:59', '2025-09-01 09:00:00', '2025-09-30 18:00:00', FALSE),
(24, 3, 25, '2025-09-01 23:59:59', '2025-09-15 09:00:00', '2025-10-15 18:00:00', FALSE),
(25, 2, 35, '2025-09-15 23:59:59', '2025-10-01 09:00:00', '2025-10-31 18:00:00', FALSE),
(26, 3, 30, '2025-10-01 23:59:59', '2025-10-15 09:00:00', '2025-11-15 18:00:00', FALSE);

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

-- Inserção na Tabela AULA (Ajustando datas para dentro do período do curso)
INSERT INTO AULA (FORMADOR_ID, SINCRONO_ID, DESCRICAO, HORA_INICIO, HORA_FIM) VALUES
(2, 1, 'Aula de Introdução ao SQL', '2024-04-01 09:00:00+00', '2024-04-01 11:00:00+00'),
(3, 3, 'Conceitos Avançados de Java', '2024-04-15 14:00:00+00', '2024-04-15 16:00:00+00'),
(2, 1, 'Consultas SQL Avançadas', '2024-04-08 09:00:00+00', '2024-04-08 11:00:00+00'),
(3, 3, 'Spring Framework', '2024-04-22 14:00:00+00', '2024-04-22 16:00:00+00'),
(2, 1, 'Otimização de Queries', '2024-04-15 09:00:00+00', '2024-04-15 11:00:00+00'),
(3, 3, 'Hibernate e JPA', '2024-04-29 14:00:00+00', '2024-04-29 16:00:00+00'),
(2, 1, 'Transações e Concorrência', '2024-04-22 09:00:00+00', '2024-04-22 11:00:00+00'),
(3, 3, 'Testes Unitários', '2024-05-06 14:00:00+00', '2024-05-06 16:00:00+00');

-- Inserção na Tabela PRESENCA_FORM_SINC
INSERT INTO PRESENCA_FORM_SINC (FORMANDO_ID, AULA_ID) VALUES
(1, 1), (2, 1), (1, 2), (3, 2),
(4, 3), (5, 3), (6, 4), (7, 4),
(8, 5), (9, 5), (10, 6), (1, 6),
(2, 7), (3, 7), (4, 8), (5, 8);

-- Inserção na Tabela INSCRICAO (Ajustando datas para antes do início dos cursos)
INSERT INTO INSCRICAO (FORMANDO_ID, CURSO_ID, TIPO_AVALIACAO, NOTA, DATA_CERTIFICADO, DATA_INSCRICAO, ESTADO) VALUES
-- Inscrições do Formando 3 (5 inscrições com estados diferentes)
(3, 1, 'Quiz', 85.0, '2024-02-28 10:00:00+00', '2024-01-10 10:00:00+00', TRUE),  -- Curso concluído
(3, 3, 'Trabalho', 91.0, '2024-03-15 15:00:00+00', '2024-02-01 09:15:00+00', TRUE),  -- Curso concluído
(3, 17, 'Quiz', NULL, NULL, '2025-05-01 14:30:00+00', FALSE),  -- Curso ativo
(3, 19, 'Trabalho', NULL, NULL, '2025-06-01 11:20:00+00', FALSE),  -- Curso pendente
(3, 21, 'Quiz', NULL, NULL, '2025-07-01 16:45:00+00', FALSE),  -- Curso pendente

-- Outras inscrições (todos com estado TRUE)
(1, 1, 'Quiz', 85.0, '2024-02-28 10:00:00+00', '2024-01-10 10:00:00+00', TRUE),
(1, 2, 'Trabalho', 88.0, '2024-03-15 11:00:00+00', '2024-01-28 16:45:00+00', TRUE),
(1, 17, 'Quiz', NULL, NULL, '2025-05-01 14:30:00+00', TRUE),
(2, 1, 'Quiz', 78.5, NULL, '2024-01-12 14:30:00+00', TRUE),
(2, 3, 'Trabalho', 92.5, '2024-03-15 14:00:00+00', '2024-01-30 11:20:00+00', TRUE),
(2, 19, 'Quiz', NULL, NULL, '2025-06-01 11:20:00+00', TRUE),
(4, 2, 'Quiz', 88.0, '2024-03-15 11:00:00+00', '2024-01-28 16:45:00+00', TRUE),
(4, 21, 'Trabalho', NULL, NULL, '2025-07-01 16:45:00+00', TRUE),
(5, 3, 'Trabalho', 92.5, '2024-03-15 14:00:00+00', '2024-01-30 11:20:00+00', TRUE),
(5, 17, 'Quiz', NULL, NULL, '2025-05-01 14:30:00+00', TRUE),
(6, 1, 'Quiz', 76.0, NULL, '2024-01-31 15:30:00+00', TRUE),
(6, 19, 'Trabalho', NULL, NULL, '2025-06-01 11:20:00+00', TRUE),
(7, 2, 'Trabalho', 89.0, '2024-03-15 16:00:00+00', '2024-02-01 10:15:00+00', TRUE),
(7, 21, 'Quiz', NULL, NULL, '2025-07-01 16:45:00+00', TRUE),
(8, 3, 'Quiz', 94.0, '2024-03-15 10:00:00+00', '2024-02-02 14:45:00+00', TRUE),
(8, 17, 'Trabalho', NULL, NULL, '2025-05-01 14:30:00+00', TRUE),
(9, 1, 'Trabalho', 87.5, NULL, '2024-02-03 09:30:00+00', TRUE),
(9, 19, 'Quiz', NULL, NULL, '2025-06-01 11:20:00+00', TRUE),
(10, 2, 'Quiz', 90.0, '2024-03-15 15:00:00+00', '2024-02-04 11:15:00+00', TRUE),
(10, 21, 'Trabalho', NULL, NULL, '2025-07-01 16:45:00+00', TRUE);

-- Inserção na Tabela TRABALHO
INSERT INTO TRABALHO (SINCRONO_ID, DESCRICAO, NOTA, DATA) VALUES
(1, 'Trabalho Final - SQL', 100, '2025-04-15 23:59:00+00'),
(3, 'Projeto Java Modular', 100, '2025-04-18 23:59:00+00'),
(1, 'Exercício de Consultas SQL', 100, '2025-04-20 23:59:00+00'),
(3, 'Implementação Spring Boot', 100, '2025-04-22 23:59:00+00'),
(1, 'Projeto de Banco de Dados', 100, '2025-04-25 23:59:00+00'),
(3, 'API REST com Java', 100, '2025-04-28 23:59:00+00');

-- Inserção na Tabela TRABALHOS_FORMANDO
INSERT INTO TRABALHOS_FORMANDO (FORMANDO_ID, TRABALHO_ID) VALUES
(1, 1), (2, 1), (3, 2), (4, 2),
(5, 3), (6, 3), (7, 4), (8, 4),
(9, 5), (10, 5), (1, 6), (2, 6);

-- Inserção na Tabela NOTIFICACAO
INSERT INTO NOTIFICACAO (FORMANDO_ID, CURSO_ID, DESCRICAO, DATA_CRIACAO, LIDA) VALUES
(1, 1, 'Nova aula marcada para amanhã às 9h.', CURRENT_TIMESTAMP, FALSE),
(2, 1, 'Nova aula marcada para amanhã às 9h.', CURRENT_TIMESTAMP, FALSE),
(3, 3, 'Entrega do projeto Java até sexta-feira.', CURRENT_TIMESTAMP, FALSE),
(4, 2, 'Material novo disponível no curso.', CURRENT_TIMESTAMP, FALSE),
(5, 3, 'Lembrete: Quiz amanhã às 14h.', CURRENT_TIMESTAMP, FALSE),
(6, 1, 'Feedback do trabalho disponível.', CURRENT_TIMESTAMP, FALSE),
(7, 2, 'Curso atualizado com novos conteúdos.', CURRENT_TIMESTAMP, FALSE),
(8, 3, 'Certificado disponível para download.', CURRENT_TIMESTAMP, FALSE),
(9, 1, 'Inscrições abertas para o próximo módulo.', CURRENT_TIMESTAMP, FALSE),
(10, 2, 'Workshop extra marcado para sábado.', CURRENT_TIMESTAMP, FALSE);

-- Inserção na Tabela PREFERENCIAS_CATEGORIA
INSERT INTO PREFERENCIAS_CATEGORIA (FORMANDO_ID, DESIGNACAO) VALUES
(1, 'Tecnologia'),
(2, 'Negócios'),
(3, 'Desenvolvimento Pessoal');

-- Inserção na Tabela THREADS (Adicionando mais threads)
INSERT INTO THREADS (FORUM_ID, COLABORADOR_ID, TITULO, DESCRICAO) VALUES
(1, 2, 'Introdução ao JavaScript', 'Discussão sobre os fundamentos do JavaScript e melhores práticas.'),
(3, 4, 'SEO Avançado', 'Como otimizar um site para mecanismos de busca utilizando técnicas avançadas.'),
(7, 6, 'Edição de Vídeo Profissional', 'Aprendendo as técnicas de edição no Adobe Premiere para profissionais.'),
(2, 3, 'HTML5 e CSS3 Moderno', 'Novas features e técnicas modernas de HTML5 e CSS3.'),
(4, 5, 'Node.js e Express', 'Desenvolvimento de APIs RESTful com Node.js e Express.'),
(6, 7, 'React Hooks', 'Como utilizar Hooks para gerenciar estado e efeitos colaterais.'),
(8, 8, 'Python para Data Science', 'Introdução ao Python para análise de dados e machine learning.'),
(10, 9, 'UI/UX Design Principles', 'Princípios fundamentais de design de interface e experiência do usuário.'),
(12, 10, 'Cibersegurança Básica', 'Conceitos básicos de segurança da informação e boas práticas.'),
(15, 1, 'Gestão de Projetos Ágeis', 'Metodologias ágeis e ferramentas para gestão de projetos.');

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

-- Inserção na Tabela COMENTARIOS (Adicionando mais comentários)
INSERT INTO COMENTARIOS (THREAD_ID, COLABORADOR_ID, DESCRICAO) VALUES
(1, 2, 'Excelente tópico! Eu aprendi muito com essa discussão.'),
(2, 4, 'Estou aplicando as dicas de SEO e obtendo bons resultados!'),
(3, 6, 'Estou aprendendo a editar melhor meus vídeos com essas dicas.'),
(4, 3, 'Ótimo conteúdo sobre HTML5! Vou implementar essas técnicas.'),
(5, 5, 'Node.js é realmente uma ferramenta poderosa para APIs.'),
(6, 7, 'React Hooks simplificou muito meu código!'),
(7, 8, 'Python é excelente para análise de dados.'),
(8, 9, 'Design é fundamental para uma boa experiência do usuário.'),
(9, 10, 'Segurança é um aspecto crucial no desenvolvimento.'),
(10, 1, 'Metodologias ágeis transformaram nossa equipe.');

-- Inserção na Tabela COMENTARIOS - respostas aos comentários
INSERT INTO COMENTARIOS (THREAD_ID, COLABORADOR_ID, DESCRICAO) VALUES
(1, 3, 'Também achei muito útil, obrigado por compartilhar!'),
(2, 5, 'SEO realmente faz diferença, bons resultados mesmo!'),
(3, 1, 'Boa explicação! Vou tentar essas técnicas também.'),
(4, 6, 'HTML5 trouxe muitas melhorias para o desenvolvimento web.'),
(5, 7, 'Express facilita muito o desenvolvimento de APIs.'),
(6, 8, 'Hooks são uma revolução no React!'),
(7, 9, 'Python tem uma ótima comunidade e bibliotecas.'),
(8, 10, 'Design thinking é essencial para bons produtos.'),
(9, 1, 'Segurança deve ser considerada desde o início.'),
(10, 2, 'Scrum e Kanban são ótimas metodologias ágeis.');

-- Inserção na Tabela COMENTARIO_RESPOSTA
INSERT INTO COMENTARIO_RESPOSTA (COMENTARIOPAI_ID, RESPOSTA_ID) VALUES
(1, 11),  -- Resposta ao comentário 1
(2, 12),  -- Resposta ao comentário 2
(3, 13),  -- Resposta ao comentário 3
(4, 14),  -- Resposta ao comentário 4
(5, 15),  -- Resposta ao comentário 5
(6, 16),  -- Resposta ao comentário 6
(7, 17),  -- Resposta ao comentário 7
(8, 18),  -- Resposta ao comentário 8
(9, 19),  -- Resposta ao comentário 9
(10, 20); -- Resposta ao comentário 10

-- Inserção na Tabela QUIZZ
INSERT INTO QUIZZ (QUIZZ_ID, CURSO_ID, GESTOR_ID, DESCRICAO, TIPO, LIMITE_TEMPO) VALUES
(1, 1, 1, 'Quiz Final de SQL', 'Teórico', 30),
(2, 3, 1, 'Quiz Java Básico', 'Teórico', 45),
(3, 1, 1, 'Quiz de Consultas SQL', 'Prático', 40),
(4, 3, 1, 'Quiz Spring Framework', 'Teórico', 35),
(5, 1, 1, 'Quiz de Otimização', 'Prático', 50),
(6, 3, 1, 'Quiz Hibernate', 'Teórico', 40);

-- Inserção na Tabela QUESTOES_QUIZZ
INSERT INTO QUESTOES_QUIZZ (QUESTAO_ID, QUIZZ_ID, PERGUNTA) VALUES
(1, 1, 'O que é uma chave primária?'),
(2, 2, 'O que é uma classe em Java?'),
(3, 3, 'Como fazer um JOIN em SQL?'),
(4, 4, 'O que é Injeção de Dependência?'),
(5, 5, 'Como otimizar uma query SQL?'),
(6, 6, 'O que é o Hibernate?'),
(7, 1, 'Diferença entre INNER e OUTER JOIN'),
(8, 2, 'O que é polimorfismo?'),
(9, 3, 'Como usar GROUP BY?'),
(10, 4, 'O que é um Bean no Spring?');

-- Inserção na Tabela RESPOSTAS_QUIZZ
INSERT INTO RESPOSTAS_QUIZZ (FORMANDO_ID, QUESTAO_ID, RESPOSTA) VALUES
(1, 1, 'Uma coluna que identifica unicamente uma linha.'),
(3, 2, 'É um molde para objetos.'),
(2, 3, 'Usando a cláusula JOIN com a condição ON.'),
(4, 4, 'É um padrão de design que permite injeção de dependências.'),
(5, 5, 'Usando índices e otimizando a estrutura da query.'),
(6, 6, 'É um framework ORM para Java.'),
(7, 7, 'INNER retorna apenas matches, OUTER retorna todos os registros.'),
(8, 8, 'É a capacidade de um objeto se comportar de diferentes formas.'),
(9, 9, 'Usando GROUP BY com funções de agregação.'),
(10, 10, 'É um objeto gerenciado pelo container Spring.');

-- Inserção na Tabela AVALIACAO_QUIZZ
INSERT INTO AVALIACAO_QUIZZ (QUIZZ_ID, FORMANDO_ID, NOTA) VALUES
(1, 1, 90.0),
(2, 3, 95.0),
(3, 2, 85.0),
(4, 4, 88.0),
(5, 5, 92.0),
(6, 6, 87.0),
(1, 7, 91.0),
(2, 8, 89.0),
(3, 9, 86.0),
(4, 10, 93.0);
