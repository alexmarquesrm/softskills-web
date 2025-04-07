DROP TABLE IF EXISTS AVALIACAO_QUIZZ CASCADE;
DROP TABLE IF EXISTS QUESTOES_QUIZZ CASCADE;
DROP TABLE IF EXISTS RESPOSTAS_QUIZZ CASCADE;
DROP TABLE IF EXISTS QUIZZ CASCADE;
DROP TABLE IF EXISTS NOTIFICACOES_FORMANDO CASCADE;
DROP TABLE IF EXISTS NOTIFICACAO CASCADE;
DROP TABLE IF EXISTS TRABALHOS_FORMANDO CASCADE;
DROP TABLE IF EXISTS TRABALHO CASCADE;
DROP TABLE IF EXISTS INSCRICAO CASCADE;
DROP TABLE IF EXISTS GESTOR CASCADE;
DROP TABLE IF EXISTS PRESENCA_FORM_SINC CASCADE;
DROP TABLE IF EXISTS AULA CASCADE;
DROP TABLE IF EXISTS FORMANDO CASCADE;
DROP TABLE IF EXISTS SINCRONO CASCADE;
DROP TABLE IF EXISTS ASSINCRONO CASCADE;
DROP TABLE IF EXISTS CURSO_COPIA CASCADE;
DROP TABLE IF EXISTS CURSO CASCADE;
DROP TABLE IF EXISTS FORMADOR CASCADE;
DROP TABLE IF EXISTS CREDENCIAIS CASCADE;
DROP TABLE IF EXISTS COLABORADOR CASCADE;
DROP TABLE IF EXISTS FORUM CASCADE;
DROP TABLE IF EXISTS TOPICO CASCADE;
DROP TABLE IF EXISTS AREA CASCADE;
DROP TABLE IF EXISTS CATEGORIA CASCADE;
DROP TABLE IF EXISTS ALBUM CASCADE;
DROP TABLE IF EXISTS ANEXO CASCADE;
DROP TABLE IF EXISTS OBJETO CASCADE;
DROP TABLE IF EXISTS THREADS CASCADE;
DROP TABLE IF EXISTS THREADS_AVALIACAO CASCADE;
DROP TABLE IF EXISTS DENUNCIAS CASCADE;
DROP TABLE IF EXISTS COMENTARIOS CASCADE;
DROP TABLE IF EXISTS COMENTARIO_RESPOSTA CASCADE;

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
   AREA_ID               SERIAL NOT NULL UNIQUE,
   CATEGORIA_ID          INTEGER NOT NULL,
   DESCRICAO             TEXT NOT NULL,
   CONSTRAINT PK_AREA PRIMARY KEY (AREA_ID),
   CONSTRAINT FK_CATEGORIA FOREIGN KEY (CATEGORIA_ID)
      REFERENCES CATEGORIA (CATEGORIA_ID)
);

/*==============================================================*/
/* Table: TOPICO                                                */
/*==============================================================*/
CREATE TABLE TOPICO (
   TOPICO_ID             SERIAL NOT NULL UNIQUE,
   AREA_ID               INTEGER NOT NULL,
   DESCRICAO             TEXT NOT NULL,
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
   IDADE                INTEGER NOT NULL,
   CARGO                TEXT NOT NULL,
   DEPARTAMENTO         TEXT NOT NULL,
   TELEFONE             NUMERIC(9) NOT NULL UNIQUE,
   SCORE                INTEGER DEFAULT 0,
   CONSTRAINT PK_COLAB PRIMARY KEY (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: CREDENCIAIS                                            */
/*==============================================================*/
CREATE TABLE CREDENCIAIS (
   CREDENCIAL_ID        SERIAL NOT NULL UNIQUE,
   COLABORADOR_ID       INTEGER NOT NULL,
   LOGIN                TEXT NOT NULL UNIQUE,
   PASSWORD             TEXT NOT NULL,
   CONSTRAINT PK_CREDENCIAIS PRIMARY KEY (CREDENCIAL_ID),
   CONSTRAINT FK_USER_COLAB FOREIGN KEY (COLABORADOR_ID)
      REFERENCES COLABORADOR (COLABORADOR_ID)
);

/*==============================================================*/
/* Table: GESTOR                                                */
/*==============================================================*/
CREATE TABLE GESTOR (
   GESTOR_ID             SERIAL NOT NULL UNIQUE,
   CONSTRAINT PK_GESTOR PRIMARY KEY (GESTOR_ID),
   CONSTRAINT FK_GESTOR_LOGIN_USER FOREIGN KEY (GESTOR_ID)
      REFERENCES CREDENCIAIS (CREDENCIAL_ID)
);

/*==============================================================*/
/* Table: FORMADOR                                              */
/*==============================================================*/
CREATE TABLE FORMADOR (
   FORMADOR_ID          SERIAL NOT NULL UNIQUE,
   ESPECIALIDADE        TEXT NULL,
   CONSTRAINT PK_FORMADOR PRIMARY KEY (FORMADOR_ID),
   CONSTRAINT FK_FORMADOR_LOGIN_USER FOREIGN KEY (FORMADOR_ID)
      REFERENCES CREDENCIAIS (CREDENCIAL_ID)
);

/*==============================================================*/
/* Table: FORMANDO                                              */
/*==============================================================*/
CREATE TABLE FORMANDO (
   FORMANDO_ID          SERIAL NOT NULL UNIQUE,
   CONSTRAINT PK_FORMANDO PRIMARY KEY (FORMANDO_ID),
   CONSTRAINT FK_FORMANDO_LOGIN_USER FOREIGN KEY (FORMANDO_ID)
      REFERENCES CREDENCIAIS (CREDENCIAL_ID)
);

/*==============================================================*/
/* Table: THREADS                                               */
/*==============================================================*/
CREATE TABLE THREADS (
   THREAD_ID            SERIAL PRIMARY KEY,
   FORUM_ID             INTEGER NOT NULL,
   USER_ID              INTEGER NOT NULL,
   TITULO               TEXT NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT FK_THREAD_FORUM FOREIGN KEY (FORUM_ID)
      REFERENCES FORUM (FORUM_ID),
   CONSTRAINT FK_THREAD_USER FOREIGN KEY (USER_ID)
      REFERENCES CREDENCIAIS (CREDENCIAL_ID)
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
/* Table: THREADS_DENUNCIAS                                     */
/*==============================================================*/
CREATE TABLE DENUNCIAS (
   DENUNCIA_ID          SERIAL NOT NULL UNIQUE,
   THREAD_ID            INTEGER NOT NULL,
   FORMANDO_ID          INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
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
   USER_ID              INTEGER NOT NULL,
   DESCRICAO            TEXT NOT NULL,
   CONSTRAINT FK_COMENTARIO_THREAD FOREIGN KEY (THREAD_ID)
      REFERENCES THREADS (THREAD_ID),
   CONSTRAINT FK_COMENTARIO_USER FOREIGN KEY (USER_ID)
      REFERENCES CREDENCIAIS (CREDENCIAL_ID)
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
   DESCRICAO            TEXT NOT NULL,
   PENDENTE             BOOLEAN NOT NULL,
   NIVEL                INTEGER NOT NULL CHECK (NIVEL IN (1, 2, 3, 4)),
   CONSTRAINT FK_CURSO_GESTOR FOREIGN KEY (GESTOR_ID)
      REFERENCES GESTOR (GESTOR_ID),
   CONSTRAINT FK_CURSO_TOPICO FOREIGN KEY (TOPICO_ID)
      REFERENCES TOPICO (TOPICO_ID)
);

/*==============================================================*/
/* Table: ASSINCRONO                                            */
/*==============================================================*/
CREATE TABLE ASSINCRONO (
   CURSO_ID             INTEGER NOT NULL UNIQUE,
   GESTOR_ID            INTEGER NOT NULL,
   CONSTRAINT PK_ASSINCRONO PRIMARY KEY (CURSO_ID),
   CONSTRAINT FK_ASSINCRONO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID),
   CONSTRAINT FK_ASSINCRONO_GESTOR FOREIGN KEY (GESTOR_ID)
      REFERENCES GESTOR (GESTOR_ID)
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
      REFERENCES FORMADOR (FORMADOR_ID)
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

/*ATENTION*/
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
/* Table: ALBUM                                                 */
/*==============================================================*/
CREATE TABLE ALBUM (
   ALBUM_ID              SERIAL NOT NULL UNIQUE,
   OBJETO_ID             INTEGER NOT NULL,
   CONSTRAINT PK_ALBUM PRIMARY KEY (ALBUM_ID),
   CONSTRAINT FK_ALBUM_OBJETO FOREIGN KEY (OBJETO_ID)
      REFERENCES OBJETO (OBJETO_ID)
);

/*==============================================================*/
/* Table: ANEXO                                                 */
/*==============================================================*/
CREATE TABLE ANEXO (
   ANEXO_ID             SERIAL NOT NULL UNIQUE,
   ALBUM_ID             INTEGER NOT NULL,
   DESCRICAO            TEXT NULL,
   CONSTRAINT PK_ANEXO PRIMARY KEY (ANEXO_ID),
   CONSTRAINT FK_ANEXO_ALBUM FOREIGN KEY (ALBUM_ID)
      REFERENCES ALBUM (ALBUM_ID)
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
/* Table: PRESENCA_FORM_SINC                                               */
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
   TIPO_AVALIACAO       TEXT NULL,
   NOTA                 FLOAT NOT NULL,
   DATA_CERTIFICADO     TIMESTAMPTZ NULL,
   ESTADO               BOOLEAN NOT NULL,
   CONSTRAINT PK_INSCRICAO PRIMARY KEY (INSCRICAO_ID),
   CONSTRAINT FK_INSCRICA_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID),
   CONSTRAINT FK_INSCRICAO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: TRABALHO                                              */
/*==============================================================*/
CREATE TABLE TRABALHO (
   TRABALHO_ID           SERIAL NOT NULL UNIQUE,
   FORMADOR_ID           INTEGER NOT NULL,
   INSCRICAO_ID          INTEGER NOT NULL,
   DESCRICAO             TEXT NULL,
   NOTA                  FLOAT NOT NULL,
   DATA                  TIMESTAMPTZ NULL,
   CONSTRAINT PK_TRABALHO PRIMARY KEY (TRABALHO_ID),
   CONSTRAINT FK_FORMADOR_AVALIA_TRABALHO FOREIGN KEY (FORMADOR_ID)
      REFERENCES FORMADOR (FORMADOR_ID),
   CONSTRAINT FK_TRABALHO_INSCRICAO FOREIGN KEY (INSCRICAO_ID)
      REFERENCES INSCRICAO (INSCRICAO_ID)
);

/*==============================================================*/
/* Table: TRABALHOS_FORMANDO                                    */
/*==============================================================*/
CREATE TABLE TRABALHOS_FORMANDO (
   FORMANDO_ID           INTEGER NOT NULL,
   TRABALHO_ID           INTEGER NOT NULL,
   CONSTRAINT PK_FORM_TRAB PRIMARY KEY (FORMANDO_ID, TRABALHO_ID),
   CONSTRAINT FK_FORMANDO_TRABALHO_FORM FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID),
   CONSTRAINT FK_FORMANDO_TRABALHO_TRAB FOREIGN KEY (TRABALHO_ID)
      REFERENCES TRABALHO (TRABALHO_ID)
);

/*==============================================================*/
/* Table: NOTIFICACAO                                           */
/*==============================================================*/
CREATE TABLE NOTIFICACAO (
   NOTIFICACAO_ID         SERIAL NOT NULL UNIQUE,
   CURSO_ID               INTEGER NOT NULL,
   DESCRICAO              TEXT NOT NULL,
   CONSTRAINT PK_NOTIFICACAO PRIMARY KEY (NOTIFICACAO_ID),
   CONSTRAINT FK_NOTIFICACAO_CURSO FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: PREFERENCIAS                                          */
/*==============================================================*/
CREATE TABLE PREFERENCIAS_CATEGORIA (
   PREFERENCIA_ID         SERIAL NOT NULL UNIQUE,
   FORMANDO_ID            INTEGER NOT NULL,
   DESIGNACAO             TEXT NOT NULL,
   CONSTRAINT PK_PREFERENCIAS PRIMARY KEY (PREFERENCIA_ID),
   CONSTRAINT FK_PREFERENCIAS_FORMANDO FOREIGN KEY (FORMANDO_ID)
      REFERENCES FORMANDO (FORMANDO_ID)
);

/*==============================================================*/
/* Table: PEDIDO_CURSO                                          */
/*==============================================================*/
CREATE TABLE PEDIDO_CURSO (
   FORMADOR_ID           INTEGER NOT NULL,
   CURSO_ID              INTEGER NOT NULL,
   CONSTRAINT PK_PEDECURSO PRIMARY KEY (FORMADOR_ID, CURSO_ID),
   CONSTRAINT FK_PEDECURSO_FORMADOR FOREIGN KEY (FORMADOR_ID)
      REFERENCES FORMADOR (FORMADOR_ID),
   CONSTRAINT FK_CURSO_ID FOREIGN KEY (CURSO_ID)
      REFERENCES CURSO (CURSO_ID)
);

/*==============================================================*/
/* Table: NOTIFICACOES_FORMANDO                                 */
/*==============================================================*/
CREATE TABLE NOTIFICACOES_FORMANDO (
   FORMANDO_ID            INTEGER NOT NULL,
   NOTIFICACAO_ID         INTEGER NOT NULL,
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
   FORMANDO_ID           INTEGER NOT NULL,
   QUESTAO_ID            INTEGER NOT NULL,
   RESPOSTA              TEXT NOT NULL,
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