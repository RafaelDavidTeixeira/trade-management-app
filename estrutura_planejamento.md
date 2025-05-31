# Estrutura de Componentes e Fluxo de Dados

## Componentes Principais
1. **App.js** - Componente principal que gerencia o estado global e renderiza todos os outros componentes
2. **TradeForm.js** - Formulário para adicionar/editar operações de trade
3. **TradeTable.js** - Tabela que exibe todas as operações registradas
4. **StatsSection.js** - Seção que exibe estatísticas gerais das operações
5. **GoalSection.js** - Seção para definir e acompanhar metas diárias
6. **BankrollSection.js** - Seção para gerenciar o capital inicial e acompanhar o saldo
7. **AssetsSection.js** - Seção para gerenciar ativos e suas porcentagens
8. **ReportsSection.js** - Seção para visualizar relatórios de desempenho
9. **ConsolidatedReport.js** - Relatório consolidado de todas as operações
10. **CapitalManagement.js** - Componente para gerenciar regras de capital (stop loss, stop win)

## Fluxo de Dados
- O estado principal será gerenciado no App.js usando useState e useEffect
- Os dados serão armazenados no localStorage para persistência
- Cada componente receberá props do App.js e enviará atualizações através de funções de callback
- Dados compartilhados:
  - Lista de trades
  - Configurações de metas e capital
  - Lista de ativos e porcentagens
  - Estatísticas calculadas

## Estrutura de Estado Principal (App.js)
```javascript
// Estados principais
const [trades, setTrades] = useState([])
const [dailyGoal, setDailyGoal] = useState(100)
const [goalType, setGoalType] = useState('R$')
const [initialBankroll, setInitialBankroll] = useState(0)
const [stopLoss, setStopLoss] = useState(50)
const [stopWin, setStopWin] = useState(100)
const [assets, setAssets] = useState({})
const [selectedDate, setSelectedDate] = useState(today)
const [activeTab, setActiveTab] = useState('history')
```

## Estratégia de Estilização
- Utilizar Tailwind CSS para todos os componentes
- Definir variáveis CSS para cores principais (já configuradas)
- Implementar modo escuro/claro
- Garantir responsividade para diferentes tamanhos de tela
- Manter consistência visual em todos os componentes

## Funcionalidades Principais
1. Adicionar/editar/excluir operações de trade
2. Visualizar histórico de operações em tabela
3. Acompanhar estatísticas de desempenho
4. Definir e monitorar metas diárias
5. Gerenciar capital inicial e regras de stop
6. Adicionar/editar/excluir ativos e suas porcentagens
7. Exportar/importar dados
8. Reconhecimento de texto em screenshots (OCR)
9. Visualizar relatórios de desempenho

## Arquivos Adicionais Necessários
1. **index.html** - Estrutura HTML básica
2. **index.js** - Ponto de entrada da aplicação
3. **index.css** - Estilos globais e configuração do Tailwind
4. **postcss.config.js** - Configuração do PostCSS para o Tailwind
