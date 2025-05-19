export function filtrarCursosOuInscricoes({
  dados,
  tipoSelecionado,
  estadoSelecionado,
  dataSelecionada,
  nivelSelecionado,
  searchTerm,
  modo = 'curso' // ou 'inscricao'
}) {
  const anyTipoSelected = tipoSelecionado.S || tipoSelecionado.A;
  const anyEstadoSelected =
    estadoSelecionado.porComecar || estadoSelecionado.emCurso || estadoSelecionado.terminado;

  const now = new Date();

  return dados.filter(item => {
    const curso = modo === 'inscricao' ? item.inscricao_curso : item;
    const inscricao = modo === 'inscricao' ? item : null;

    if (!curso) return false;
    if (curso.pendente) return false;

    const dataInicio = curso.curso_sincrono?.data_inicio ? new Date(curso.curso_sincrono.data_inicio) : null;
    const isConcluido = modo === 'inscricao' ? inscricao.estado === true : curso.curso_sincrono?.estado === true;
    const isPorComecar = curso.tipo === 'S' && dataInicio && dataInicio > now;
    const isEmCurso = curso.tipo === 'A' || (curso.tipo === 'S' && !isConcluido && (!isPorComecar || !dataInicio));

    if (!isEmCurso && !isConcluido && !isPorComecar) return false;

    // Estado
    if (anyEstadoSelected) {
      const matchesEstado =
        (estadoSelecionado.porComecar && isPorComecar) ||
        (estadoSelecionado.emCurso && isEmCurso) ||
        (estadoSelecionado.terminado && isConcluido);

      if (!matchesEstado) return false;
    }

    // Tipo
    if (anyTipoSelected) {
      if (curso.tipo === 'S' && !tipoSelecionado.S) return false;
      if (curso.tipo === 'A' && !tipoSelecionado.A) return false;
    }

    const anyNivelSelected = Object.values(nivelSelecionado).some(Boolean);

    if (anyNivelSelected) {
      const cursoNivel = curso.nivel;
      if (!nivelSelecionado[cursoNivel]) return false;
    }

    // Filtro por intervalo de datas de início
    if (dataSelecionada.inicio || dataSelecionada.fim) {
      const dataCurso = new Date(curso.curso_sincrono?.data_inicio);
      if (isNaN(dataCurso)) return false;

      if (dataSelecionada.inicio && dataCurso < new Date(dataSelecionada.inicio)) return false;
      if (dataSelecionada.fim && dataCurso > new Date(dataSelecionada.fim)) return false;
    }

    // Pesquisa textual
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      const titulo = curso?.titulo?.toLowerCase() || '';
      const descricao = curso?.descricao?.toLowerCase() || '';
      const nomeFormador = curso?.curso_sincrono?.formador?.colaborador?.nome?.toLowerCase() || '';

      if (
        !titulo.includes(searchLower) &&
        !descricao.includes(searchLower) &&
        !nomeFormador.includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });
}
