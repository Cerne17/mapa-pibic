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
                        <div className="project-info">
                            <strong>Desenvolvido por:</strong>
                            <p>Grupo de pesquisa: Diálogos entre ambiente alimentar, gastronomia e saúde.</p>
                            <p>Projeto: Avaliação do Ambiente Alimentar da Cidade Universitária - UFRJ</p>
                        </div>

                        <div className="team-member coordination">
                            <strong>Coordenação:</strong>
                            <p>Letícia Tavares e Maria Eliza Passos (Instituto de Nutrição Josué de Castro - Curso de Graduação em Gastronomia)</p>
                        </div>

                        <div className="team-grid credits-list">
                            <div className="team-member">
                                <strong>Bolsista PIBIC CNPq:</strong>
                                <p>Gabriella Santiago</p>
                            </div>
                            <div className="team-member">
                                <strong>Bolsista PIBIC UFRJ:</strong>
                                <p>Cecília Mattos</p>
                            </div>
                            <div className="team-member">
                                <strong>Voluntário:</strong>
                                <p>Miguel Cerne</p>
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
