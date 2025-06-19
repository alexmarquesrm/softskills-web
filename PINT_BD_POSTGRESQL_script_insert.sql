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
(10, 'Exercícios Físicos'),
(10, 'Culinária Básica');

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
(14, 'Gestão de Projetos Agile'),
(15, 'Marketing Digital para Pequenos Negócios'),
(16, 'Teoria Musical Básica'),
(16, 'Produção Musical no FL Studio'),
(17, 'Mindfulness para Iniciantes'),
(17, 'Produtividade e Gestão de Tempo'),
(18, 'Nutrição e Dieta Balanceada'),
(19, 'Exercícios Físicos em Casa'),
(20, 'Culinária Básica'),
(20, 'Receitas Saudáveis');

-- Inserção na Tabela FORUM
INSERT INTO FORUM (TOPICO_ID, DESCRICAO, APROVADO, PENDENTE) VALUES
(1, 'Fundamentos do JavaScript', FALSE, TRUE),
(2, 'Introdução ao HTML e CSS', TRUE, FALSE),
(3, 'React para Iniciantes', TRUE, FALSE),
(4, 'Node.js e Express', TRUE, FALSE),
(5, 'Python para Iniciantes', FALSE, TRUE),
(6, 'Desenvolvimento com Java', TRUE, FALSE),
(8, 'Desenvolvimento de Jogos com Unity', FALSE, TRUE),
(10, 'Fundamentos de IA', TRUE, FALSE),
(12, 'Edição de Imagens no Photoshop', TRUE, FALSE),
(15, 'Figma: Design de Interface', FALSE, TRUE),
(17, 'SEO: Como otimizar seu site', TRUE, FALSE),
(18, 'Segurança em Redes de Computadores', TRUE, FALSE),
(20, 'Técnicas de Fotografia Profissional', FALSE, TRUE),
(21, 'Edição de Vídeos Profissionais', TRUE, FALSE),
(14, 'Liderança e Gestão de Equipes', TRUE, FALSE),
(25, 'Produtividade Pessoal', TRUE, FALSE),
(23, 'Gestão de Projetos com Scrum', TRUE, FALSE),
(16, 'Estratégias para Aumentar suas Vendas no Instagram', TRUE, FALSE),
(24, 'Como Criar Música no FL Studio', TRUE, FALSE),
(26, 'Mindfulness e Meditação', TRUE, FALSE);
   
-- Inserção na Tabela DEPARTAMENTO
INSERT INTO DEPARTAMENTO (NOME) VALUES
('Tecnologia'),
('Design'),
('Marketing'),
('Negócios'),
('Educação'),
('Saúde'),
('Música');

-- Inserção na Tabela FUNCAO
INSERT INTO FUNCAO (DEPARTAMENTO_ID, NOME) VALUES
-- Tecnologia
(1, 'Gestor de TI'),
(1, 'Desenvolvedor Senior'),
(1, 'Desenvolvedor Pleno'),
(1, 'Desenvolvedor Junior'),
(1, 'Estagiário de TI'),

-- Design
(2, 'Designer Senior'),
(2, 'Designer Pleno'),
(2, 'Designer Junior'),

-- Marketing
(3, 'Especialista em SEO'),
(3, 'Analista de Marketing'),
(3, 'Assistente de Marketing'),

-- Negócios
(4, 'Gestor de Projetos'),
(4, 'Analista de Negócios'),

-- Educação
(5, 'Formador Senior'),
(5, 'Formador Pleno'),
(5, 'Formador Junior'),

-- Saúde
(6, 'Instrutor de Saúde'),
(6, 'Assistente de Saúde'),

-- Música
(7, 'Instrutor de Música'),
(7, 'Assistente Musical');

-- Inserção na Tabela COLABORADOR (pass= 123)
INSERT INTO COLABORADOR (NOME, EMAIL, USERNAME, PSSWORD, DATA_NASC, FUNCAO_ID, TELEFONE, SCORE) VALUES
('Ana Costa', 'ana.costa@exemplo.com', 'ana123', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1985-02-20', 1, 912345670, 95),
('Carlos Silva', 'carlos.silva@exemplo.com', 'carlos90', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1990-06-15', 2, 912345671, 88),
('Mariana Alves', 'mariana.alves@exemplo.com', 'marianaA', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1992-04-10', 6, 912345672, 90),
('João Pereira', 'joao.pereira@exemplo.com', 'joaoPereira', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1988-03-12', 8, 912345673, 80),
('Rita Santos', 'rita.santos@exemplo.com', 'ritaS', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1995-01-25', 13, 912345674, 92),
('Pedro Rocha', 'pedro.rocha@exemplo.com', 'pedro123', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1983-11-10', 15, 912345675, 85),
('Lucas Souza', 'lucas.souza@exemplo.com', 'lucasUI', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1994-02-28', 3, 912345676, 91),
('Tiago Martins', 'tiago.martins@exemplo.com', 'tiago01', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1987-07-05', 9, 912345677, 89),
('Carla Lima', 'carla.lima@exemplo.com', 'carlaLima', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1993-10-17', 19, 912345678, 95),
('Fábio Almeida', 'fabio.almeida@exemplo.com', 'fabioF', '$2a$12$Dvv3PM454wsS0mCoyyArsuB6uEq4JyBqam2Kff3iYXkl8LZ9lbk4i', '1986-09-30', 16, 912345679, 85);

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
INSERT INTO CURSO (GESTOR_ID, TOPICO_ID, TIPO, TOTAL_HORAS, TITULO, DESCRICAO, APROVADO, PENDENTE, CERTIFICADO, NIVEL) VALUES
-- Cursos Síncronos (21)
(1, 1, 'S', 40, 'Introdução ao JavaScript', 'Curso básico de JavaScript, para iniciantes.', TRUE, FALSE, TRUE, 1),
(1, 5, 'S', 50, 'Fundamentos de Python', 'Curso para iniciantes em Python, abordando conceitos básicos.', TRUE, FALSE, TRUE, 1),
(1, 3, 'S', 60, 'Desenvolvimento com React', 'Curso avançado de React para criar aplicações dinâmicas.', TRUE, FALSE, TRUE, 3),
(1, 13, 'S', 70, 'Design Gráfico com Illustrator', 'Curso avançado de design gráfico usando o Illustrator.', TRUE, FALSE, FALSE, 3),
(1, 23, 'S', 40, 'Gestão de Projetos com Scrum', 'Curso sobre gestão de projetos ágeis utilizando Scrum.', TRUE, FALSE, TRUE, 2),
(1, 1, 'S', 45, 'Desenvolvimento Web Full Stack', 'Curso completo de desenvolvimento web frontend e backend.', TRUE, FALSE, TRUE, 3),
(1, 11, 'S', 50, 'Python para Data Science', 'Introdução à análise de dados e machine learning com Python.', TRUE, FALSE, TRUE, 2),
(1, 1, 'S', 55, 'Desenvolvimento Mobile com Flutter', 'Criação de aplicativos multiplataforma com Flutter.', TRUE, FALSE, TRUE, 3),
(1, 18, 'S', 60, 'DevOps e CI/CD', 'Práticas modernas de desenvolvimento e entrega contínua.', TRUE, FALSE, TRUE, 3),
(1, 18, 'S', 45, 'Segurança da Informação', 'Fundamentos de segurança em desenvolvimento de software.', TRUE, FALSE, TRUE, 2),
(1, 1, 'S', 50, 'Cloud Computing com AWS', 'Introdução aos serviços cloud da Amazon Web Services.', TRUE, FALSE, TRUE, 2),
(1, 4, 'S', 55, 'Desenvolvimento de APIs REST', 'Criação de APIs RESTful com Node.js e Express.', TRUE, FALSE, TRUE, 3),
(1, 5, 'S', 60, 'Testes Automatizados', 'Implementação de testes unitários e de integração.', TRUE, FALSE, TRUE, 3),
(1, 15, 'S', 45, 'UI/UX Design', 'Princípios de design de interface e experiência do usuário.', TRUE, FALSE, TRUE, 2),
(1, 8, 'S', 50, 'Desenvolvimento de Jogos Unity', 'Criação de jogos 2D e 3D com Unity.', TRUE, FALSE, TRUE, 3),
(1, 1, 'S', 55, 'Blockchain e Smart Contracts', 'Introdução ao desenvolvimento de aplicações blockchain.', TRUE, FALSE, TRUE, 3),
(1, 11, 'S', 60, 'Machine Learning com Python', 'Implementação de algoritmos de machine learning.', TRUE, FALSE, TRUE, 4),
(1, 6, 'S', 45, 'Desenvolvimento Android', 'Criação de aplicativos nativos para Android.', TRUE, FALSE, TRUE, 3),
(1, 6, 'S', 50, 'Desenvolvimento iOS', 'Desenvolvimento de aplicativos para iOS com Swift.', TRUE, FALSE, TRUE, 3),
(1, 6, 'S', 55, 'Microserviços com Spring Boot', 'Arquitetura de microserviços com Java e Spring.', TRUE, FALSE, TRUE, 4),
(1, 5, 'S', 60, 'Desenvolvimento de Chatbots', 'Criação de chatbots com Python e NLP.', TRUE, FALSE, TRUE, 3),

-- Cursos Assíncronos (14)
(1, 4, 'A', 45, 'Introdução ao Node.js', 'Curso básico sobre Node.js e como utilizá-lo no desenvolvimento web.', TRUE, FALSE, FALSE, 1),
(1, 7, 'A', 55, 'Introdução ao C#', 'Curso para iniciantes em C#, abordando sintaxe básica e estrutura de dados.', TRUE, FALSE, TRUE, 1),
(1, 8, 'A', 65, 'Desenvolvimento de Jogos com Unity', 'Curso avançado de Unity para criação de jogos.', TRUE, FALSE, FALSE, 3),
(1, 9, 'A', 80, 'Desenvolvimento de Jogos com Unreal Engine', 'Curso sobre o desenvolvimento de jogos usando Unreal Engine.', TRUE, FALSE, TRUE, 2),
(1, 20, 'A', 90, 'Fotografia Digital Avançada', 'Curso avançado de técnicas de fotografia digital e edição de imagens.', TRUE, FALSE, FALSE, 4),
(1, 2, 'A', 40, 'HTML5 e CSS3 Moderno', 'Aprenda as últimas features do HTML5 e CSS3.', TRUE, FALSE, TRUE, 1),
(1, 1, 'A', 45, 'JavaScript Avançado', 'Conceitos avançados de JavaScript e ES6+.', TRUE, FALSE, TRUE, 3),
(1, 5, 'A', 50, 'TypeScript para Desenvolvedores', 'Introdução ao TypeScript e suas vantagens.', TRUE, FALSE, TRUE, 2),
(1, 3, 'A', 55, 'React Native', 'Desenvolvimento de aplicativos móveis com React Native.', TRUE, FALSE, TRUE, 3),
(1, 1, 'A', 60, 'Vue.js Framework', 'Desenvolvimento de aplicações web com Vue.js.', TRUE, FALSE, TRUE, 2),
(1, 5, 'A', 45, 'MongoDB e NoSQL', 'Banco de dados NoSQL e MongoDB.', TRUE, FALSE, TRUE, 2),
(1, 4, 'A', 50, 'GraphQL', 'Desenvolvimento de APIs com GraphQL.', TRUE, FALSE, TRUE, 3),
(1, 18, 'A', 55, 'Docker e Containers', 'Containerização de aplicações com Docker.', TRUE, FALSE, TRUE, 3),
(1, 18, 'A', 60, 'Kubernetes', 'Orquestração de containers com Kubernetes.', TRUE, FALSE, TRUE, 4);

-- Inserção na Tabela ASSINCRONO (14 cursos)
INSERT INTO ASSINCRONO (CURSO_ID) VALUES
(22), (23), (24), (25), (26), (27), (28), (29), (30), (31), (32), (33), (34), (35);

-- Inserção na Tabela SINCRONO (20 cursos)
INSERT INTO SINCRONO (CURSO_ID, FORMADOR_ID, LIMITE_VAGAS, DATA_LIMITE_INSCRICAO, DATA_INICIO, DATA_FIM, ESTADO) VALUES
-- Cursos Concluídos (10)
(1, 2, 30, '2025-06-10 23:59:59', '2025-06-15 09:00:00', '2025-08-28 18:00:00', FALSE),
(2, 2, 25, '2024-01-20 23:59:59', '2024-02-05 09:00:00', '2024-03-05 18:00:00', TRUE),
(3, 2, 25, '2025-04-01 23:59:59', '2025-04-15 09:00:00', '2025-06-30 18:00:00', FALSE),
(5, 3, 40, '2024-03-01 23:59:59', '2024-03-15 09:00:00', '2024-04-15 18:00:00', TRUE),
(10, 5, 35, '2024-04-01 23:59:59', '2024-04-15 09:00:00', '2024-05-15 18:00:00', TRUE),
(11, 2, 30, '2024-05-01 23:59:59', '2024-05-15 09:00:00', '2024-06-15 18:00:00', TRUE),
(12, 3, 25, '2024-06-01 23:59:59', '2024-06-15 09:00:00', '2024-07-15 18:00:00', TRUE),
(13, 2, 35, '2024-07-01 23:59:59', '2024-07-15 09:00:00', '2024-08-15 18:00:00', TRUE),
(14, 3, 30, '2024-08-01 23:59:59', '2024-08-15 09:00:00', '2024-09-15 18:00:00', TRUE),
(15, 2, 25, '2024-09-01 23:59:59', '2024-09-15 09:00:00', '2024-10-15 18:00:00', TRUE),
(16, 3, 35, '2024-10-01 23:59:59', '2024-10-15 09:00:00', '2024-11-15 18:00:00', TRUE),

-- Cursos a decorrer (3)
(17, 2, 30, '2025-04-15 23:59:59', '2025-05-01 09:00:00', '2025-05-31 18:00:00', FALSE),
(18, 3, 25, '2025-04-20 23:59:59', '2025-05-05 09:00:00', '2025-06-05 18:00:00', FALSE),
(19, 2, 35, '2025-04-25 23:59:59', '2025-05-10 09:00:00', '2025-06-10 18:00:00', FALSE),

-- Cursos Ativos (7) - Ajustados para datas futuras a partir de 18-05-2025
(20, 3, 30, '2025-07-01 23:59:59', '2025-07-15 09:00:00', '2025-08-15 18:00:00', FALSE),
(21, 2, 25, '2025-07-15 23:59:59', '2025-08-01 09:00:00', '2025-08-31 18:00:00', FALSE),
(6, 3, 35, '2025-08-01 23:59:59', '2025-08-15 09:00:00', '2025-09-15 18:00:00', FALSE),
(7, 2, 30, '2025-08-15 23:59:59', '2025-09-01 09:00:00', '2025-09-30 18:00:00', FALSE),
(8, 3, 25, '2025-09-01 23:59:59', '2025-09-15 09:00:00', '2025-10-15 18:00:00', FALSE),
(9, 2, 35, '2025-09-15 23:59:59', '2025-10-01 09:00:00', '2025-10-31 18:00:00', FALSE),
(4, 3, 30, '2025-10-01 23:59:59', '2025-10-15 09:00:00', '2025-11-15 18:00:00', FALSE);

-- Inserção na Tabela CURSO_COPIA
INSERT INTO CURSO_COPIA (CURSO_COPIA_ID, PARENT_CURSO_ID) VALUES
(2, 1),  -- Copia do curso 1 para o curso 2
(3, 2);  -- Copia do curso 2 para o curso 3

-- Inserção na Tabela PEDIDOS (substituindo PEDIDO_CURSO e PEDIDO_FORUM)
INSERT INTO PEDIDOS (COLABORADOR_ID, TIPO, REFERENCIA_ID, DATA) VALUES
-- Pedidos de Cursos (antigos PEDIDO_CURSO)
(2, 'CURSO', 22, CURRENT_TIMESTAMP),  -- Introdução ao Node.js (PENDENTE = TRUE)
(3, 'CURSO', 23, CURRENT_TIMESTAMP),  -- Introdução ao C# (PENDENTE = TRUE)
(2, 'CURSO', 24, CURRENT_TIMESTAMP),  -- Desenvolvimento de Jogos com Unity (PENDENTE = TRUE)
(3, 'CURSO', 25, CURRENT_TIMESTAMP),  -- Desenvolvimento de Jogos com Unreal Engine (PENDENTE = TRUE) 
(2, 'CURSO', 26, CURRENT_TIMESTAMP),  -- Fotografia Digital Avançada (PENDENTE = TRUE),

-- Pedidos de Fóruns (antigos PEDIDO_FORUM)
(2, 'FORUM', 1, CURRENT_TIMESTAMP),   -- Pedido de fórum para JavaScript
(3, 'FORUM', 9, CURRENT_TIMESTAMP),   -- Pedido de fórum para Photoshop
(4, 'FORUM', 18, CURRENT_TIMESTAMP),  -- Pedido de fórum para Marketing no Instagram
(5, 'FORUM', 15, CURRENT_TIMESTAMP),  -- Pedido de fórum para Gestão de Projetos
(6, 'FORUM', 13, CURRENT_TIMESTAMP);  -- Pedido de fórum para Fotografia

-- Inserção na Tabela AULA (Ajustando datas para dentro do período do curso)
INSERT INTO AULA (FORMADOR_ID, SINCRONO_ID, DESCRICAO, HORA_INICIO, HORA_FIM) VALUES
(2, 1, 'Aula de Introdução ao JavaScript', '2024-02-05 09:00:00+00', '2024-02-05 11:00:00+00'),
(2, 3, 'Conceitos Avançados de React', '2024-02-20 14:00:00+00', '2024-02-20 16:00:00+00'),
(2, 1, 'Funções e Objetos em JavaScript', '2024-02-12 09:00:00+00', '2024-02-12 11:00:00+00'),
(2, 3, 'Hooks em React', '2024-02-27 14:00:00+00', '2024-02-27 16:00:00+00'),
(2, 1, 'DOM e Eventos', '2024-02-19 09:00:00+00', '2024-02-19 11:00:00+00'),
(2, 3, 'Estado e Props', '2024-03-05 14:00:00+00', '2024-03-05 16:00:00+00'),
(2, 1, 'Async/Await e Promises', '2024-02-26 09:00:00+00', '2024-02-26 11:00:00+00'),
(2, 3, 'Projeto Final React', '2024-03-12 14:00:00+00', '2024-03-12 16:00:00+00');

-- Inserção na Tabela PRESENCA_FORM_SINC
INSERT INTO PRESENCA_FORM_SINC (FORMANDO_ID, AULA_ID) VALUES
(1, 1), (2, 1), (1, 2), (3, 2),
(4, 3), (5, 3), (6, 4), (7, 4),
(8, 5), (9, 5), (10, 6), (1, 6),
(2, 7), (3, 7), (4, 8), (5, 8);

-- Inserção na Tabela INSCRICAO (Corrigindo inconsistências de datas e notas)
INSERT INTO INSCRICAO (FORMANDO_ID, CURSO_ID, NOTA, DATA_CERTIFICADO, DATA_INSCRICAO, ESTADO) VALUES
-- Inscrições em cursos CONCLUÍDOS (IDs 1, 2, 5, 10, 11, 12, 13, 14, 15, 16) - com notas e certificados
(3, 1, 17.0, '2024-02-28 10:00:00+00', '2024-01-10 10:00:00+00', TRUE),  -- Curso 1 concluído
(3, 2, 16.5, '2024-03-05 12:00:00+00', '2024-01-15 10:00:00+00', TRUE),  -- Curso 2 concluído
(1, 1, 17.0, '2024-02-28 10:00:00+00', '2024-01-10 10:00:00+00', TRUE),  -- Curso 1 concluído
(1, 2, 17.6, '2024-03-05 11:00:00+00', '2024-01-18 16:45:00+00', TRUE),  -- Curso 2 concluído
(1, 5, 15.8, '2024-04-15 14:00:00+00', '2024-02-25 09:30:00+00', TRUE),  -- Curso 5 concluído
(2, 1, 15.7, '2024-02-28 16:00:00+00', '2024-01-12 14:30:00+00', TRUE),  -- Curso 1 concluído
(2, 10, 17.2, '2024-05-15 10:00:00+00', '2024-03-28 15:00:00+00', TRUE), -- Curso 10 concluído
(4, 2, 17.6, '2024-03-05 11:00:00+00', '2024-01-20 16:45:00+00', TRUE),  -- Curso 2 concluído
(4, 11, 16.8, '2024-06-15 13:00:00+00', '2024-04-28 12:00:00+00', TRUE), -- Curso 11 concluído
(5, 12, 17.9, '2024-07-15 15:00:00+00', '2024-05-30 10:30:00+00', TRUE), -- Curso 12 concluído
(6, 1, 15.2, '2024-02-28 18:00:00+00', '2024-01-25 15:30:00+00', TRUE),  -- Curso 1 concluído
(6, 13, 16.4, '2024-08-15 11:00:00+00', '2024-06-28 14:20:00+00', TRUE), -- Curso 13 concluído
(7, 2, 17.8, '2024-03-05 16:00:00+00', '2024-02-01 10:15:00+00', TRUE),  -- Curso 2 concluído
(7, 14, 18.1, '2024-09-15 12:00:00+00', '2024-07-28 16:45:00+00', TRUE), -- Curso 14 concluído
(8, 15, 17.3, '2024-10-15 14:00:00+00', '2024-08-30 11:15:00+00', TRUE), -- Curso 15 concluído
(9, 1, 17.5, '2024-02-28 12:00:00+00', '2024-02-03 09:30:00+00', TRUE),  -- Curso 1 concluído
(9, 16, 16.7, '2024-11-15 13:00:00+00', '2024-09-28 10:45:00+00', TRUE), -- Curso 16 concluído
(10, 2, 18.0, '2024-03-05 15:00:00+00', '2024-02-04 11:15:00+00', TRUE), -- Curso 2 concluído
(10, 5, 17.4, '2024-04-15 16:00:00+00', '2024-03-01 13:30:00+00', TRUE), -- Curso 5 concluído

-- Inscrições em cursos EM ANDAMENTO ou FUTUROS (sem nota/certificado/estado TRUE)
(3, 3, NULL, NULL, '2025-04-01 09:15:00+00', FALSE),  -- Curso 3 em andamento
(2, 3, NULL, NULL, '2025-04-02 11:20:00+00', FALSE),  -- Curso 3 em andamento
(5, 3, NULL, NULL, '2025-04-03 11:20:00+00', FALSE),  -- Curso 3 em andamento
(8, 3, NULL, NULL, '2025-04-04 14:45:00+00', FALSE),  -- Curso 3 em andamento

-- Inscrições em cursos ATIVOS/FUTUROS (sem notas nem certificados)
-- Cursos a decorrer (17, 18, 19) - sem notas, logo ESTADO = FALSE
(3, 17, NULL, NULL, '2025-04-10 14:30:00+00', FALSE),  -- Curso 17 a decorrer - sem nota, não terminou
(1, 17, NULL, NULL, '2025-04-12 10:15:00+00', FALSE),  -- Curso 17 a decorrer - sem nota, não terminou
(5, 17, NULL, NULL, '2025-04-14 16:20:00+00', FALSE),  -- Curso 17 a decorrer - sem nota, não terminou
(8, 17, NULL, NULL, '2025-04-13 09:45:00+00', FALSE),  -- Curso 17 a decorrer - sem nota, não terminou
(3, 18, NULL, NULL, '2025-04-15 11:20:00+00', FALSE),  -- Curso 18 a decorrer - sem nota, não terminou
(2, 18, NULL, NULL, '2025-04-17 14:30:00+00', FALSE),  -- Curso 18 a decorrer - sem nota, não terminou
(3, 19, NULL, NULL, '2025-04-20 11:20:00+00', FALSE),  -- Curso 19 a decorrer - aluno ainda não terminou
(2, 19, NULL, NULL, '2025-04-22 15:45:00+00', FALSE),  -- Curso 19 a decorrer - aluno ainda não terminou
(6, 19, NULL, NULL, '2025-04-23 10:30:00+00', FALSE),  -- Curso 19 a decorrer - aluno ainda não terminou
(9, 19, NULL, NULL, '2025-04-24 13:15:00+00', FALSE),  -- Curso 19 a decorrer - aluno ainda não terminou

-- Cursos futuros (20, 21, 6, 7, 8, 9, 4) - inscrições ainda não abertas ou pendentes
(4, 20, NULL, NULL, '2025-06-25 16:45:00+00', FALSE), -- Curso 20 futuro - inscrição pendente
(7, 20, NULL, NULL, '2025-06-28 12:30:00+00', FALSE), -- Curso 20 futuro - inscrição pendente
(4, 21, NULL, NULL, '2025-07-10 16:45:00+00', FALSE), -- Curso 21 futuro - inscrição pendente
(7, 21, NULL, NULL, '2025-07-12 14:20:00+00', FALSE), -- Curso 21 futuro - inscrição pendente
(10, 21, NULL, NULL, '2025-07-14 11:30:00+00', FALSE), -- Curso 21 futuro - inscrição pendente
(6, 6, NULL, NULL, '2025-07-28 15:30:00+00', FALSE),  -- Curso 6 futuro - inscrição pendente
(1, 7, NULL, NULL, '2025-08-10 10:15:00+00', FALSE),  -- Curso 7 futuro - inscrição pendente
(5, 8, NULL, NULL, '2025-08-28 14:45:00+00', FALSE),  -- Curso 8 futuro - inscrição pendente
(9, 9, NULL, NULL, '2025-09-10 12:20:00+00', FALSE),  -- Curso 9 futuro - inscrição pendente
(8, 4, NULL, NULL, '2025-09-28 16:30:00+00', FALSE);  -- Curso 4 futuro - inscrição pendente

-- Inserção na Tabela TRABALHO
INSERT INTO TRABALHO (SINCRONO_ID, FORMANDO_ID, DESCRICAO, NOTA, DATA) VALUES
(1, 1, 'Trabalho Final - JavaScript', 17, '2024-02-25 23:59:00+00'),
(3, 2, 'Projeto React', 18, '2025-05-10 23:59:00+00'),
(1, 3, 'Exercício de JavaScript', 19, '2024-02-20 23:59:00+00'),
(3, 4, 'Implementação React', 16, '2025-05-25 23:59:00+00'),
(1, 5, 'Projeto de JavaScript', 18.5, '2024-02-22 23:59:00+00'),
(3, 6, 'Aplicação React', 15.5, '2025-06-10 23:59:00+00'),
(1, 7, 'Trabalho Final - JavaScript', NULL, '2024-02-25 23:59:00+00'),
(3, 8, 'Projeto React', NULL, '2025-06-25 23:59:00+00'),
(1, 9, 'Exercício de JavaScript', NULL, '2024-02-20 23:59:00+00'),
(3, 10, 'Implementação React', NULL, '2025-06-29 23:59:00+00');

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
(11, 4, 'SEO Avançado', 'Como otimizar um site para mecanismos de busca utilizando técnicas avançadas.'),
(14, 6, 'Edição de Vídeo Profissional', 'Aprendendo as técnicas de edição no Adobe Premiere para profissionais.'),
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
INSERT INTO QUIZZ (CURSO_ID, GESTOR_ID, DESCRICAO, NOTA, LIMITE_TEMPO) VALUES
(1, 1, 'Quiz Final de SQL', 10, 45),
(3, 1, 'Quiz Java Básico', 10, 30),
(1, 1, 'Quiz de Consultas SQL', 10, 25),
(3, 1, 'Quiz Spring Framework', 10, 40),
(1, 1, 'Quiz de Otimização', 10, 35),
(3, 1, 'Quiz Hibernate', 10, 30);

-- Inserção na Tabela QUESTOES_QUIZZ
INSERT INTO QUESTOES_QUIZZ (QUIZZ_ID, PERGUNTA) VALUES
(1, 'O que é uma chave primária?'),
(2, 'O que é uma classe em Java?'),
(3, 'Como fazer um JOIN em SQL?'),
(4, 'O que é Injeção de Dependência?'),
(5, 'Como otimizar uma query SQL?'),
(6, 'O que é o Hibernate?'),
(1, 'Diferença entre INNER e OUTER JOIN'),
(2, 'O que é polimorfismo?'),
(3, 'Como usar GROUP BY?'),
(4, 'O que é um Bean no Spring?');

-- Inserção na Tabela OPCOES_QUIZZ
INSERT INTO OPCOES_QUIZZ (QUESTAO_ID, TEXTO, CORRETA) VALUES
-- Opções para a questão "O que é uma chave primária?"
(1, 'Uma coluna que identifica unicamente uma linha na tabela', TRUE),
(1, 'Uma coluna que pode ter valores duplicados', FALSE),
(1, 'Uma coluna que armazena apenas números', FALSE),
(1, 'Uma coluna que não pode ser nula', FALSE),

-- Opções para a questão "O que é uma classe em Java?"
(2, 'É um molde para criar objetos', TRUE),
(2, 'É um método que retorna um valor', FALSE),
(2, 'É uma variável global', FALSE),
(2, 'É um tipo de loop', FALSE),

-- Opções para a questão "Como fazer um JOIN em SQL?"
(3, 'Usando a cláusula JOIN com a condição ON', TRUE),
(3, 'Usando a cláusula WHERE com AND', FALSE),
(3, 'Usando a cláusula FROM com vírgula', FALSE),
(3, 'Usando a cláusula SELECT com asterisco', FALSE),

-- Opções para a questão "O que é Injeção de Dependência?"
(4, 'É um padrão de design que permite injeção de dependências', TRUE),
(4, 'É um método de criptografia', FALSE),
(4, 'É um tipo de banco de dados', FALSE),
(4, 'É um padrão de interface gráfica', FALSE),

-- Opções para a questão "Como otimizar uma query SQL?"
(5, 'Usando índices e otimizando a estrutura da query', TRUE),
(5, 'Aumentando o tamanho do banco de dados', FALSE),
(5, 'Usando mais JOINs', FALSE),
(5, 'Adicionando mais colunas', FALSE),

-- Opções para a questão "O que é o Hibernate?"
(6, 'É um framework ORM para Java', TRUE),
(6, 'É um servidor web', FALSE),
(6, 'É um banco de dados', FALSE),
(6, 'É um framework frontend', FALSE),

-- Opções para a questão "Diferença entre INNER e OUTER JOIN"
(7, 'INNER retorna apenas matches, OUTER retorna todos os registros', TRUE),
(7, 'INNER é mais rápido que OUTER', FALSE),
(7, 'OUTER só funciona com chaves primárias', FALSE),
(7, 'INNER só funciona com chaves estrangeiras', FALSE),

-- Opções para a questão "O que é polimorfismo?"
(8, 'É a capacidade de um objeto se comportar de diferentes formas', TRUE),
(8, 'É um tipo de loop', FALSE),
(8, 'É um método de ordenação', FALSE),
(8, 'É um padrão de design', FALSE),

-- Opções para a questão "Como usar GROUP BY?"
(9, 'Usando GROUP BY com funções de agregação', TRUE),
(9, 'Usando GROUP BY com ORDER BY', FALSE),
(9, 'Usando GROUP BY com WHERE', FALSE),
(9, 'Usando GROUP BY com JOIN', FALSE),

-- Opções para a questão "O que é um Bean no Spring?"
(10, 'É um objeto gerenciado pelo container Spring', TRUE),
(10, 'É um tipo de banco de dados', FALSE),
(10, 'É um padrão de interface', FALSE),
(10, 'É um método de autenticação', FALSE);

-- Inserção na Tabela RESPOSTAS_QUIZZ
INSERT INTO RESPOSTAS_QUIZZ (FORMANDO_ID, QUESTAO_ID, OPCAO_ID) VALUES
(1, 1, 1),  -- Formando 1 respondeu corretamente à questão 1
(3, 2, 5),  -- Formando 3 respondeu corretamente à questão 2
(2, 3, 9),  -- Formando 2 respondeu corretamente à questão 3
(4, 4, 13), -- Formando 4 respondeu corretamente à questão 4
(5, 5, 17), -- Formando 5 respondeu corretamente à questão 5
(6, 6, 21), -- Formando 6 respondeu corretamente à questão 6
(7, 7, 25), -- Formando 7 respondeu corretamente à questão 7
(8, 8, 29), -- Formando 8 respondeu corretamente à questão 8
(9, 9, 33), -- Formando 9 respondeu corretamente à questão 9
(10, 10, 37); -- Formando 10 respondeu corretamente à questão 10

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

-- Inserção na Tabela AVALIACAO_FORMADOR
INSERT INTO AVALIACAO_FORMADOR (CURSO_ID, FORMADOR_ID, FORMANDO_ID, AVALIACAO) VALUES
(1, 2, 1, 5),  -- Formando 1 avaliou formador 2 no curso de JavaScript
(1, 2, 2, 4),  -- Formando 2 avaliou formador 2 no curso de JavaScript
(2, 2, 1, 4),  -- Formando 1 avaliou formador 2 no curso de Python
(2, 2, 4, 5),  -- Formando 4 avaliou formador 2 no curso de Python
(3, 2, 2, 5),  -- Formando 2 avaliou formador 2 no curso de React
(3, 2, 3, 4),  -- Formando 3 avaliou formador 2 no curso de React
(5, 3, 5, 4),  -- Formando 5 avaliou formador 3 no curso de Design Gráfico
(10, 5, 1, 5), -- Formando 1 avaliou formador 5 no curso de Gestão de Projetos
(11, 2, 5, 4), -- Formando 5 avaliou formador 2 no curso de Desenvolvimento Web
(12, 3, 8, 5); -- Formando 8 avaliou formador 3 no curso de Python para Data Science

-- Inserção na Tabela MATERIAL (Atualizado para refletir a estrutura correta)
INSERT INTO MATERIAL (CURSO_ID, TITULO, DESCRICAO, TIPO, SECAO, DATA_ENTREGA, DATA_CRIACAO) VALUES
-- Materiais para o curso de JavaScript (ID: 1)
(1, 'Introdução ao JavaScript', 'Conceitos básicos de JavaScript', 'documento', 'Fundamentos', NULL, CURRENT_TIMESTAMP),
(1, 'Variáveis e Tipos de Dados', 'Aprenda sobre variáveis e tipos de dados em JavaScript', 'documento', 'Fundamentos', NULL, CURRENT_TIMESTAMP),
(1, 'Funções em JavaScript', 'Tutorial sobre funções e escopo', 'video', 'Funções', NULL, CURRENT_TIMESTAMP),
(1, 'Arrays e Objetos', 'Manipulação de arrays e objetos em JavaScript', 'aula', 'Estruturas de Dados', NULL, CURRENT_TIMESTAMP),
(1, 'Projeto Final JavaScript', 'Desenvolva uma aplicação web completa', 'trabalho', 'Projeto Final', '2025-08-21 23:59:59+00', CURRENT_TIMESTAMP),
(1, 'Entrega Projeto Final JavaScript', 'Submissão do projeto final', 'entrega', 'Projeto Final', '2025-08-21 23:59:59+00', CURRENT_TIMESTAMP),

-- Materiais para o curso de Python (ID: 2)
(2, 'Introdução ao Python', 'Primeiros passos com Python', 'documento', 'Fundamentos', NULL, CURRENT_TIMESTAMP),
(2, 'Estruturas de Controle', 'If, else, loops e mais', 'video', 'Controle de Fluxo', NULL, CURRENT_TIMESTAMP),
(2, 'Manipulação de Arquivos', 'Como trabalhar com arquivos em Python', 'aula', 'I/O', NULL, CURRENT_TIMESTAMP),
(2, 'Projeto Python', 'Desenvolva um script Python', 'trabalho', 'Projeto', '2024-12-15 23:59:59+00', CURRENT_TIMESTAMP),
(2, 'Entrega Projeto Python', 'Submissão do projeto Python', 'entrega', 'Projeto', '2024-12-15 23:59:59+00', CURRENT_TIMESTAMP),

-- Materiais para o curso de React (ID: 3)
(3, 'Introdução ao React', 'Conceitos básicos do React', 'documento', 'Fundamentos', NULL, CURRENT_TIMESTAMP),
(3, 'Componentes React', 'Criando e usando componentes', 'video', 'Componentes', NULL, CURRENT_TIMESTAMP),
(3, 'Hooks em React', 'UseState e useEffect', 'aula', 'Hooks', NULL, CURRENT_TIMESTAMP),
(3, 'Projeto React', 'Desenvolva uma aplicação React', 'trabalho', 'Projeto Final', '2025-06-29 23:59:59+00', CURRENT_TIMESTAMP),
(3, 'Entrega Projeto React', 'Submissão do projeto React', 'entrega', 'Projeto Final', '2025-06-29 23:59:59+00', CURRENT_TIMESTAMP);

-- Inserção na Tabela OBJETO para materiais (IDs 1-13)
INSERT INTO OBJETO (REGISTO_ID, ENTIDADE) VALUES
(1, 'material'),
(2, 'material'),
(3, 'material'),
(4, 'material'),
(5, 'material'),
(6, 'material'),
(7, 'material'),
(8, 'material'),
(9, 'material'),
(10, 'material'),
(11, 'material'),
(12, 'material'),
(13, 'material');

-- Inserção na Tabela OBJETO para TODOS os cursos (IDs 1-35)
INSERT INTO OBJETO (REGISTO_ID, ENTIDADE) VALUES
-- Cursos síncronos (IDs 1-21)
(1, 'curso'),
(2, 'curso'),
(3, 'curso'),
(4, 'curso'),
(5, 'curso'),
(6, 'curso'),
(7, 'curso'),
(8, 'curso'),
(9, 'curso'),
(10, 'curso'),
(11, 'curso'),
(12, 'curso'),
(13, 'curso'),
(14, 'curso'),
(15, 'curso'),
(16, 'curso'),
(17, 'curso'),
(18, 'curso'),
(19, 'curso'),
(20, 'curso'),
(21, 'curso'),
-- Cursos assíncronos (IDs 22-35)
(22, 'curso'),
(23, 'curso'),
(24, 'curso'),
(25, 'curso'),
(26, 'curso'),
(27, 'curso'),
(28, 'curso'),
(29, 'curso'),
(30, 'curso'),
(31, 'curso'),
(32, 'curso'),
(33, 'curso'),
(34, 'curso'),
(35, 'curso');

-- Inserção na Tabela OBJETO para colaboradores (IDs 1-10)
INSERT INTO OBJETO (REGISTO_ID, ENTIDADE) VALUES
(1, 'colaborador'),
(2, 'colaborador'),
(3, 'colaborador'),
(4, 'colaborador'),
(5, 'colaborador'),
(6, 'colaborador'),
(7, 'colaborador'),
(8, 'colaborador'),
(9, 'colaborador'),
(10, 'colaborador');

-- Inserção na Tabela FICHEIRO para materiais
INSERT INTO FICHEIRO (OBJETO_ID, NOME, EXTENSAO, TAMANHO, DATA_CRIACAO, DATA_ALTERACAO) VALUES
(1, 'introducao_js.pdf', 'pdf', 1024, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'variaveis_js.pdf', 'pdf', 1536, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'funcoes_js.mp4', 'mp4', 5120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'arrays_objetos.pdf', 'pdf', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'projeto_final.pdf', 'pdf', 4096, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'introducao_python.pdf', 'pdf', 1024, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'estruturas_controle.mp4', 'mp4', 4096, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'manipulacao_arquivos.pdf', 'pdf', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'projeto_python.pdf', 'pdf', 3072, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'introducao_react.pdf', 'pdf', 1024, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'componentes_react.mp4', 'mp4', 5120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'hooks_react.pdf', 'pdf', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'projeto_react.pdf', 'pdf', 4096, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserção na Tabela FICHEIRO para alguns cursos síncronos (IDs dos objetos curso)
-- Assumindo que os objetos curso têm IDs sequenciais a partir do próximo ID disponível
-- Materiais: 1-13, Cursos: 14-48, Colaboradores: 49-58
INSERT INTO FICHEIRO (OBJETO_ID, NOME, EXTENSAO, TAMANHO, DATA_CRIACAO, DATA_ALTERACAO) VALUES
(14, 'curso1_sincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'curso2_sincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 'curso3_sincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 'curso4_sincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 'curso5_sincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserção na Tabela FICHEIRO para colaboradores (IDs dos objetos colaborador)
INSERT INTO FICHEIRO (OBJETO_ID, NOME, EXTENSAO, TAMANHO, DATA_CRIACAO, DATA_ALTERACAO) VALUES
(49, 'colaborador1.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(50, 'colaborador2.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(51, 'colaborador3.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(52, 'colaborador4.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(53, 'colaborador5.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(54, 'colaborador6.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(55, 'colaborador7.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(56, 'colaborador8.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(57, 'colaborador9.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(58, 'colaborador10.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserção na Tabela FICHEIRO para alguns cursos assíncronos (IDs dos objetos curso)
INSERT INTO FICHEIRO (OBJETO_ID, NOME, EXTENSAO, TAMANHO, DATA_CRIACAO, DATA_ALTERACAO) VALUES
(35, 'curso22_assincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(36, 'curso23_assincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(37, 'curso24_assincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(38, 'curso25_assincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(39, 'curso26_assincrono.jpg', 'jpg', 2048, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);