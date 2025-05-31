# Documentação do Trade Management App - Versão 2.2

## Visão Geral

O Trade Management App é uma ferramenta completa para gerenciamento de operações de trading, permitindo o registro, análise e acompanhamento de suas operações financeiras. Esta nova versão 2.2 traz melhorias significativas, incluindo opções de porcentagem nas regras de capital, campos de data personalizáveis e importação de múltiplas transações via CSV e imagem.

## Novas Funcionalidades

### 1. Opções de Porcentagem nas Regras de Capital

Agora você pode definir seus limites de Stop Loss e Stop Win tanto em valores fixos (R$) quanto em porcentagem (%) do seu capital inicial:

- **Stop Loss**: Define o valor máximo de perda diária permitida
- **Stop Win**: Define o valor de lucro diário para encerrar as operações
- **Alternância R$/%**: Escolha a unidade que melhor se adapta à sua estratégia

### 2. Campos de Data Personalizáveis no Relatório de Metas

Os campos de data no Relatório de Metas por Período agora são totalmente personalizáveis:

- Campos inicialmente vazios para sua livre escolha
- Validação adequada para garantir datas válidas
- Feedback visual claro durante a seleção

### 3. Importação de Múltiplas Transações

#### 3.1 Importação via CSV

Importe várias operações de uma só vez através de arquivos CSV:

- Formato padronizado com colunas específicas
- Validação e preview dos dados antes da importação
- Feedback visual durante todo o processo

#### 3.2 Importação via Imagem

Extraia operações diretamente de capturas de tela ou imagens:

- Reconhecimento automático de texto (OCR)
- Identificação de padrões de operações
- Preview e validação antes da importação final

## Guia de Uso

### Regras de Capital com Opção de Porcentagem

1. Acesse a aba "Configurações"
2. Na seção "Regras de Capital", você encontrará os campos de Stop Loss e Stop Win
3. Para cada campo, selecione a unidade desejada (R$ ou %)
4. Digite o valor correspondente
5. O sistema calculará automaticamente o valor efetivo com base na unidade escolhida

**Exemplo:**
- Com capital inicial de R$ 1.000,00:
  - Stop Loss de 5% = R$ 50,00
  - Stop Win de 10% = R$ 100,00

### Relatório de Metas por Período

1. Acesse a aba "Relatórios"
2. Selecione "Relatório por Período"
3. Os campos de data inicial e final estarão vazios
4. Selecione as datas desejadas para análise
5. O relatório será gerado automaticamente após a seleção de ambas as datas
6. Utilize o botão "Exportar CSV" para salvar os resultados

### Importação de Operações

#### Via CSV

1. Na tela principal, clique no botão "Importar Operações"
2. Selecione a aba "Importar via CSV"
3. Clique em "Selecionar arquivo" e escolha seu arquivo CSV
4. Clique em "Validar CSV" para verificar o formato
5. Confira a prévia dos dados
6. Clique em "Importar Operações" para concluir

#### Via Imagem

1. Na tela principal, clique no botão "Importar Operações"
2. Selecione a aba "Importar via Imagem"
3. Clique em "Selecionar imagem" e escolha sua captura de tela
4. Clique em "Analisar Imagem" para iniciar o reconhecimento
5. Confira as operações identificadas
6. Clique em "Importar Operações" para concluir

## Formato do CSV para Importação

O arquivo CSV deve conter as seguintes colunas:

| Coluna | Descrição | Formato | Exemplo |
|--------|-----------|---------|---------|
| data | Data da operação | YYYY-MM-DD | 2025-05-22 |
| hora | Hora da operação | HH:MM | 14:30 |
| ativo | Nome do ativo operado | Texto | BTCUSDT |
| tipo | Tipo de operação | Texto | Crypto |
| valor | Valor apostado | Número | 100.00 |
| resultado | Resultado da operação | Texto | Positivo |
| lucro_prejuizo | Valor do lucro/prejuízo | Número | 25.00 |

**Observações:**
- O separador deve ser vírgula (,)
- A primeira linha deve conter os nomes das colunas
- Os valores numéricos devem usar ponto (.) como separador decimal
- O resultado pode ser "Positivo", "Negativo" ou "Empate"
- O lucro/prejuízo deve incluir o sinal (positivo ou negativo)

## Dicas para Importação via Imagem

Para obter melhores resultados na importação via imagem:

1. **Qualidade da imagem**:
   - Use imagens com boa resolução
   - Evite imagens borradas ou com baixo contraste
   - Certifique-se de que o texto esteja legível

2. **Conteúdo da imagem**:
   - A imagem deve conter informações claras sobre horário, ativo, tipo, valor e resultado
   - Prefira capturas de tela diretas da plataforma de trading
   - Inclua o máximo de informações possível

3. **Limitações**:
   - O reconhecimento de texto não é perfeito e pode exigir correções manuais
   - Formatos muito diferentes do padrão podem não ser reconhecidos corretamente
   - Para maior precisão, considere usar a importação via CSV

## Solução de Problemas

### Importação CSV

| Problema | Solução |
|----------|---------|
| "Formato de arquivo inválido" | Verifique se o CSV contém todas as colunas necessárias |
| "O arquivo não contém dados" | Certifique-se de que o CSV não está vazio |
| "Erro ao processar o arquivo" | Verifique se o formato do CSV está correto |

### Importação via Imagem

| Problema | Solução |
|----------|---------|
| "Não foi possível identificar operações" | Verifique se a imagem contém dados no formato esperado |
| "Erro ao processar a imagem" | Certifique-se de que a imagem está legível |
| Dados incorretos após reconhecimento | Utilize a importação via CSV para maior precisão |

## Requisitos do Sistema

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexão com a internet para carregamento inicial
- JavaScript habilitado
- Armazenamento local disponível para salvar dados

## Contato e Suporte

Para dúvidas, sugestões ou relatos de problemas, entre em contato através dos canais disponíveis no aplicativo.

---

*Última atualização: 23 de maio de 2025*
