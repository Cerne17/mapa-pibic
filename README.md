# Mudanças

- [ ] Mapa    
    - [x] Limitar o mapa na Ilha do Fundão
    - [x] Adicionar card ao fazer "hover" nos restaurantes
        - [x] Nome
        - [x] Tipo (valor apenas — sem barra ou descrição)
        - [x] Índice de Saudabilidade (valor apenas — sem descrição)
    - [x] Ao clicar no restaurante, manter fixo na tela o card do restaurante com mais detalhes que o "card" de hover
        - [x] Nome
        - [x] Classificação
        - [x] Tipo
            - [x] Mudar descrições para as mesmas da legenda
        - [x] Índice de saudabilidade (Sem barra, apenas o valor)
            - [x] Ícone de "?" com a definição de Índice de Saudabilidade
                "Quanto mais próximo de 100 o escore estiver, maior a saudabilidade do estabelecimento."
    - [x] Remover o Modal que toma toda a tela ao clicar no estabelecimento
- [ ] Sidebar
    - [x] Mudar o copy
        Conhecendo o Ambiente Alimentar da UFRJ -> Título: M.A.A.M. - Onde Comer; Subtítulo: Mapa do Ambiente Alimentar da Minerva
    - [x] Mudar o copy dos filtros
        - [x] Centro -> Centro
        - [x] Classificação -> Classificação do Estabelecimento
        - [x] Tipo -> Modalidade de Serviço
        - [x] Ordenar -> Índice de Saudabilidade
    - [x] Modificar o filtro de Índice de Saudabilidade
        Opções: Maior Saudabilidade e Menor Saudabilidade (anteriormente: "Mais Saudáveis" e "Menos Saudáveis")
    - [/] Modificar o efeito de clique no Estabelecimento
        Deve modificar a visualização do mapa para centralizar no estabelecimento, com seu respectivo card expandido
    - [x] Trocar Ordem dos Filtros
        - [x] Centro (Esquerda em cima)
        - [x] Modalidade de Serviço (Direita em cima)
        - [x] Classificação do Estabelecimento (Esquerda em baixo)
        - [x] Indice de saudabilidade (Direita em baixo)
- [ ] Footer
    - [x] Adicionar copy
        "Dados coletados em 2024"
- [ ] Responsividade
    Viewport para versões mobile está ruim, ele supõe que temos acesso a toda tela do dispositivo, o que parece correto ao emularmos uma tela de smartphone no computador. Entretanto, no celular, temos parte da tela ocupada pelo navegador e pela barra de navegação do celular. Isso faz com que, ao colapsar as legendas, não consigamos expandi-las novamente. Além disso, na sidebar, não conseguimos visualizar o footer.

- [ ] Deploy
    - [ ] Mudar o nome do site: mapa-pibic -> maam-onde-comer



# Copy
M.A.A.M. - Onde Comer
Mapa do Ambiente Alimentar da Minerva

# Novos Restaurantes
> Já adicionados

```json
{
        "nome": "RU CT 1",
        "id": 20410,
        "centro": "CT",
        "latitude": -22.8591288148338,
        "longitude": -43.23083057281768,
        "tipo": "Restaurante buffet livre\/rodízio",
        "classificacao": 1,
        "indiceSaudabilidade": 89
    },
    {
        "nome": "RU Letras",
        "id": 20410,
        "centro": "Letras",
        "latitude": -22.85994215921727,
        "longitude": -43.22519567518762,
        "tipo": "Restaurante buffet livre\/rodízio",
        "classificacao": 1,
        "indiceSaudabilidade": 89
    },
``` 