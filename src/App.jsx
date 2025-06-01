import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import TradeForm from './components/TradeForm';
import TradeTable from './components/TradeTable';
import StatsSection from './components/StatsSection';
import GoalSection from './components/GoalSection';
import BankrollManagement from './components/BankrollManagement';
import AssetsSection from './components/AssetsSection';
import ReportsSection from './components/ReportsSection';
import CapitalManagement from './components/CapitalManagement';
import PeriodGoalReport from './components/PeriodGoalReport';
import DashboardView from './components/DashboardView';
import CSVImporter from './components/CSVImporter';
import ImageImporter from './components/ImageImporter';
import TransactionHistory from './components/TransactionHistory';

const App = () => {
  const today = new Date().toISOString().split('T')[0];

  // Estado para controlar carregamento de componentes
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem('trades');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar trades do localStorage:", e);
      return [];
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar transações do localStorage:", e);
      return [];
    }
  });

  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseFloat(saved) : 100;
  });

  const [goalType, setGoalType] = useState(() => {
    const saved = localStorage.getItem('goalType');
    return saved || 'R$';
  });

  const [initialBankroll, setInitialBankroll] = useState(() => {
    const saved = localStorage.getItem('initialBankroll');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [stopLoss, setStopLoss] = useState(() => {
    const saved = localStorage.getItem('stopLoss');
    return saved ? parseFloat(saved) : 50;
  });

  const [stopWin, setStopWin] = useState(() => {
    const saved = localStorage.getItem('stopWin');
    return saved ? parseFloat(saved) : 100;
  });
  
  const [stopLossType, setStopLossType] = useState(() => {
    const saved = localStorage.getItem('stopLossType');
    return saved || 'R$';
  });

  const [stopWinType, setStopWinType] = useState(() => {
    const saved = localStorage.getItem('stopWinType');
    return saved || 'R$';
  });

  const [lastDate, setLastDate] = useState(() => {
    return localStorage.getItem('lastDate') || today;
  });

  const [assets, setAssets] = useState(() => {
    try {
      const saved = localStorage.getItem('assets');
      return saved ? JSON.parse(saved) : {
        ADAUSDT: 0.86,
        XRPUSDT: 0.90,
        LTCUSDT: 0.88,
        BNBUSDT: 0.92,
      };
    } catch {
      return {
        ADAUSDT: 0.86,
        XRPUSDT: 0.90,
        LTCUSDT: 0.88,
        BNBUSDT: 0.92,
      };
    }
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState('history');
  const [activeReportTab, setActiveReportTab] = useState('daily'); // 'daily', 'period', 'dashboard'
  const [activeImportTab, setActiveImportTab] = useState('csv'); // 'csv', 'image'
  const [showImportModal, setShowImportModal] = useState(false);
  const [formData, setFormData] = useState({
    date: today,
    time: '',
    asset: Object.keys(assets)[0] || 'ADAUSDT',
    type: 'Crypto',
    betAmount: '',
    profitLoss: '',
    outcome: 'Positive',
  });
  const [editTrade, setEditTrade] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [isLoadingOcr, setIsLoadingOcr] = useState(false);

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('trades', JSON.stringify(trades));
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('dailyGoal', dailyGoal.toString());
        localStorage.setItem('goalType', goalType);
        localStorage.setItem('initialBankroll', initialBankroll.toString());
        localStorage.setItem('stopLoss', stopLoss.toString());
        localStorage.setItem('stopWin', stopWin.toString());
        localStorage.setItem('stopLossType', stopLossType);
        localStorage.setItem('stopWinType', stopWinType);
        localStorage.setItem('assets', JSON.stringify(assets));
        localStorage.setItem('lastDate', lastDate);
      } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
      }
    };
    saveData();
  }, [trades, transactions, dailyGoal, goalType, initialBankroll, stopLoss, stopWin, stopLossType, stopWinType, assets, lastDate]);

  // Verificar mudança de data
  useEffect(() => {
    const checkDateChange = () => {
      const todayCheck = new Date().toISOString().split('T')[0];
      if (lastDate !== todayCheck) {
        const balance = initialBankroll + trades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
        setInitialBankroll(balance);
        setLastDate(todayCheck);
      }
    };
    checkDateChange();
    const timer = setInterval(checkDateChange, 60000);
    return () => clearInterval(timer);
  }, [lastDate, initialBankroll, trades]);

  // Calcular total acumulado de operações
  const runningTotal = useMemo(() => {
    return trades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0).toFixed(2);
  }, [trades]);

  // Calcular total de depósitos e retiradas
  const transactionsTotal = useMemo(() => {
    const deposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const withdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return deposits - withdrawals;
  }, [transactions]);

  // Calcular capital atual (inicial + lucros/perdas + depósitos - retiradas)
  const currentBankroll = useMemo(() => {
    return initialBankroll + parseFloat(runningTotal) + transactionsTotal;
  }, [initialBankroll, runningTotal, transactionsTotal]);

  // Verificar regras de capital
  const checkCapitalManagement = () => {
    // Função mantida para compatibilidade, mas sem exibir popups
    const total = parseFloat(runningTotal);
    
    // Calcular stop loss efetivo
    let effectiveStopLoss = stopLoss;
    if (stopLossType === '%') {
      effectiveStopLoss = (initialBankroll * (stopLoss / 100));
    }
    
    // Calcular stop win efetivo
    let effectiveStopWin = stopWin;
    if (stopWinType === '%') {
      effectiveStopWin = (initialBankroll * (stopWin / 100));
    }
    
    // Popups removidos conforme solicitado pelo usuário
  };

  useEffect(() => {
    checkCapitalManagement();
  }, [runningTotal, stopLoss, stopLossType, stopWin, stopWinType, initialBankroll]);

  // Manipulador de mudança de input no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'asset' || name === 'betAmount' || name === 'outcome') {
        const selectedAsset = name === 'asset' ? value : prev.asset;
        const betAmount = name === 'betAmount' ? parseFloat(value) || 0 : parseFloat(prev.betAmount) || 0;
        const outcome = name === 'outcome' ? value : prev.outcome;
        const percentage = assets[selectedAsset] || 0;
        newFormData.profitLoss = outcome === 'Positive'
          ? (betAmount * percentage).toFixed(2)
          : outcome === 'Tie'
          ? '0.00'
          : (-betAmount).toFixed(2);
      }
      return newFormData;
    });
  };

  // Adicionar ou editar trade
  const addTrade = (e) => {
    e.preventDefault();
    const newTrade = {
      id: editTrade ? editTrade.id : Date.now(),
      date: formData.date,
      time: formData.time,
      asset: formData.asset,
      type: formData.type,
      betAmount: parseFloat(formData.betAmount) || 0,
      profitLoss: parseFloat(formData.profitLoss) || 0,
    };
    const updatedTrades = editTrade 
      ? trades.map(t => t.id === editTrade.id ? newTrade : t) 
      : [...trades, newTrade];
    setTrades(updatedTrades);
    setFormData({
      date: today,
      time: '',
      asset: Object.keys(assets)[0] || 'ADAUSDT',
      type: 'Crypto',
      betAmount: '',
      profitLoss: '',
      outcome: 'Positive',
    });
    setEditTrade(null);
  };

  // Adicionar transação (depósito ou retirada)
  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  // Excluir transação
  const deleteTransaction = (timestamp) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(transactions.filter(t => t.timestamp !== timestamp));
    }
  };

  // Excluir trade
  const deleteTrade = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta operação?')) {
      setTrades(trades.filter(trade => trade.id !== id));
    }
  };

  // Duplicar trade
  const duplicateTrade = (trade) => {
    setFormData({
      date: trade.date,
      time: trade.time,
      asset: trade.asset,
      type: trade.type,
      betAmount: trade.betAmount.toString(),
      profitLoss: trade.profitLoss.toString(),
      outcome: trade.profitLoss > 0 ? 'Positive' : trade.profitLoss < 0 ? 'Negative' : 'Tie',
    });
  };

  // Editar trade
  const editTradeHandler = (trade) => {
    console.log('Editing trade:', trade); // Log para depuração
    setEditTrade(trade);
    setFormData({
      date: trade.date,
      time: trade.time,
      asset: trade.asset,
      type: trade.type,
      betAmount: trade.betAmount.toString(),
      profitLoss: trade.profitLoss.toString(),
      outcome: trade.profitLoss > 0 ? 'Positive' : trade.profitLoss < 0 ? 'Negative' : 'Tie',
    });
  };

  // Limpar todos os trades
  const clearAllTrades = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as operações? Esta ação não pode ser desfeita.')) {
      setTrades([]);
      setTransactions([]);
      setInitialBankroll(0.00);
      setDailyGoal(100);
      setGoalType('R$');
      setStopLoss(50);
      setStopWin(100);
      setStopLossType('R$');
      setStopWinType('R$');
      localStorage.removeItem('trades');
      localStorage.removeItem('transactions');
      localStorage.removeItem('initialBankroll');
      localStorage.removeItem('dailyGoal');
      localStorage.removeItem('goalType');
      localStorage.removeItem('stopLoss');
      localStorage.removeItem('stopWin');
      localStorage.removeItem('stopLossType');
      localStorage.removeItem('stopWinType');
    }
  };

  // Processar screenshot com OCR
  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoadingOcr(true);
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      const extracted = {
        date: lines.find(line => /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(line)) || '',
        time: lines.find(line => /\d{1,2}:\d{2}/.test(line)) || '',
        asset: lines.find(line => Object.keys(assets).some(asset => line.includes(asset))) || Object.keys(assets)[0] || 'ADAUSDT',
        betAmount: lines.find(line => /R\$\s*[\d,.]+/.test(line))?.match(/[\d,.]+/)?.[0].replace(',', '.') || '',
        profitLoss: '',
        outcome: lines.some(line => /loss|perda|-R\$/i.test(line)) ? 'Negative' : lines.some(line => /tie|empate/i.test(line)) ? 'Tie' : 'Positive',
      };
      
      if (extracted.date) {
        const parts = extracted.date.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const fullYear = year.length === 2 ? `20${year}` : year;
          extracted.date = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      const betAmount = parseFloat(extracted.betAmount) || 0;
      const percentage = assets[extracted.asset] || 0;
      extracted.profitLoss = extracted.outcome === 'Positive'
        ? (betAmount * percentage).toFixed(2)
        : extracted.outcome === 'Tie'
        ? '0.00'
        : (-betAmount).toFixed(2);
      
      setOcrData(extracted);
      setFormData({ ...extracted, type: 'Crypto' });
    } catch (err) {
      console.error(err);
      alert('Erro ao processar a imagem. Verifique se a imagem está legível.');
    }
    setIsLoadingOcr(false);
  };

  // Exportar dados
  const exportData = () => {
    const backupData = {
      trades,
      transactions,
      initialBankroll,
      dailyGoal,
      goalType,
      stopLoss,
      stopWin,
      stopLossType,
      stopWinType,
      assets,
    };
    const json = JSON.stringify(backupData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar dados
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        const existingTradeKeys = new Set(trades.map(t => `${t.date}|${t.time}|${t.asset}`));
        const newTrades = backupData.trades.filter(t => {
          const tradeKey = `${t.date}|${t.time}|${t.asset}`;
          return !existingTradeKeys.has(tradeKey);
        }).map((t, index) => ({
          id: Date.now() + index,
          date: t.date || '',
          time: t.time || '',
          asset: t.asset || Object.keys(assets)[0] || 'ADAUSDT',
          type: t.type || 'Crypto',
          betAmount: parseFloat(t.betAmount) || 0,
          profitLoss: parseFloat(t.profitLoss) || 0,
        })).filter(t => t.betAmount && t.date && t.time && t.asset);

        setTrades([...trades, ...newTrades]);
        
        // Importar transações se existirem
        if (backupData.transactions) {
          const existingTransactionKeys = new Set(transactions.map(t => t.timestamp));
          const newTransactions = backupData.transactions.filter(t => !existingTransactionKeys.has(t.timestamp));
          setTransactions([...transactions, ...newTransactions]);
        }
        
        if (backupData.initialBankroll) setInitialBankroll(parseFloat(backupData.initialBankroll));
        if (backupData.dailyGoal) setDailyGoal(parseFloat(backupData.dailyGoal));
        if (backupData.goalType) setGoalType(backupData.goalType);
        if (backupData.stopLoss) setStopLoss(parseFloat(backupData.stopLoss));
        if (backupData.stopWin) setStopWin(parseFloat(backupData.stopWin));
        if (backupData.stopLossType) setStopLossType(backupData.stopLossType);
        if (backupData.stopWinType) setStopWinType(backupData.stopWinType);
        if (backupData.assets) setAssets(backupData.assets);
        
        alert(`Importação concluída: ${newTrades.length} novas operações adicionadas.`);
      } catch (err) {
        console.error(err);
        alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
      }
    };
    reader.readAsText(file);
  };

  // Importar operações via CSV
  const handleCSVImport = (importedTrades) => {
    if (!importedTrades || importedTrades.length === 0) {
      alert('Nenhuma operação válida para importar.');
      return;
    }
    
    // Mapear para o formato correto e adicionar IDs
    const newTrades = importedTrades.map((trade, index) => ({
      id: Date.now() + index,
      date: trade.date,
      time: trade.time,
      asset: trade.asset,
      type: trade.type || 'Crypto',
      betAmount: parseFloat(trade.amount) || 0,
      profitLoss: parseFloat(trade.profitLoss) || 0,
    }));
    
    // Adicionar ao estado
    setTrades([...trades, ...newTrades]);
    setShowImportModal(false);
    
    alert(`Importação concluída: ${newTrades.length} operações adicionadas.`);
  };
  
  // Importar operações via imagem
  const handleImageImport = (importedTrades) => {
    if (!importedTrades || importedTrades.length === 0) {
      alert('Nenhuma operação válida para importar.');
      return;
    }
    
    // Mapear para o formato correto e adicionar IDs
    const newTrades = importedTrades.map((trade, index) => ({
      id: Date.now() + index,
      date: trade.date,
      time: trade.time,
      asset: trade.asset,
      type: trade.type || 'Crypto',
      betAmount: parseFloat(trade.amount) || 0,
      profitLoss: parseFloat(trade.profitLoss) || 0,
    }));
    
    // Adicionar ao estado
    setTrades([...trades, ...newTrades]);
    setShowImportModal(false);
    
    alert(`Importação concluída: ${newTrades.length} operações adicionadas.`);
  };

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalBet = trades.reduce((sum, t) => sum + (parseFloat(t.betAmount) || 0), 0);
    const gains = trades.reduce((sum, t) => t.profitLoss > 0 ? sum + parseFloat(t.profitLoss) || 0 : sum, 0);
    const losses = trades.reduce((sum, t) => t.profitLoss < 0 ? sum + parseFloat(t.profitLoss) || 0 : sum, 0);
    const ties = trades.filter(t => parseFloat(t.profitLoss) === 0).length;
    const finalBalance = gains + losses;
    const tradeCount = trades.length;
    const wins = trades.filter(t => parseFloat(t.profitLoss) > 0).length;
    const lossCount = trades.filter(t => parseFloat(t.profitLoss) < 0).length;
    const tieCount = ties;
    const winRate = tradeCount > 0 ? (wins / tradeCount * 100).toFixed(2) : '0.00';
    const avgReturn = tradeCount > 0 ? (finalBalance / tradeCount).toFixed(2) : '0.00';
    
    // Calcular melhor e pior operação
    const profitLossValues = trades.map(t => parseFloat(t.profitLoss) || 0);
    const bestTrade = tradeCount > 0 ? Math.max(...profitLossValues).toFixed(2) : '0.00';
    const worstTrade = tradeCount > 0 ? Math.min(...profitLossValues).toFixed(2) : '0.00';
    
    return {
      totalBet: totalBet.toFixed(2), // Adicionado toFixed(2)
      gains: gains.toFixed(2), // Adicionado toFixed(2)
      losses: losses.toFixed(2), // Adicionado toFixed(2)
      ties,
      finalBalance: finalBalance.toFixed(2), // Adicionado toFixed(2)
      tradeCount,
      wins,
      lossCount,
      tieCount,
      winRate,
      avgReturn,
      bestTrade, // Adicionado bestTrade
      worstTrade, // Adicionado worstTrade
    };
  }, [trades]);

  // Calcular relatório diário com try/catch para robustez
  const dailyReport = useMemo(() => {
    try {
      const dailyTrades = trades.filter(t => t.date === selectedDate);
      const dailyProfitLoss = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
      const dailyTotalBet = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.betAmount) || 0), 0);

      let goalAmount = dailyGoal;
      if (goalType === '%') {
        // Ensure initialBankroll is a number and not zero before calculating percentage
        const baseBankroll = parseFloat(initialBankroll);
        if (!isNaN(baseBankroll) && baseBankroll !== 0) {
           goalAmount = baseBankroll * (parseFloat(dailyGoal) / 100);
        } else {
           // Default to fixed goal if bankroll is invalid for percentage calculation
           goalAmount = parseFloat(dailyGoal);
           console.warn("Initial bankroll is zero or invalid for percentage goal calculation. Using fixed goal amount.");
        }
      } else {
         goalAmount = parseFloat(dailyGoal);
      }
      
      // Ensure goalAmount is a valid number
      if (isNaN(goalAmount)) {
          goalAmount = 0;
          console.warn("Goal amount calculation resulted in NaN. Defaulting to 0.");
      }


      const metDailyGoal = dailyProfitLoss >= goalAmount;
      const shortfall = Math.max(0, goalAmount - dailyProfitLoss).toFixed(2);
      const exceeded = Math.max(0, dailyProfitLoss - goalAmount).toFixed(2);
      
      // Ensure runningTotal is available and formatted
      const currentRunningTotal = parseFloat(runningTotal) || 0;

      return {
        tradeCount: dailyTrades.length,
        totalBet: dailyTotalBet.toFixed(2),
        dailyProfitLoss: dailyProfitLoss.toFixed(2),
        metDailyGoal: metDailyGoal,
        shortfall: shortfall,
        exceeded: exceeded,
        runningTotal: currentRunningTotal.toFixed(2) // Pass formatted runningTotal
      };
    } catch (error) {
      console.error("Erro ao calcular relatório diário:", error);
      // Retornar objeto padrão em caso de erro
      return {
        tradeCount: 0,
        totalBet: '0.00',
        dailyProfitLoss: '0.00',
        metDailyGoal: false,
        shortfall: '0.00',
        exceeded: '0.00',
        runningTotal: (parseFloat(runningTotal) || 0).toFixed(2) // Still provide runningTotal if possible
      };
    }
  }, [trades, selectedDate, dailyGoal, goalType, initialBankroll, runningTotal]); // Added runningTotal dependency


  // Gerenciador de mudança de aba
  const handleTabChange = (tab) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      setActiveTab(tab);
      
      // Resetar sub-abas quando necessário
      if (tab === 'reports') {
        // Manter a sub-aba atual se já estiver na aba de relatórios
        if (activeTab !== 'reports') {
          setActiveReportTab('daily');
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao mudar de aba:", error);
      setLoadError("Ocorreu um erro ao carregar esta seção. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

  // Gerenciador de mudança de sub-aba de relatórios
  const handleReportTabChange = (tab) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      setActiveReportTab(tab);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao mudar de sub-aba:", error);
      setLoadError("Ocorreu um erro ao carregar este relatório. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

  // Renderizar conteúdo com base na aba ativa
  const renderContent = () => {
    // Se estiver carregando, mostrar indicador
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    // Se houver erro, mostrar mensagem
    if (loadError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {loadError}</span>
          <button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Recarregar Aplicativo
          </button>
        </div>
      );
    }

    try {
      switch (activeTab) {
        case 'history':
          return (
            <div>
              <h1 className="text-2xl font-bold mb-6 text-center text-primary">Trade Management App</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <TradeForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    addTrade={addTrade}
                    editTrade={editTrade}
                    assets={assets}
                    handleScreenshotUpload={handleScreenshotUpload}
                    isLoadingOcr={isLoadingOcr}
                  />
                  
                  <div className="mt-6">
                    <BankrollManagement
                      initialBankroll={initialBankroll}
                      setInitialBankroll={setInitialBankroll}
                      currentBankroll={currentBankroll}
                      runningTotal={runningTotal}
                      transactions={transactions}
                      addTransaction={addTransaction}
                    />
                  </div>
                </div>
                
                <div>
                  <StatsSection stats={stats} initialBankroll={initialBankroll} currentBankroll={currentBankroll} runningTotal={runningTotal} dailyGoal={dailyGoal} goalType={goalType} />
                  
                  <div className="mt-6">
                    <GoalSection 
                      dailyGoal={dailyGoal}
                      setDailyGoal={setDailyGoal}
                      goalType={goalType}
                      setGoalType={setGoalType}
                      runningTotal={parseFloat(runningTotal)}
                      initialBankroll={initialBankroll}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <TradeTable 
                  trades={trades}
                  deleteTrade={deleteTrade}
                  editTrade={editTradeHandler}
                  duplicateTrade={duplicateTrade}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  clearAllTrades={clearAllTrades}
                />
              </div>
              
              <div className="mt-8">
                <TransactionHistory 
                  transactions={transactions}
                  onDeleteTransaction={deleteTransaction}
                />
              </div>
              
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Importar Operações
                </button>
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Exportar Dados
                </button>
                <label className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                  Importar Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          );
        case 'assets':
          return (
            <div>
              <h1 className="text-2xl font-bold mb-6 text-center text-primary">Trade Management App</h1>
              <AssetsSection 
                assets={assets}
                setAssets={setAssets}
              />
            </div>
          );
        case 'reports':
          return (
            <div>
              <h1 className="text-2xl font-bold mb-6 text-center text-primary">Trade Management App</h1>
              
              <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeReportTab === 'daily'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleReportTabChange('daily')}
                  >
                    Relatório Diário
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeReportTab === 'period'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleReportTabChange('period')}
                  >
                    Relatório por Período
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeReportTab === 'dashboard'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleReportTabChange('dashboard')}
                  >
                    Dashboard
                  </button>
                </nav>
              </div>
              
              {activeReportTab === 'daily' && 
                stats && typeof stats === 'object' && 
                dailyReport && typeof dailyReport === 'object' && 
                selectedDate && 
                setSelectedDate && typeof setSelectedDate === 'function' && 
                exportData && typeof exportData === 'function' && 
                importData && typeof importData === 'function' && 
              (
                <ReportsSection 
                  stats={stats} 
                  selectedDate={selectedDate} 
                  setSelectedDate={setSelectedDate} 
                  dailyReport={dailyReport} 
                  exportData={exportData} 
                  importData={importData} 
                />
              )}
              
              {activeReportTab === 'period' && trades && dailyGoal != null && goalType && initialBankroll != null && (
                <PeriodGoalReport 
                  trades={trades}
                  dailyGoal={dailyGoal}
                  goalType={goalType}
                  initialBankroll={initialBankroll}
                />
              )}
              
              {activeReportTab === 'dashboard' && trades && dailyGoal != null && goalType && initialBankroll != null && assets && (
                <DashboardView 
                  trades={trades}
                  dailyGoal={dailyGoal}
                  goalType={goalType}
                  initialBankroll={initialBankroll}
                  currentBankroll={currentBankroll} // Adicionado currentBankroll
                  assets={assets}
                />
              )}
            </div>
          );
        case 'settings':
          return (
            <div>
              <h1 className="text-2xl font-bold mb-6 text-center text-primary">Trade Management App</h1>
              <CapitalManagement 
                stopLoss={stopLoss}
                setStopLoss={setStopLoss}
                stopWin={stopWin}
                setStopWin={setStopWin}
                stopLossType={stopLossType}
                setStopLossType={setStopLossType}
                stopWinType={stopWinType}
                setStopWinType={setStopWinType}
                initialBankroll={initialBankroll}
              />
            </div>
          );
        default:
          return (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-gray-700">Seção não encontrada</h2>
              <p className="mt-2 text-gray-500">A seção solicitada não está disponível.</p>
              <button
                onClick={() => handleTabChange('history')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Voltar para o Histórico
              </button>
            </div>
          );
      }
    } catch (error) {
      console.error("Erro ao renderizar conteúdo:", error);
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> Ocorreu um erro ao carregar esta seção.</span>
          <button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setActiveTab('history');
              window.location.reload();
            }}
          >
            Voltar para o Histórico
          </button>
        </div>
      );
    }
  };

  // Modal de importação
  const renderImportModal = () => {
    if (!showImportModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Importar Operações</h2>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeImportTab === 'csv'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveImportTab('csv')}
                >
                  Importar via CSV
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeImportTab === 'image'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveImportTab('image')}
                >
                  Importar via Imagem
                </button>
              </nav>
            </div>
            
            {activeImportTab === 'csv' && (
              <CSVImporter 
                onImport={handleCSVImport}
                onCancel={() => setShowImportModal(false)}
              />
            )}
            
            {activeImportTab === 'image' && (
              <ImageImporter 
                onImport={handleImageImport}
                onCancel={() => setShowImportModal(false)}
                assets={assets}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('history')}
          >
            Histórico
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assets'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('assets')}
          >
            Ativos
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('reports')}
          >
            Relatórios
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('settings')}
          >
            Configurações
          </button>
        </nav>
      </div>
      
      {renderContent()}
      {renderImportModal()}
    </div>
  );
};

export default App;
