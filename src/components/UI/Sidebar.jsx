import React, { useState, useMemo } from 'react';
import locaisData from '../../data/data.json';
import './Sidebar.css';

const Sidebar = ({ onSelectLocation, isOpen, onToggle }) => {
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('padrao');
  const [filtroCentro, setFiltroCentro] = useState('todos');
  const [filtroClassificacao, setFiltroClassificacao] = useState('todas');

  // Extrair centros únicos (Memoizado para performance)
  const centrosUnicos = useMemo(() => {
    const centros = locaisData
      .map(l => l.centro)
      .filter(c => c && c.trim() !== ''); // Garante que não pega vazios
    return [...new Set(centros)].sort();
  }, []);

  // Lógica de Processamento Unificada
  const listaFinal = useMemo(() => {
    // 1. Filtragem
    const filtrados = locaisData.filter(local => {
      // Filtro de Texto (Nome ou Centro)
      const textoBusca = busca.toLowerCase();
      const matchTexto = local.nome.toLowerCase().includes(textoBusca) ||
        (local.centro && local.centro.toLowerCase().includes(textoBusca));

      if (busca && !matchTexto) return false;

      // Filtro de Centro
      if (filtroCentro !== 'todos') {
        if (filtroCentro === 'outros') {
          if (local.centro && local.centro.trim() !== '') return false;
        } else {
          if (local.centro !== filtroCentro) return false;
        }
      }

      // Filtro de Classificação
      if (filtroClassificacao !== 'todas') {
        if (local.classificacao !== parseInt(filtroClassificacao)) return false;
      }

      return true;
    });

    // 2. Ordenação
    const ordenados = [...filtrados].sort((a, b) => {
      const notaA = Number(a.indiceSaudabilidade) || 0;
      const notaB = Number(b.indiceSaudabilidade) || 0;

      if (ordenacao === 'maior') return notaB - notaA;
      if (ordenacao === 'menor') return notaA - notaB;
      return 0;
    });

    return ordenados;
  }, [busca, filtroCentro, filtroClassificacao, ordenacao]);

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : 'closed'}`}
        onClick={onToggle}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? '❮' : '❯'}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Locais UFRJ</h2>

          <input
            type="text"
            placeholder="Buscar por nome ou centro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />

          <div className="filters-container">
            <div className="filter-group">
              <label>Centro</label>
              <select value={filtroCentro} onChange={e => setFiltroCentro(e.target.value)}>
                <option value="todos">Todos</option>
                {centrosUnicos.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="outros">Outros</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Classificação</label>
              <select value={filtroClassificacao} onChange={e => setFiltroClassificacao(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="1">🟢 Saudável</option>
                <option value="2">🟡 Misto</option>
                <option value="3">🔴 Não Saudável</option>
              </select>
            </div>

            <div className="filter-group full-width">
              <label>Ordenar</label>
              <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)}>
                <option value="padrao">Padrão</option>
                <option value="maior">Mais Saudáveis</option>
                <option value="menor">Menos Saudáveis</option>
              </select>
            </div>
          </div>

          <div className="results-count">
            <small>{listaFinal.length} locais encontrados</small>
          </div>
        </div>

        <div className="sidebar-list">
          {listaFinal.length === 0 ? (
            <p className="no-results">Nenhum local encontrado.</p>
          ) : (
            listaFinal.map((local, index) => (
              <div
                key={`${local.id}-${index}`}
                className="list-item"
                onClick={() => onSelectLocation(local)}
              >
                <div className="item-header">
                  <strong>{local.nome}</strong>
                  <div className="item-badges">
                    <small className="saude-badge">{local.indiceSaudabilidade}</small>
                    <span className={`status-dot ${local.classificacao === 1 ? 'bg-green' : (local.classificacao === 2 ? 'bg-yellow' : 'bg-red')}`}></span>
                  </div>
                </div>
                <small className="item-centro">{local.centro || 'Ilha do Fundão'}</small>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <p>Projeto Gastronomia UFRJ</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
