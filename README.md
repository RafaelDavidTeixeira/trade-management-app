# Trade Management App - Manual do Usuário

## Introdução

O Trade Management App é uma aplicação web para gerenciamento de operações de trading, permitindo o registro, acompanhamento e análise de suas operações financeiras. Com esta ferramenta, você pode:

- Registrar operações de trading
- Acompanhar seu desempenho diário e geral
- Definir metas de lucro
- Gerenciar regras de capital (stop loss e stop win)
- Cadastrar ativos e suas porcentagens de retorno
- Exportar e importar dados
- Visualizar relatórios e estatísticas

## Instalação

### Requisitos
- Node.js 14.0 ou superior
- NPM 6.0 ou superior

### Passos para instalação

1. Descompacte o arquivo zip em uma pasta de sua preferência
2. Abra um terminal na pasta do projeto
3. Execute o comando para instalar as dependências:
   ```
   npm install
   ```
4. Para iniciar o aplicativo em modo de desenvolvimento:
   ```
   npm run dev
   ```
5. Para criar uma versão de produção:
   ```
   npm run build
   ```
6. Para visualizar a versão de produção:
   ```
   npm run preview
   ```

## Guia de Uso

### Tela Principal

A aplicação está dividida em quatro abas principais:

1. **Histórico**: Registre novas operações e visualize o histórico
2. **Ativos**: Gerencie os ativos e suas porcentagens de retorno
3. **Relatórios**: Visualize relatórios diários e gerais
4. **Configurações**: Configure metas e regras de capital

### Registrando uma Operação

1. Na aba **Histórico**, preencha o formulário com:
   - Data e hora da operação
   - Ativo negociado
   - Tipo de operação
   - Valor apostado
   - Resultado (Positivo, Negativo ou Empate)
2. O lucro/prejuízo será calculado automaticamente com base no ativo selecionado
3. Clique em "Adicionar Operação"

### Reconhecimento de Screenshot

Você pode fazer upload de screenshots de suas operações:

1. Clique em "Escolher arquivo" no campo "Upload de Screenshot"
2. Selecione uma imagem que contenha informações da operação
3. O sistema tentará extrair automaticamente os dados da imagem
4. Verifique e ajuste os dados conforme necessário antes de adicionar

### Gerenciando Ativos

Na aba **Ativos**:

1. Adicione novos ativos informando o nome e o percentual de retorno
2. Edite ativos existentes clicando no ícone de edição
3. Exclua ativos clicando no ícone de exclusão

### Configurando Metas e Regras

Na aba **Configurações**:

1. Defina seu capital inicial
2. Configure sua meta diária (valor fixo ou percentual)
3. Defina valores de stop loss e stop win

### Exportando e Importando Dados

Na aba **Relatórios**:

1. Clique em "Exportar Dados" para salvar um backup
2. Use "Importar Dados" para restaurar a partir de um backup

## Funcionalidades Principais

### Estatísticas Gerais
- Visualize seu desempenho geral
- Acompanhe taxa de acerto, ganhos, perdas e saldo final
- Monitore a evolução do seu capital

### Gestão de Capital
- Acompanhe seu capital inicial e atual
- Visualize a variação percentual do capital
- Monitore o lucro/prejuízo acumulado

### Relatório Consolidado
- Visualize o resumo diário de operações
- Acompanhe o progresso em relação à meta diária
- Analise a distribuição de operações por ativo

## Dicas de Uso

1. **Defina metas realistas**: Configure metas diárias alcançáveis para manter a motivação
2. **Use stop loss**: Defina um valor máximo de perda diária para proteger seu capital
3. **Faça backups regulares**: Exporte seus dados periodicamente para evitar perdas
4. **Analise seus relatórios**: Use as estatísticas para identificar padrões e melhorar sua estratégia

## Solução de Problemas

### O aplicativo não inicia
- Verifique se todas as dependências foram instaladas corretamente
- Certifique-se de que está usando uma versão compatível do Node.js

### Erro ao importar dados
- Verifique se o arquivo de backup está no formato correto (JSON)
- Certifique-se de que o arquivo não está corrompido

### Problemas com o reconhecimento de screenshots
- Use imagens nítidas e bem iluminadas
- Certifique-se de que as informações estão visíveis na imagem
- Ajuste manualmente os dados caso o reconhecimento não seja preciso

## Suporte

Para suporte ou dúvidas, entre em contato através do email: suporte@trademanagementapp.com
"# Rdavid_Trade_App" 
"# Rdavid_Trade_App" 
"# trade-management-app" 
