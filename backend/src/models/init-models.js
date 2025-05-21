var DataTypes = require("sequelize").DataTypes;
var _area = require("./area");
var _assincrono = require("./assincrono");
var _aula = require("./aula");
var _avaliacao_formador = require("./avaliacao_formador");
var _avaliacao_quizz = require("./avaliacao_quizz");
var _categoria = require("./categoria");
var _colaborador = require("./colaborador");
var _comentario_resposta = require("./comentario_resposta");
var _comentarios = require("./comentarios");
var _curso = require("./curso");
var _curso_copia = require("./curso_copia");
var _denuncias = require("./denuncias");
var _ficheiro = require("./ficheiro");
var _formador = require("./formador");
var _formando = require("./formando");
var _forum = require("./forum");
var _gestor = require("./gestor");
var _inscricao = require("./inscricao");
var _material = require("./material");
var _notificacao = require("./notificacao");
var _notificacoes_formando = require("./notificacoes_formando");
var _objeto = require("./objeto");
var _pedidos = require("./pedidos");
var _preferencias_categoria = require("./preferencias_categoria");
var _presenca_form_sinc = require("./presenca_form_sinc");
var _questoes_quizz = require("./questoes_quizz");
var _quizz = require("./quizz");
var _respostas_quizz = require("./respostas_quizz");
var _sincrono = require("./sincrono");
var _threads = require("./threads");
var _threads_avaliacao = require("./threads_avaliacao");
var _topico = require("./topico");
var _trabalho = require("./trabalho");
var _trabalhos_formando = require("./trabalhos_formando");
var _departamento = require("./departamento");
var _funcao = require("./funcao");

function initModels(sequelize) {
  var area = _area(sequelize, DataTypes);
  var assincrono = _assincrono(sequelize, DataTypes);
  var aula = _aula(sequelize, DataTypes);
  var avaliacao_formador = _avaliacao_formador(sequelize, DataTypes);
  var avaliacao_quizz = _avaliacao_quizz(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var colaborador = _colaborador(sequelize, DataTypes);
  var comentario_resposta = _comentario_resposta(sequelize, DataTypes);
  var comentarios = _comentarios(sequelize, DataTypes);
  var curso = _curso(sequelize, DataTypes);
  var curso_copia = _curso_copia(sequelize, DataTypes);
  var denuncias = _denuncias(sequelize, DataTypes);
  var ficheiro = _ficheiro(sequelize, DataTypes);
  var formador = _formador(sequelize, DataTypes);
  var formando = _formando(sequelize, DataTypes);
  var forum = _forum(sequelize, DataTypes);
  var gestor = _gestor(sequelize, DataTypes);
  var inscricao = _inscricao(sequelize, DataTypes);
  var material = _material(sequelize, DataTypes);
  var notificacao = _notificacao(sequelize, DataTypes);
  var notificacoes_formando = _notificacoes_formando(sequelize, DataTypes);
  var objeto = _objeto(sequelize, DataTypes);
  var pedidos = _pedidos(sequelize, DataTypes);
  var preferencias_categoria = _preferencias_categoria(sequelize, DataTypes);
  var presenca_form_sinc = _presenca_form_sinc(sequelize, DataTypes);
  var questoes_quizz = _questoes_quizz(sequelize, DataTypes);
  var quizz = _quizz(sequelize, DataTypes);
  var respostas_quizz = _respostas_quizz(sequelize, DataTypes);
  var sincrono = _sincrono(sequelize, DataTypes);
  var threads = _threads(sequelize, DataTypes);
  var threads_avaliacao = _threads_avaliacao(sequelize, DataTypes);
  var topico = _topico(sequelize, DataTypes);
  var trabalho = _trabalho(sequelize, DataTypes);
  var trabalhos_formando = _trabalhos_formando(sequelize, DataTypes);
  var departamento = _departamento(sequelize, DataTypes);
  var funcao = _funcao(sequelize, DataTypes);

  aula.belongsToMany(formando, { as: 'formando_id_formando_presenca_form_sincs', through: presenca_form_sinc, foreignKey: "aula_id", otherKey: "formando_id" });
  comentarios.belongsToMany(comentarios, { as: 'resposta_id_comentarios', through: comentario_resposta, foreignKey: "comentariopai_id", otherKey: "resposta_id" });
  comentarios.belongsToMany(comentarios, { as: 'comentariopai_id_comentarios', through: comentario_resposta, foreignKey: "resposta_id", otherKey: "comentariopai_id" });
  curso.belongsToMany(curso, { as: 'parent_curso_id_cursos', through: curso_copia, foreignKey: "curso_copia_id", otherKey: "parent_curso_id" });
  curso.belongsToMany(curso, { as: 'curso_copia_id_cursos', through: curso_copia, foreignKey: "parent_curso_id", otherKey: "curso_copia_id" });
  formando.belongsToMany(aula, { as: 'aula_id_aulas', through: presenca_form_sinc, foreignKey: "formando_id", otherKey: "aula_id" });
  formando.belongsToMany(notificacao, { as: 'notificacao_id_notificacaos', through: notificacoes_formando, foreignKey: "formando_id", otherKey: "notificacao_id" });
  formando.belongsToMany(questoes_quizz, { as: 'questao_id_questoes_quizzs', through: respostas_quizz, foreignKey: "formando_id", otherKey: "questao_id" });
  formando.belongsToMany(quizz, { as: 'quizz_id_quizzs', through: avaliacao_quizz, foreignKey: "formando_id", otherKey: "quizz_id" });
  formando.belongsToMany(threads, { as: 'thread_id_threads', through: threads_avaliacao, foreignKey: "formando_id", otherKey: "thread_id" });
  formando.belongsToMany(trabalho, { as: 'trabalho_id_trabalhos', through: trabalhos_formando, foreignKey: "formando_id", otherKey: "trabalho_id" });
  notificacao.belongsToMany(formando, { as: 'formando_id_formando_notificacoes_formandos', through: notificacoes_formando, foreignKey: "notificacao_id", otherKey: "formando_id" });
  questoes_quizz.belongsToMany(formando, { as: 'formando_id_formando_respostas_quizzs', through: respostas_quizz, foreignKey: "questao_id", otherKey: "formando_id" });
  quizz.belongsToMany(formando, { as: 'formando_id_formandos', through: avaliacao_quizz, foreignKey: "quizz_id", otherKey: "formando_id" });
  threads.belongsToMany(formando, { as: 'formando_id_formando_threads_avaliacaos', through: threads_avaliacao, foreignKey: "thread_id", otherKey: "formando_id" });
  trabalho.belongsToMany(formando, { as: 'formando_id_formando_trabalhos_formandos', through: trabalhos_formando, foreignKey: "trabalho_id", otherKey: "formando_id" });
  topico.belongsTo(area, { as: "topico_area", foreignKey: "area_id"});
  area.hasMany(topico, { as: "area_topicos", foreignKey: "area_id"});
  presenca_form_sinc.belongsTo(aula, { as: "aula", foreignKey: "aula_id"});
  aula.hasMany(presenca_form_sinc, { as: "presenca_form_sincs", foreignKey: "aula_id"});
  area.belongsTo(categoria, { as: "area_categoria", foreignKey: "categoria_id"});
  categoria.hasMany(area, { as: "categoria_areas", foreignKey: "categoria_id"});
  comentarios.belongsTo(colaborador, { as: "colab_comentarios", foreignKey: "colaborador_id"});
  colaborador.hasMany(comentarios, { as: "comentarios_colab", foreignKey: "colaborador_id"});
  formador.belongsTo(colaborador, { as: "formador_colab", foreignKey: "formador_id"});
  colaborador.hasOne(formador, { as: "colab_formador", foreignKey: "formador_id"});
  formando.belongsTo(colaborador, { as: "formando_colab", foreignKey: "formando_id"});
  colaborador.hasOne(formando, { as: "colab_formando", foreignKey: "formando_id"});
  gestor.belongsTo(colaborador, { as: "gestor_colab", foreignKey: "gestor_id"});
  colaborador.hasOne(gestor, { as: "colab_gestor", foreignKey: "gestor_id"});
  threads.belongsTo(colaborador, { as: "colab_threads", foreignKey: "colaborador_id"});
  colaborador.hasMany(threads, { as: "threads_colab", foreignKey: "colaborador_id"});
  comentario_resposta.belongsTo(comentarios, { as: "comentariopai", foreignKey: "comentariopai_id"});
  comentarios.hasMany(comentario_resposta, { as: "comentario_resposta", foreignKey: "comentariopai_id"});
  comentario_resposta.belongsTo(comentarios, { as: "respostum", foreignKey: "resposta_id"});
  comentarios.hasMany(comentario_resposta, { as: "resposta_comentario_resposta", foreignKey: "resposta_id"});
  assincrono.belongsTo(curso, { as: "assincrono_curso", foreignKey: "curso_id"});
  curso.hasOne(assincrono, { as: "curso_assincrono", foreignKey: "curso_id"});
  curso_copia.belongsTo(curso, { as: "curso_copium", foreignKey: "curso_copia_id"});
  curso.hasMany(curso_copia, { as: "curso_copia", foreignKey: "curso_copia_id"});
  curso_copia.belongsTo(curso, { as: "parent_curso", foreignKey: "parent_curso_id"});
  curso.hasMany(curso_copia, { as: "parent_curso_curso_copia", foreignKey: "parent_curso_id"});
  inscricao.belongsTo(curso, { as: "inscricao_curso", foreignKey: "curso_id"});
  curso.hasMany(inscricao, { as: "curso_inscricaos", foreignKey: "curso_id"});
  notificacao.belongsTo(curso, { as: "curso", foreignKey: "curso_id"});
  curso.hasMany(notificacao, { as: "notificacaos", foreignKey: "curso_id"});
  material.belongsTo(curso, { as: "curso", foreignKey: "curso_id"});
  curso.hasMany(material, { as: "materials", foreignKey: "curso_id"});
  pedidos.belongsTo(colaborador, { as: "ped_colaborador", foreignKey: "colaborador_id"});
  colaborador.hasMany(pedidos, { as: "colaborador_ped", foreignKey: "colaborador_id"});
  pedidos.belongsTo(curso, { as: "ped_curso", foreignKey: "referencia_id"});
  curso.hasMany(pedidos, { as: "curso_ped", foreignKey: "referencia_id"});
  pedidos.belongsTo(forum, { as: "ped_forum", foreignKey: "referencia_id"});
  forum.hasMany(pedidos, { as: "forum_ped", foreignKey: "referencia_id"});
  quizz.belongsTo(curso, { as: "curso", foreignKey: "curso_id"});
  curso.hasMany(quizz, { as: "quizzs", foreignKey: "curso_id"});
  sincrono.belongsTo(curso, { as: "sincrono_curso", foreignKey: "curso_id"});
  curso.hasOne(sincrono, { as: "curso_sincrono", foreignKey: "curso_id"});
  aula.belongsTo(formador, { as: "formador", foreignKey: "formador_id"});
  formador.hasMany(aula, { as: "aulas", foreignKey: "formador_id"});
  sincrono.belongsTo(formador, { as: "sincrono_formador", foreignKey: "formador_id"});
  formador.hasMany(sincrono, { as: "formador_sincronos", foreignKey: "formador_id"});
  avaliacao_quizz.belongsTo(formando, { as: "formando", foreignKey: "formando_id"});
  formando.hasMany(avaliacao_quizz, { as: "avaliacao_quizzs", foreignKey: "formando_id"});
  denuncias.belongsTo(formando, { as: "formando", foreignKey: "formando_id"});
  formando.hasMany(denuncias, { as: "denuncia", foreignKey: "formando_id"});
  inscricao.belongsTo(formando, { as: "inscricao_formando", foreignKey: "formando_id"});
  formando.hasMany(inscricao, { as: "formando_inscricaos", foreignKey: "formando_id"});
  notificacoes_formando.belongsTo(formando, { as: "formando", foreignKey: "formando_id"});
  formando.hasMany(notificacoes_formando, { as: "notificacoes_formandos", foreignKey: "formando_id"});
  preferencias_categoria.belongsTo(formando, { as: "prefcat_formando", foreignKey: "formando_id"});
  formando.hasMany(preferencias_categoria, { as: "formando_prefcat", foreignKey: "formando_id"});
  presenca_form_sinc.belongsTo(formando, { as: "formando", foreignKey: "formando_id"});
  formando.hasMany(presenca_form_sinc, { as: "presenca_form_sincs", foreignKey: "formando_id"});
  respostas_quizz.belongsTo(formando, { as: "formando", foreignKey: "formando_id"});
  formando.hasMany(respostas_quizz, { as: "respostas_quizzs", foreignKey: "formando_id"});
  threads_avaliacao.belongsTo(formando, { as: "threads_ava_formando", foreignKey: "formando_id"});
  formando.hasMany(threads_avaliacao, { as: "formando_threads_ava", foreignKey: "formando_id"});
  trabalhos_formando.belongsTo(formando, { as: "formando", foreignKey: "formando_id"});
  formando.hasMany(trabalhos_formando, { as: "trabalhos_formandos", foreignKey: "formando_id"});
  threads.belongsTo(forum, { as: "threads_forum", foreignKey: "forum_id"});
  forum.hasMany(threads, { as: "forum_threads", foreignKey: "forum_id"});
  curso.belongsTo(gestor, { as: "gestor", foreignKey: "gestor_id"});
  gestor.hasMany(curso, { as: "cursos", foreignKey: "gestor_id"});
  quizz.belongsTo(gestor, { as: "gestor", foreignKey: "gestor_id"});
  gestor.hasMany(quizz, { as: "quizzs", foreignKey: "gestor_id"});
  notificacoes_formando.belongsTo(notificacao, { as: "notificacao", foreignKey: "notificacao_id"});
  notificacao.hasMany(notificacoes_formando, { as: "notificacoes_formandos", foreignKey: "notificacao_id"});
  ficheiro.belongsTo(objeto, { as: "ficheiro_objeto", foreignKey: "objeto_id"});
  objeto.hasMany(ficheiro, { as: "objeto_ficheiros", foreignKey: "objeto_id"});
  respostas_quizz.belongsTo(questoes_quizz, { as: "questao", foreignKey: "questao_id"});
  questoes_quizz.hasMany(respostas_quizz, { as: "respostas_quizzs", foreignKey: "questao_id"});
  avaliacao_quizz.belongsTo(quizz, { as: "quizz", foreignKey: "quizz_id"});
  quizz.hasMany(avaliacao_quizz, { as: "avaliacao_quizzs", foreignKey: "quizz_id"});
  questoes_quizz.belongsTo(quizz, { as: "quizz", foreignKey: "quizz_id"});
  quizz.hasMany(questoes_quizz, { as: "questoes_quizzs", foreignKey: "quizz_id"});
  aula.belongsTo(sincrono, { as: "sincrono", foreignKey: "sincrono_id"});
  sincrono.hasMany(aula, { as: "aulas", foreignKey: "sincrono_id"});
  trabalho.belongsTo(sincrono, { as: "sincrono", foreignKey: "sincrono_id"});
  sincrono.hasMany(trabalho, { as: "trabalhos", foreignKey: "sincrono_id"});
  comentarios.belongsTo(threads, { as: "comentarios_thread", foreignKey: "thread_id"});
  threads.hasMany(comentarios, { as: "thread_comentarios", foreignKey: "thread_id"});
  denuncias.belongsTo(threads, { as: "den_thread", foreignKey: "thread_id"});
  threads.hasMany(denuncias, { as: "thread_den", foreignKey: "thread_id"});
  threads_avaliacao.belongsTo(threads, { as: "threads_ava_thread", foreignKey: "thread_id"});
  threads.hasMany(threads_avaliacao, { as: "thread_threads_ava_", foreignKey: "thread_id"});
  curso.belongsTo(topico, { as: "curso_topico", foreignKey: "topico_id"});
  topico.hasMany(curso, { as: "topico_cursos", foreignKey: "topico_id"});
  forum.belongsTo(topico, { as: "forum_topico", foreignKey: "topico_id"});
  topico.hasMany(forum, { as: "topico_forums", foreignKey: "topico_id"});
  trabalhos_formando.belongsTo(trabalho, { as: "trabalho", foreignKey: "trabalho_id"});
  trabalho.hasMany(trabalhos_formando, { as: "trabalhos_formandos", foreignKey: "trabalho_id"});
  avaliacao_formador.belongsTo(curso, { as: "avaformador_curso", foreignKey: "curso_id"});
  curso.hasMany(avaliacao_formador, { as: "curso_avaformador", foreignKey: "curso_id"});
  avaliacao_formador.belongsTo(formador, { as: "avaformador_formador", foreignKey: "formador_id"});
  formador.hasMany(avaliacao_formador, { as: "formador_avaformador", foreignKey: "formador_id"});
  funcao.belongsTo(departamento, { as: 'funcao_departamento', foreignKey: 'departamento_id'});
  departamento.hasMany(funcao, { as: 'departamento_funcoes', foreignKey: 'departamento_id'});
  colaborador.belongsTo(funcao, { as: 'colab_funcao', foreignKey: 'funcao_id'});
  funcao.hasMany(colaborador, { as: 'funcao_colab', foreignKey: 'funcao_id'});

  return {
    ficheiro,
    area,
    assincrono,
    aula,
    avaliacao_formador,
    avaliacao_quizz,
    categoria,
    colaborador,
    comentario_resposta,
    comentarios,
    curso,
    curso_copia,
    denuncias,
    formador,
    formando,
    forum,
    gestor,
    inscricao,
    material,
    notificacao,
    notificacoes_formando,
    objeto,
    pedidos,
    preferencias_categoria,
    presenca_form_sinc,
    questoes_quizz,
    quizz,
    respostas_quizz,
    sincrono,
    threads,
    threads_avaliacao,
    topico,
    trabalho,
    trabalhos_formando,
    departamento,
    funcao,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
