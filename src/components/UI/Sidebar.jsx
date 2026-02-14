import React, { useState, useMemo } from 'react';
import locaisData from '../../data/data.json';
import './Sidebar.css';

const Sidebar = ({ onSelectLocation, isOpen, onToggle, onOpenAbout }) => {
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('padrao');
  const [filtroCentro, setFiltroCentro] = useState('todos');
  const [filtroClassificacao, setFiltroClassificacao] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const centrosUnicos = useMemo(() => {
    const centros = locaisData
      .map(l => l.centro)
      .filter(c => c && c.trim() !== '');
    return [...new Set(centros)].sort();
  }, []);

  // Extrair tipos únicos
  const tiposUnicos = useMemo(() => {
    const tipos = locaisData
      .map(l => l.tipo)
      .filter(t => t && t.trim() !== '');
    return [...new Set(tipos)].sort();
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

      // Filtro de Tipo
      if (filtroTipo !== 'todos') {
        if (local.tipo !== filtroTipo) return false;
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
  }, [busca, filtroCentro, filtroClassificacao, filtroTipo, ordenacao]);

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : 'closed'}`}
        onClick={onToggle}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="main-title">
            <h1>M.A.A.M. - Onde Comer</h1>
            <p>Mapa do Ambiente Alimentar da Minerva</p>
          </div>

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
              <label>Modalidade de Serviço</label>
              <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                <option value="todos">Todos</option>
                {tiposUnicos.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Classificação do Estabelecimento</label>
              <select value={filtroClassificacao} onChange={e => setFiltroClassificacao(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="1">Tipo 1</option>
                <option value="2">Tipo 2</option>
                <option value="3">Tipo 3</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Índice de Saudabilidade</label>
              <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)}>
                <option value="padrao">Padrão</option>
                <option value="maior">Maior Saudabilidade</option>
                <option value="menor">Menor Saudabilidade</option>
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
                onClick={() => {
                  onSelectLocation(local);
                  if (window.innerWidth <= 768) onToggle();
                }}
              >
                <div className="item-header">
                  <strong>{local.nome}</strong>
                  <div className="item-badges">
                    <small className="saude-badge">{local.indiceSaudabilidade}</small>
                    <span className="status-dot bg-blue"></span>
                  </div>
                </div>
                <small className="item-centro">{local.centro || 'Ilha do Fundão'}</small>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer compact">
          <div className="footer-top-row">
            <button className="btn-about" onClick={onOpenAbout}>
              Sobre o Projeto
            </button>
            <div className="compact-logos">
              <img src="https://ufrj.br/wp-content/uploads/2024/01/ufrj-horizontal-cor-rgb-telas.png" alt="UFRJ" />
              <img src="https://injc.ufrj.br/wp-content/uploads/2014/10/INJC-2.jpg" alt="INJC" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRufVAnLgXIjj-mdnic_2tPbtXdjiyhRS8x7A&s" alt="Gastronomia" />
            </div>
          </div>
          <div className="footer-date">
            <small>Dados coletados em 2024</small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
