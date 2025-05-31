# Documentação do Trade Management App - Versão 2.3

## Visão Geral

O Trade Management App é uma aplicação completa para gerenciamento de operações de trading, permitindo o registro, acompanhamento e análise de suas operações financeiras. Esta versão 2.3 traz importantes correções de bugs e novas funcionalidades solicitadas pelos usuários.

## Novidades da Versão 2.3

### Correções de Bugs
- ✅ **Campo "Capital Inicial (R$)" desbloqueado** - Agora é possível editar livremente o capital inicial
- ✅ **Edição de ativos cadastrados** - Correção da funcionalidade de edição de ativos
- ✅ **Importação de imagem aprimorada** - Algoritmo de reconhecimento melhorado para identificar valores corretamente
- ✅ **Navegação estável** - Correção das páginas em branco ao navegar entre Relatórios e Configurações

### Novas Funcionalidades
- ✅ **Depósitos e Retiradas** - Agora é possível registrar depósitos e retiradas que atualizam automaticamente o saldo
- ✅ **Histórico de Transações** - Visualização completa de todas as transações (depósitos/retiradas) realizadas
- ✅ **Opção de porcentagem nas Regras de Capital** - Escolha entre valores fixos (R$) ou percentuais (%) para Stop Loss e Stop Win
- ✅ **Campos de data personalizáveis** - Datas iniciais e finais sem valores predefinidos no Relatório de Metas por Período

## Guia de Uso

### Histórico de Operações

Esta é a tela principal do aplicativo, onde você pode:

1. **Registrar novas operações**:
   - Preencha os campos de data, hora, ativo, tipo, valor apostado e resultado
   - Clique em "Adicionar Operação" para salvar

2. **Gerenciar capital**:
   - Visualize seu capital inicial, lucro/prejuízo e capital atual
   - Registre depósitos e retiradas clicando no botão "Adicionar Transação"
   - Acompanhe o histórico completo de transações na seção "Histórico de Transações"

3. **Visualizar estatísticas**:
   - Acompanhe seu desempenho com estatísticas detalhadas
   - Veja taxa de acerto, ganhos, perdas e retorno médio

4. **Definir metas diárias**:
   - Estabeleça metas em valor fixo (R$) ou percentual (%)
   - Acompanhe o progresso em relação à meta definida

5. **Importar/Exportar dados**:
   - Importe operações via CSV ou imagem
   - Exporte todos os seus dados para backup

### Ativos

Nesta seção você pode:

1. **Visualizar ativos cadastrados**:
   - Lista completa de todos os ativos com seus respectivos percentuais

2. **Adicionar novos ativos**:
   - Informe o nome do ativo e o percentual de retorno
   - Clique em "Adicionar" para salvar

3. **Editar ativos existentes**:
   - Clique no botão de edição ao lado do ativo
   - Modifique os valores e clique em "Salvar"

4. **Excluir ativos**:
   - Clique no botão de exclusão ao lado do ativo
   - Confirme a exclusão quando solicitado

### Relatórios

Esta seção oferece três tipos de relatórios:

1. **Relatório Diário**:
   - Visualize o desempenho de cada dia de operação
   - Veja se as metas diárias foram atingidas

2. **Relatório por Período**:
   - Selecione um período específico para análise (campos vazios por padrão)
   - Veja estatísticas consolidadas do período selecionado
   - Exporte os dados para CSV

3. **Dashboard**:
   - Visualize gráficos de desempenho para 7 dias, 30 dias ou 365 dias
   - Acompanhe a evolução do capital e distribuição por ativo
   - Analise tendências e padrões de desempenho

### Configurações

Nesta seção você pode configurar:

1. **Regras de Capital**:
   - **Stop Loss**: Valor máximo de perda diária permitida (R$ ou %)
   - **Stop Win**: Valor de lucro diário para encerrar as operações (R$ ou %)
   - Selecione o tipo de cada regra (R$ ou %) conforme sua preferência

## Importação de Dados

### Importação via CSV

1. Clique em "Importar Operações" na tela principal
2. Selecione a aba "Importar via CSV"
3. Faça upload do arquivo CSV ou cole os dados diretamente
4. Verifique a prévia dos dados
5. Clique em "Importar" para confirmar

Formato do CSV:
```
data,hora,ativo,tipo,valor,resultado
2025-05-22,10:30,ADAUSDT,Crypto,100,20
2025-05-22,11:15,XRPUSDT,Crypto,50,-50
```

### Importação via Imagem

1. Clique em "Importar Operações" na tela principal
2. Selecione a aba "Importar via Imagem"
3. Faça upload da imagem com suas operações
4. Clique em "Analisar Imagem"
5. Verifique e corrija os dados identificados
6. Clique em "Importar Operações" para confirmar

Dicas para melhor reconhecimento:
- Use imagens com boa resolução e contraste
- Certifique-se que os textos estão legíveis
- Nomeie o arquivo com a data das operações (ex: 18052025.png)

## Depósitos e Retiradas

### Registrar Depósito

1. Na seção "Gestão de Capital", clique em "Adicionar Transação"
2. Selecione o tipo "Depósito"
3. Informe o valor e uma descrição (opcional)
4. Clique em "Adicionar" para registrar o depósito
5. O valor será adicionado ao seu capital atual

### Registrar Retirada

1. Na seção "Gestão de Capital", clique em "Adicionar Transação"
2. Selecione o tipo "Retirada"
3. Informe o valor e uma descrição (opcional)
4. Clique em "Adicionar" para registrar a retirada
5. O valor será subtraído do seu capital atual

## Solução de Problemas

### Problemas de Navegação
Se encontrar páginas em branco ao navegar entre abas:
- Clique novamente na aba desejada
- Se persistir, atualize a página (F5)

### Problemas com Importação de Imagem
Se a importação não identificar corretamente os valores:
- Verifique se a imagem tem boa qualidade
- Tente recortar a imagem para mostrar apenas a tabela de operações
- Como alternativa, use a importação via CSV

### Dados não Salvos
Se perceber que os dados não estão sendo salvos:
- Verifique se há espaço disponível no armazenamento local do navegador
- Exporte seus dados regularmente como backup

## Requisitos Técnicos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Conexão com internet para carregar a aplicação inicialmente

## Suporte

Para relatar problemas ou sugerir melhorias, entre em contato através do suporte.

---

Agradecemos por utilizar o Trade Management App!
