import React, { useEffect } from 'react';
import './AboutModal.css';

const AboutModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="about-modal-overlay" onClick={onClose}>
            <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="about-modal-close" onClick={onClose}>&times;</button>

                <div className="about-modal-header">
                    <h2>Sobre o Projeto</h2>
                    <p>Ambiente Alimentar da UFRJ</p>
                </div>

                <div className="about-modal-body">
                    <div className="credits-section">
                        <div className="team-member coordinator">
                            <strong>Letícia Ferreira Tavares</strong>
                            <small>Coordenadora do projeto de pesquisa. Docente do curso de graduação em Gastronomia, Instituto de Nutrição Josué de Castro/UFRJ</small>
                            <a href="mailto:leticiatavares@nutricao.ufrj.br" className="email-link">leticiatavares@nutricao.ufrj.br</a>
                        </div>

                        <div className="team-grid">
                            <div className="team-member">
                                <strong>Maria Eliza Assis dos Passos</strong>
                                <small>Docente do curso de graduação em Gastronomia, Instituto de Nutrição Josué de Castro/UFRJ</small>
                                <a href="mailto:elizapassos@nutricao.ufrj.br" className="email-link">elizapassos@nutricao.ufrj.br</a>
                            </div>
                            <div className="team-member">
                                <strong>Paulo Cesar de Castro Junior</strong>
                                <small>Docente do curso de graduação em Gastronomia, Instituto de Nutrição Josué de Castro/UFRJ</small>
                                <a href="mailto:paulocastro@nutricao.ufrj.br" className="email-link">paulocastro@nutricao.ufrj.br</a>
                            </div>
                        </div>
                    </div>

                    <div className="about-action">
                        <a href="https://www.gastronomia.ufrj.br/" target="_blank" rel="noopener noreferrer" className="btn-playful">
                            Saiba mais sobre quem somos
                        </a>
                    </div>

                    <div className="about-logos">
                        <a href="https://ufrj.br/" target="_blank" rel="noopener noreferrer">
                            <img src="https://ufrj.br/wp-content/uploads/2024/01/ufrj-horizontal-cor-rgb-telas.png" alt="Logo UFRJ" />
                        </a>
                        <a href="https://injc.ufrj.br/" target="_blank" rel="noopener noreferrer">
                            <img src="https://injc.ufrj.br/wp-content/uploads/2014/10/INJC-2.jpg" alt="Logo INJC" />
                        </a>
                        <a href="https://www.gastronomia.ufrj.br/" target="_blank" rel="noopener noreferrer">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRufVAnLgXIjj-mdnic_2tPbtXdjiyhRS8x7A&s" />
                        </a>
                    </div>
                </div>

                <div className="about-modal-footer">
                    <button className="btn-close-modal" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
