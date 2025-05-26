-- First drop all tables in reverse order of dependencies
DROP TABLE IF EXISTS AVALIACAO_FORMADOR;
DROP TABLE IF EXISTS AVALIACAO_QUIZZ;
DROP TABLE IF EXISTS RESPOSTAS_QUIZZ;
DROP TABLE IF EXISTS QUESTOES_QUIZZ;
DROP TABLE IF EXISTS QUIZZ;
DROP TABLE IF EXISTS NOTIFICACOES_FORMANDO;
DROP TABLE IF EXISTS PEDIDOS;
DROP TABLE IF EXISTS PREFERENCIAS_CATEGORIA;
DROP TABLE IF EXISTS NOTIFICACAO;
DROP TABLE IF EXISTS TRABALHOS_FORMANDO;
DROP TABLE IF EXISTS TRABALHO;
DROP TABLE IF EXISTS MATERIAL;
DROP TABLE IF EXISTS INSCRICAO;
DROP TABLE IF EXISTS PRESENCA_FORM_SINC;
DROP TABLE IF EXISTS AULA;
DROP TABLE IF EXISTS FICHEIRO;
DROP TABLE IF EXISTS ALBUM;
DROP TABLE IF EXISTS ANEXO;
DROP TABLE IF EXISTS OBJETO;
DROP TABLE IF EXISTS SINCRONO;
DROP TABLE IF EXISTS ASSINCRONO;
DROP TABLE IF EXISTS CURSO_COPIA;
DROP TABLE IF EXISTS CURSO;
DROP TABLE IF EXISTS COMENTARIO_RESPOSTA;
DROP TABLE IF EXISTS COMENTARIOS;
DROP TABLE IF EXISTS DENUNCIAS;
DROP TABLE IF EXISTS THREADS_AVALIACAO;
DROP TABLE IF EXISTS THREADS;
DROP TABLE IF EXISTS FORMANDO;
DROP TABLE IF EXISTS FORMADOR;
DROP TABLE IF EXISTS GESTOR;
DROP TABLE IF EXISTS COLABORADOR;
DROP TABLE IF EXISTS FORUM;
DROP TABLE IF EXISTS TOPICO;
DROP TABLE IF EXISTS AREA;
DROP TABLE IF EXISTS CATEGORIA;
DROP TABLE IF EXISTS FUNCAO;
DROP TABLE IF EXISTS DEPARTAMENTO;

/*==============================================================*/
/* Table: DEPARTAMENTO                                          */
/*==============================================================*/
CREATE TABLE DEPARTAMENTO (
   DEPARTAMENTO_ID      SERIAL NOT NULL UNIQUE,
   NOME                 TEXT NOT NULL,
   CONSTRAINT PK_DEPARTAMENTO PRIMARY KEY (DEPARTAMENTO_ID)
);

/*==============================================================*/
/* Table: FUNCAO                                                */
/*==============================================================*/
CREATE TABLE FUNCAO (
   FUNCAO_ID            SERIAL NOT NULL UNIQUE,
   DEPARTAMENTO_ID      INTEGER NOT NULL,
   NOME                 TEXT NOT NULL,
   CONSTRAINT PK_FUNCAO PRIMARY KEY (FUNCAO_ID),
   CONSTRAINT FK_FUNCAO_DEPARTAMENTO FOREIGN KEY (DEPARTAMENTO_ID)
      REFERENCES DEPARTAMENTO (DEPARTAMENTO_ID)
);

/*==============================================================*/
/* Table: CATEGORIA                                             */
/*==============================================================*/
CREATE TABLE CATEGORIA (
   CATEGORIA_ID         SERIAL NOT NULL UNIQUE,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT PK_CATEGORIA PRIMARY KEY (CATEGORIA_ID)
);

/*==============================================================*/
/* Table: AREA                                                  */
/*==============================================================*/
CREATE TABLE AREA (
   AREA_ID              SERIAL NOT NULL UNIQUE,
   CATEGORIA_ID         INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT PK_AREA PRIMARY KEY (AREA_ID),
   CONSTRAINT FK_CATEGORIA FOREIGN KEY (CATEGORIA_ID)
      REFERENCES CATEGORIA (CATEGORIA_ID)
);

/*==============================================================*/
/* Table: TOPICO                                                */
/*==============================================================*/
CREATE TABLE TOPICO (
   TOPICO_ID            SERIAL NOT NULL UNIQUE,
   AREA_ID              INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT PK_TOPICO PRIMARY KEY (TOPICO_ID),
   CONSTRAINT FK_TOPICO_AREA FOREIGN KEY (AREA_ID)
      REFERENCES AREA (AREA_ID)
);

/*==============================================================*/
/* Table: FORUM                                                 */
/*==============================================================*/
CREATE TABLE FORUM (
   FORUM_ID             SERIAL PRIMARY KEY, 
   TOPICO_ID            INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   APROVADO             BOOLEAN NOT NULL DEFAULT FALSE,
   PENDENTE             BOOLEAN NOT NULL DEFAULT FALSE,
   CONSTRAINT FK_FORUM_TOPICO FOREIGN KEY (TOPICO_ID)
      REFERENCES TOPICO (TOPICO_ID)
);

/*==============================================================*/
/* Table: COLABORADOR (SCORE consoante tempo curso)             */
/*==============================================================*/
CREATE TABLE COLABORADOR (
   COLABORADOR_ID       SERIAL NOT NULL UNIQUE,
   NOME                 TEXT NOT NULL,
   EMAIL                TEXT NOT NULL UNIQUE,
   USERNAME             TEXT NOT NULL UNIQUE,
   PSSWORD              TEXT NOT NULL,
   DATA_NASC            DATE NULL,
   FUNCAO_ID            INTEGER NULL,
   TELEFONE             NUMERIC(9) NOT NULL UNIQUE,
   SOBRE_MIM            TEXT NULL,
   SCORE                INTEGER DEFAULT 0,
   INATIVO              BOOLEAN DEFAULT FALSE,
   LAST_LOGIN           TIMESTAMPTZ NULL,
   CONSTRAINT PK_COLAB PRIMARY KEY (COLABORADOR_ID),
   CONSTRAINT FK_COLAB_FUNCAO FOREIGN KEY (FUNCAO_ID)
      REFERENCES FUNCAO (FUNCAO_ID)
);

/*==============================================================*/
/* Table: GESTOR                                                */
/*==============================================================*/
CREATE TABLE GESTOR (
   GESTOR_ID            SERIAL NOT NULL UNIQUE,
   CONSTRAINT PK_GESTOR PRIMARY KEY (GESTOR_ID),
   CONSTRAINT FK_GESTOR_COLAB FOREIGN KEY (GESTOR_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: FORMADOR                                              */
/*==============================================================*/
CREATE TABLE FORMADOR (
   FORMADOR_ID          SERIAL NOT NULL UNIQUE,
   ESPECIALIDADE        TEXT NULL,
   CONSTRAINT PK_FORMADOR PRIMARY KEY (FORMADOR_ID),
   CONSTRAINT FK_FORMADOR_COLAB FOREIGN KEY (FORMADOR_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: FORMANDO                                              */
/*==============================================================*/
CREATE TABLE FORMANDO (
   FORMANDO_ID          SERIAL NOT NULL UNIQUE,
   CONSTRAINT PK_FORMANDO PRIMARY KEY (FORMANDO_ID),
   CONSTRAINT FK_FORMANDO_COLAB FOREIGN KEY (FORMANDO_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: THREADS                                               */
/*==============================================================*/
CREATE TABLE THREADS (
   THREAD_ID            SERIAL PRIMARY KEY,
   FORUM_ID             INTEGER NOT NULL,
   COLABORADOR_ID       INTEGER NOT NULL,
   TITULO               TEXT NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT FK_THREAD_FORUM FOREIGN KEY (FORUM_ID)
      REFERENCES FORUM (FORUM_ID),
   CONSTRAINT FK_THREAD_USER FOREIGN KEY (COLABORADOR_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/* Apenas formandos podem dar vote/nota, porque ser for USER_ID a mesma pessoa(formando/formador) com contas diferentes vota duas vezes */
/*==============================================================*/
/* Table: THREADS_AVALIACAO                                     */
/*==============================================================*/
CREATE TABLE THREADS_AVALIACAO (
   THREAD_ID            INTEGER NOT NULL,
   FORMANDO_ID          INTEGER NOT NULL,
   VOTE                 INTEGER NOT NULL CHECK (VOTE IN (1, -1)),
   CONSTRAINT PK_THREAD_AVALIACAO PRIMARY KEY (THREAD_ID, FORMANDO_ID),
   CONSTRAINT FK_THREAD_AVALIACAO FOREIGN KEY (THREAD_ID)
      REFERENCES THREADS (THREAD_ID),
   CONSTRAINT FK_THREAD_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: THREADS_DENUNCIAS (CHECK S - SPAWM, I - INAPROPRIADO, O - OUTRO */
/*==============================================================*/
CREATE TABLE DENUNCIAS (
   DENUNCIA_ID          SERIAL NOT NULL UNIQUE,
   THREAD_ID            INTEGER NOT NULL,
   FORMANDO_ID          INTEGER NOT NULL,
   MOTIVO				   TEXT NOT NULL CHECK (MOTIVO IN ('S', 'I', 'O')),
   DESCRICAO            TEXT NOT NULL,
   DATA                 TIMESTAMPTZ NOT NULL,
   CONSTRAINT PK_THREAD_DENUNCIAS PRIMARY KEY (DENUNCIA_ID),
   CONSTRAINT FK_THREAD_DENUNCIAS FOREIGN KEY (THREAD_ID)
      REFERENCES THREADS (THREAD_ID),
   CONSTRAINT FK_THREAD_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: COMENTARIOS                                           */
/*==============================================================*/
CREATE TABLE COMENTARIOS (
   COMENTARIO_ID        SERIAL PRIMARY KEY,
   THREAD_ID            INTEGER NOT NULL,
   COLABORADOR_ID       INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT FK_COMENTARIO_THREAD FOREIGN KEY (THREAD_ID)
      REFERENCES THREADS (THREAD_ID),
   CONSTRAINT FK_COMENTARIO_COLAB FOREIGN KEY (COLABORADOR_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: COMENTARIO_RESPOSTA                                   */
/*==============================================================*/
CREATE TABLE COMENTARIO_RESPOSTA (
    RESPOSTA_ID           INTEGER NOT NULL,
    COMENTARIOPAI_ID      INTEGER NOT NULL,
    PRIMARY KEY (RESPOSTA_ID, COMENTARIOPAI_ID),
    CONSTRAINT FK_RESPOSTA_COMENTARIO FOREIGN KEY (RESPOSTA_ID) 
        REFERENCES COMENTARIOS (COMENTARIO_ID),
    CONSTRAINT FK_COMENTARIOPAI_COMENTARIO FOREIGN KEY (COMENTARIOPAI_ID) 
        REFERENCES COMENTARIOS (COMENTARIO_ID)
);

/*==============================================================*/
/* Table: CURSO                                                 */
/* Nível 1 a 4 - Iniciante, Intermédio, Avançado e Expert       */
/*==============================================================*/
CREATE TABLE CURSO (
   CURSO_ID             SERIAL PRIMARY KEY,
   GESTOR_ID            INTEGER NOT NULL,
   TOPICO_ID            INTEGER NOT NULL,
   TIPO                 TEXT NOT NULL CHECK (TIPO IN ('S', 'A')),
   TOTAL_HORAS          INTEGER NOT NULL,
   TITULO               TEXT NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   APROVADO             BOOLEAN NOT NULL DEFAULT FALSE,
   PENDENTE             BOOLEAN NOT NULL,
   CERTIFICADO          BOOLEAN NOT NULL,
   NIVEL                INTEGER NOT NULL CHECK (NIVEL IN (1, 2, 3, 4)),
   CONSTRAINT FK_CURSO_GESTOR FOREIGN KEY (GESTOR_ID)
      REFERENCES GESTOR (GESTOR_ID),
   CONSTRAINT FK_CURSO_TOPICO FOREIGN KEY (TOPICO_ID)
      REFERENCES TOPICO (TOPICO_ID)
);

/*==============================================================*/
/* Table: CURSO_COPIA                                           */
/*==============================================================*/
CREATE TABLE CURSO_COPIA (
   CURSO_COPIA_ID       INTEGER NOT NULL,
   PARENT_CURSO_ID      INTEGER NOT NULL,
   PRIMARY KEY (CURSO_COPIA_ID, PARENT_CURSO_ID),
   CONSTRAINT FK_CURSO_COPIA_CURSO FOREIGN KEY (CURSO_COPIA_ID)
      REFERENCES CURSO (CURSO_ID),
   CONSTRAINT FK_PARENT_CURSO_CURSO FOREIGN KEY (PARENT_CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: ASSINCRONO                                            */
/*==============================================================*/
CREATE TABLE ASSINCRONO (
   CURSO_ID             INTEGER NOT NULL UNIQUE,
   CONSTRAINT PK_ASSINCRONO PRIMARY KEY (CURSO_ID),
   CONSTRAINT FK_ASSINCRONO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: SINCRONO                                              */
/*==============================================================*/
CREATE TABLE SINCRONO (
   CURSO_ID                INTEGER NOT NULL UNIQUE,
   FORMADOR_ID             INTEGER NOT NULL,
   LIMITE_VAGAS            INTEGER NOT NULL,
   DATA_LIMITE_INSCRICAO   TIMESTAMP NULL,  
   DATA_INICIO             TIMESTAMP NULL,
   DATA_FIM                TIMESTAMP NULL,
   ESTADO                  BOOLEAN NULL,
   CONSTRAINT PK_SINCRONO PRIMARY KEY (CURSO_ID),
   CONSTRAINT FK_FORMADOR FOREIGN KEY (FORMADOR_ID)
      REFERENCES FORMADOR (FORMADOR_ID),
   CONSTRAINT FK_SINCRONO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: OBJETO (THREADS, COLABORADORES, CURSOS)               */
/*==============================================================*/
CREATE TABLE OBJETO (
   OBJETO_ID            SERIAL NOT NULL UNIQUE,
   REGISTO_ID           INTEGER NOT NULL,
   ENTIDADE             TEXT NOT NULL,
   CONSTRAINT PK_OBJETO PRIMARY KEY (OBJETO_ID),
   CONSTRAINT UK_REGISTO_ENTIDADE UNIQUE (REGISTO_ID, ENTIDADE)
);

/*==============================================================*/
/* Table: FICHEIRO                                              */
/*==============================================================*/
CREATE TABLE FICHEIRO (
   FICHEIRO_ID          SERIAL NOT NULL UNIQUE,
   OBJETO_ID            INTEGER NOT NULL,
   NOME                 TEXT NOT NULL,
   EXTENSAO             TEXT NOT NULL,
   TAMANHO              INTEGER NOT NULL,
   DATA_CRIACAO         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   DATA_ALTERACAO       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT PK_FICHEIRO PRIMARY KEY (FICHEIRO_ID),
   CONSTRAINT FK_FICHEIRO_OBJETO FOREIGN KEY (OBJETO_ID)
      REFERENCES OBJETO (OBJETO_ID)
);

/*==============================================================*/
/* Table: Aula                                                  */
/*==============================================================*/
CREATE TABLE AULA (
   AULA_ID              SERIAL NOT NULL UNIQUE,
   FORMADOR_ID          INTEGER NOT NULL,
   SINCRONO_ID          INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   HORA_INICIO          TIMESTAMPTZ NOT NULL,
   HORA_FIM             TIMESTAMPTZ NOT NULL,
   CONSTRAINT PK_AULA PRIMARY KEY (AULA_ID),
   CONSTRAINT FK_AULA_PERTENCE_SINCRONO FOREIGN KEY (SINCRONO_ID)
      REFERENCES SINCRONO (CURSO_ID),
   CONSTRAINT FK_AULA_LECCIONA2_FORMADOR FOREIGN KEY (FORMADOR_ID)
      REFERENCES FORMADOR (FORMADOR_ID)
);

/*==============================================================*/
/* Table: PRESENCA_FORM_SINC                                    */
/*==============================================================*/
CREATE TABLE PRESENCA_FORM_SINC (
   FORMANDO_ID           INTEGER NOT NULL,
   AULA_ID               INTEGER NOT NULL,
   CONSTRAINT PK_PRESENCA PRIMARY KEY (FORMANDO_ID, AULA_ID),
   CONSTRAINT FK_PRESENCA_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID),
   CONSTRAINT FK_PRESENCA_AULA FOREIGN KEY (AULA_ID)
      REFERENCES AULA (AULA_ID)
);

/*==============================================================*/
/* Table: INSCRICAO                                             */
/*==============================================================*/
CREATE TABLE INSCRICAO (
   INSCRICAO_ID         SERIAL NOT NULL UNIQUE,
   FORMANDO_ID          INTEGER NOT NULL,
   CURSO_ID             INTEGER NOT NULL,
   NOTA                 FLOAT NULL DEFAULT 0,
   DATA_CERTIFICADO     TIMESTAMPTZ NULL,
   DATA_INSCRICAO       TIMESTAMPTZ NOT NULL,
   ESTADO               BOOLEAN NOT NULL,
   CONSTRAINT PK_INSCRICAO PRIMARY KEY (INSCRICAO_ID),
   CONSTRAINT FK_INSCRICA_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID),
   CONSTRAINT FK_INSCRICAO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: MATERIAL                                              */
/*==============================================================*/
CREATE TABLE MATERIAL (
   MATERIAL_ID          SERIAL NOT NULL UNIQUE,
   CURSO_ID             INTEGER NOT NULL,
   TITULO               TEXT NOT NULL,
   DESCRICAO            TEXT NULL,
   TIPO                 TEXT NOT NULL CHECK (TIPO IN ('documento', 'video', 'aula', 'trabalho', 'entrega')),
   SECAO                TEXT NULL,
   DATA_ENTREGA         TIMESTAMPTZ NULL,
   DATA_CRIACAO         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT PK_MATERIAL PRIMARY KEY (MATERIAL_ID),
   CONSTRAINT FK_MATERIAL_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: TRABALHO                                              */
/*==============================================================*/
CREATE TABLE TRABALHO (
   TRABALHO_ID          SERIAL NOT NULL UNIQUE,
   SINCRONO_ID          INTEGER NOT NULL,
   FORMANDO_ID          INTEGER NOT NULL,
   DESCRICAO            TEXT NULL,
   NOTA                 FLOAT NULL,
   DATA                 TIMESTAMPTZ NULL,
   CONSTRAINT PK_TRABALHO PRIMARY KEY (TRABALHO_ID),
   CONSTRAINT FK_SINCRONO_TRABALHO FOREIGN KEY (SINCRONO_ID)
      REFERENCES SINCRONO (CURSO_ID),
   CONSTRAINT FK_FORMANDO_TRABALHO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: NOTIFICACAO                                           */
/*==============================================================*/
CREATE TABLE NOTIFICACAO (
   NOTIFICACAO_ID       SERIAL NOT NULL UNIQUE,
   FORMANDO_ID          INTEGER NOT NULL,
   CURSO_ID             INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   DATA_CRIACAO         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   LIDA                 BOOLEAN DEFAULT FALSE,
   CONSTRAINT PK_NOTIFICACAO PRIMARY KEY (NOTIFICACAO_ID),
   CONSTRAINT FK_NOTIFICACAO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID),
   CONSTRAINT FK_NOTIFICACAO_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: PREFERENCIAS                                          */
/*==============================================================*/
CREATE TABLE PREFERENCIAS_CATEGORIA (
   PREFERENCIA_ID       SERIAL NOT NULL UNIQUE,
   FORMANDO_ID          INTEGER NOT NULL,
   DESIGNACAO           TEXT NOT NULL,
   CONSTRAINT PK_PREFERENCIAS PRIMARY KEY (PREFERENCIA_ID),
   CONSTRAINT FK_PREFERENCIAS_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: PEDIDOS                                               */
/*==============================================================*/
CREATE TABLE PEDIDOS (
   PEDIDO_ID            SERIAL PRIMARY KEY,
   COLABORADOR_ID       INTEGER NOT NULL,
   TIPO                 TEXT NOT NULL CHECK (TIPO IN ('CURSO', 'FORUM')),
   REFERENCIA_ID        INTEGER NOT NULL, -- CURSO_ID ou TOPICO_ID dependendo do tipo
   DATA                 TIMESTAMPTZ NOT NULL,
   CONSTRAINT FK_PEDIDOS_COLABORADOR FOREIGN KEY (COLABORADOR_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: NOTIFICACOES_FORMANDO                                 */
/*==============================================================*/
CREATE TABLE NOTIFICACOES_FORMANDO (
   FORMANDO_ID          INTEGER NOT NULL,
   NOTIFICACAO_ID       INTEGER NOT NULL,
   CONSTRAINT PK_NOTIFICACOES_FORMANDO PRIMARY KEY (FORMANDO_ID, NOTIFICACAO_ID),
   CONSTRAINT FK_NOTIFICACOES_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID),
   CONSTRAINT FK_NOTIFICACAO_ID FOREIGN KEY (NOTIFICACAO_ID)
      REFERENCES NOTIFICACAO (NOTIFICACAO_ID)
);

/*==============================================================*/
/* Table: QUIZZ                                                 */
/*==============================================================*/
CREATE TABLE QUIZZ (
   QUIZZ_ID             INTEGER NOT NULL UNIQUE,
   CURSO_ID             INTEGER NOT NULL,
   GESTOR_ID            INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   TIPO                 TEXT NULL,
   LIMITE_TEMPO         INTEGER NOT NULL,
   CONSTRAINT PK_QUIZZ PRIMARY KEY (QUIZZ_ID),
   CONSTRAINT FK_QUIZZ_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID),
   CONSTRAINT FK_QUIZZ_GESTOR FOREIGN KEY (GESTOR_ID)
      REFERENCES GESTOR (GESTOR_ID)
);

/*==============================================================*/
/* Table: QUESTOES_QUIZZ                                        */
/*==============================================================*/
CREATE TABLE QUESTOES_QUIZZ (
   QUESTAO_ID           INTEGER NOT NULL UNIQUE,
   QUIZZ_ID             INTEGER NOT NULL,
   PERGUNTA             TEXT NOT NULL,
   CONSTRAINT PK_QUESTOES_QUIZZ PRIMARY KEY (QUESTAO_ID),
   CONSTRAINT FK_QUESTOES_QUIZZ FOREIGN KEY (QUIZZ_ID)
      REFERENCES QUIZZ (QUIZZ_ID)
);

/*==============================================================*/
/* Table: RESPOSTAS_QUIZZ                                       */
/*==============================================================*/
CREATE TABLE RESPOSTAS_QUIZZ (
   FORMANDO_ID          INTEGER NOT NULL,
   QUESTAO_ID           INTEGER NOT NULL,
   RESPOSTA             TEXT NOT NULL,
   CONSTRAINT PK_RESPOSTAS_QUIZZ PRIMARY KEY (FORMANDO_ID, QUESTAO_ID),
   CONSTRAINT FK_RESPOSTAS_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID),
   CONSTRAINT FK_RESPOSTAS_QUESTAO FOREIGN KEY (QUESTAO_ID)
      REFERENCES QUESTOES_QUIZZ (QUESTAO_ID)
);

/*==============================================================*/
/* Table: AVALIACAO_QUIZZ                                       */
/*==============================================================*/
CREATE TABLE AVALIACAO_QUIZZ (
   QUIZZ_ID             INTEGER NOT NULL,
   FORMANDO_ID          INTEGER NOT NULL,
   NOTA                 FLOAT NOT NULL,
   CONSTRAINT PK_AVALIACAO_QUIZZ PRIMARY KEY (QUIZZ_ID, FORMANDO_ID),
   CONSTRAINT FK_AVALIACAO_QUIZZ FOREIGN KEY (QUIZZ_ID)
      REFERENCES QUIZZ (QUIZZ_ID),
   CONSTRAINT FK_AVALIACAO_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: AVALIACAO_FORMADOR                                    */
/*==============================================================*/
CREATE TABLE AVALIACAO_FORMADOR (
   AVALIACAO_ID         SERIAL PRIMARY KEY,
   CURSO_ID             INTEGER NOT NULL,
   FORMADOR_ID          INTEGER NOT NULL,
   AVALIACAO            INTEGER NOT NULL CHECK (AVALIACAO BETWEEN 1 AND 5),
   DATA_AVALIACAO       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT FK_AVALIACAO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID),
   CONSTRAINT FK_AVALIACAO_FORMADOR FOREIGN KEY (FORMADOR_ID)
      REFERENCES FORMADOR (FORMADOR_ID)
);