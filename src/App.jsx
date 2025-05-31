import { useState, useEffect, useMemo } from 'react';
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

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  // Novo estado para erros gerais da aplicação
  const [appError, setAppError] = useState(null);

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

  // Novo estado para a porcentagem de entrada
  const [entryPercentage, setEntryPercentage] = useState(() => {
    const saved = localStorage.getItem('entryPercentage');
    return saved ? parseFloat(saved) : 1; // Padrão de 1%
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
  const [activeReportTab, setActiveReportTab] = useState('daily');
  const [activeImportTab, setActiveImportTab] = useState('csv');
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
  const [editTransaction, setEditTransaction] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [isLoadingOcr, setIsLoadingOcr] = useState(false);

  // Estados para o modal personalizado
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState('');

  // Handler de erro global para capturar erros não tratados
  // Este useEffect deve ser o primeiro a tentar capturar erros globais.
  useEffect(() => {
    const handleError = (event) => {
      console.error("Erro global capturado:", event.error || event.reason);
      setAppError(event.error || new Error(event.reason || "Erro desconhecido na aplicação."));
      setLoadError("Ocorreu um erro crítico na aplicação. Por favor, recarregue a página.");
      // Previne que o erro se propague e cause uma tela em branco total,
      // embora em React, muitas vezes o erro já terá causado o crash.
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []); // Executa apenas uma vez na montagem do componente

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
        localStorage.setItem('entryPercentage', entryPercentage.toString()); // Salva a porcentagem de entrada
      } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
      }
    };
    saveData();
  }, [trades, transactions, dailyGoal, goalType, initialBankroll, stopLoss, stopWin, stopLossType, stopWinType, assets, lastDate, entryPercentage]);

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

  const runningTotal = useMemo(() => {
    // Garante que runningTotal seja um número, com fallback para 0
    const total = trades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
    return isNaN(total) ? 0 : total;
  }, [trades]);

  const transactionsTotal = useMemo(() => {
    const deposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const withdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    // Garante que transactionsTotal seja um número, com fallback para 0
    const total = deposits - withdrawals;
    return isNaN(total) ? 0 : total;
  }, [transactions]);

  const currentBankroll = useMemo(() => {
    const initial = parseFloat(initialBankroll) || 0;
    const running = runningTotal || 0; // runningTotal já é um número
    const transactions = transactionsTotal || 0; // transactionsTotal já é um número
    const result = initial + running + transactions;
    // Retorna um número, não uma string formatada aqui
    return isNaN(result) ? 0 : result;
  }, [initialBankroll, runningTotal, transactionsTotal]);

  const checkCapitalManagement = () => {
    const total = parseFloat(runningTotal);
    let effectiveStopLoss = parseFloat(stopLoss);
    if (stopLossType === '%') {
      effectiveStopLoss = (currentBankroll * (stopLoss / 100)); // currentBankroll já é um número
    }
    let effectiveStopWin = parseFloat(stopWin);
    if (stopWinType === '%') {
      effectiveStopWin = (currentBankroll * (stopWin / 100)); // currentBankroll já é um número
    }
  };

  useEffect(() => {
    checkCapitalManagement();
  }, [runningTotal, stopLoss, stopLossType, stopWin, stopWinType, currentBankroll]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };

      // Lógica para calcular profitLoss
      if (name === 'asset' || name === 'betAmount' || name === 'outcome' || name === 'type') {
        const selectedAsset = name === 'asset' ? value : prev.asset;
        const betAmount = name === 'betAmount' ? parseFloat(value) || 0 : parseFloat(prev.betAmount) || 0;
        const outcome = name === 'outcome' ? value : prev.outcome;
        const currentType = name === 'type' ? value : prev.type; // Captura o tipo atual

        if (currentType === 'Copy') {
          // Se o tipo for 'Copy', o profitLoss é inserido manualmente.
          // Não alteramos newFormData.profitLoss aqui, pois ele virá do input direto.
          // Apenas garantimos que 'outcome' não afete o cálculo automático.
          // Se o campo de profitLoss for o que está sendo alterado, ele já está no newFormData.
        } else {
          // Lógica existente para outros tipos
          const percentage = assets[selectedAsset] || 0;
          newFormData.profitLoss = outcome === 'Positive'
            ? (betAmount * percentage).toFixed(2)
            : outcome === 'Tie'
            ? '0.00'
            : (-betAmount).toFixed(2);
        }
      }
      return newFormData;
    });
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setEditTransaction(prev => ({
      ...prev,
      [name]: value,
      amount: name === 'amount' ? parseFloat(value) || 0 : prev.amount,
    }));
  };

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

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      timestamp: editTransaction ? editTransaction.timestamp : Date.now(),
      date: today, // Adiciona a data atual à transação
      amount: parseFloat(transaction.amount) || 0,
    };
    const updatedTransactions = editTransaction
      ? transactions.map(t => t.timestamp === editTransaction.timestamp ? newTransaction : t)
      : [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    setEditTransaction(null);
  };

  // Função para exibir o modal de confirmação personalizado
  const showCustomConfirm = (message, action) => {
    setConfirmModalMessage(message);
    setConfirmModalAction(() => action); // Use uma função para armazenar a ação
    setShowConfirmModal(true);
  };

  // Função para exibir o modal de alerta personalizado
  const showCustomAlert = (message) => {
    setAlertModalMessage(message);
    setShowAlertModal(true);
  };

  const deleteTransaction = (timestamp) => {
    showCustomConfirm('Tem certeza que deseja excluir esta transação?', () => {
      setTransactions(transactions.filter(t => t.timestamp !== timestamp));
      setShowConfirmModal(false); // Fecha o modal após a ação
    });
  };

  const deleteTrade = (id) => {
    showCustomConfirm('Tem certeza que deseja excluir esta operação?', () => {
      setTrades(trades.filter(trade => trade.id !== id));
      setShowConfirmModal(false); // Fecha o modal após a ação
    });
  };

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

  const editTradeHandler = (trade) => {
    console.log('Editing trade:', trade);
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

  const editTransactionHandler = (transaction) => {
    setEditTransaction(transaction);
  };

  const clearAllTrades = () => {
    showCustomConfirm('Tem certeza que deseja limpar todas as operações? Esta ação não pode ser desfeita.', () => {
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
      setShowConfirmModal(false); // Fecha o modal após a ação
    });
  };

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
          const fullYear = year.length === 2 ? '20' + year : year;
          extracted.date = fullYear + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
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
      showCustomAlert('Erro ao processar a imagem. Verifique se a imagem está legível.');
    }
    setIsLoadingOcr(false);
  };

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
      entryPercentage, // Exporta a porcentagem de entrada
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
        if (backupData.entryPercentage) setEntryPercentage(parseFloat(backupData.entryPercentage)); // Importa a porcentagem de entrada

        showCustomAlert(`Importação concluída: ${newTrades.length} novas operações adicionadas.`);
      } catch (err) {
        console.error(err);
        showCustomAlert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
      }
    };
    reader.readAsText(file);
  };

  const handleCSVImport = (importedTrades) => {
    if (!importedTrades || importedTrades.length === 0) {
      showCustomAlert('Nenhuma operação válida para importar.');
      return;
    }

    const newTrades = importedTrades.map((trade, index) => ({
      id: Date.now() + index,
      date: trade.date,
      time: trade.time,
      asset: trade.asset,
      type: trade.type || 'Crypto',
      betAmount: parseFloat(trade.amount) || 0,
      profitLoss: parseFloat(trade.profitLoss) || 0,
    }));

    setTrades([...trades, ...newTrades]);
    setShowImportModal(false);

    showCustomAlert(`Importação concluída: ${newTrades.length} operações adicionadas.`);
  };

  const handleImageImport = (importedTrades) => {
    if (!importedTrades || importedTrades.length === 0) {
      showCustomAlert('Nenhuma operação válida para importar.');
      return;
    }

    const newTrades = importedTrades.map((trade, index) => ({
      id: Date.now() + index,
      date: trade.date,
      time: trade.time,
      asset: trade.asset,
      type: trade.type || 'Crypto',
      betAmount: parseFloat(trade.amount) || 0,
      profitLoss: parseFloat(trade.profitLoss) || 0,
    }));

    setTrades([...trades, ...newTrades]);
    setShowImportModal(false);

    showCustomAlert(`Importação concluída: ${newTrades.length} operações adicionadas.`);
  };

  const stats = useMemo(() => {
    const totalBet = trades.reduce((sum, t) => sum + (parseFloat(t.betAmount) || 0), 0);
    const gains = trades.reduce((sum, t) => t.profitLoss > 0 ? sum + parseFloat(t.profitLoss) || 0 : sum, 0);
    const losses = trades.reduce((sum, t) => t.profitLoss < 0 ? sum + parseFloat(t.profitLoss) || 0 : sum, 0);
    const ties = trades.filter(t => parseFloat(t.profitLoss) === 0).length;
    const finalBalance = (gains + losses); // Retorna número
    const tradeCount = trades.length;
    const wins = trades.filter(t => parseFloat(t.profitLoss) > 0).length;
    const lossCount = trades.filter(t => parseFloat(t.profitLoss) < 0).length;
    const tieCount = ties;
    const winRate = tradeCount > 0 ? (wins / tradeCount * 100) : 0; // Retorna número
    const avgReturn = tradeCount > 0 ? (finalBalance / tradeCount) : 0; // Retorna número
    const bestTrade = trades.reduce((best, t) => {
      const profit = parseFloat(t.profitLoss) || 0;
      return profit > (best?.profitLoss || -Infinity) ? t : best;
    }, null);
    const worstTrade = trades.reduce((worst, t) => {
      const profit = parseFloat(t.profitLoss) || 0;
      return profit < (worst?.profitLoss || Infinity) ? t : worst;
    }, null);

    return {
      totalBet: isNaN(totalBet) ? 0 : totalBet,
      gains: isNaN(gains) ? 0 : gains,
      losses: isNaN(losses) ? 0 : losses,
      ties,
      finalBalance: isNaN(finalBalance) ? 0 : finalBalance,
      tradeCount,
      wins,
      lossCount,
      tieCount,
      winRate: isNaN(winRate) ? 0 : winRate,
      avgReturn: isNaN(avgReturn) ? 0 : avgReturn,
      bestTrade,
      worstTrade,
    };
  }, [trades]);

  const dailyReport = useMemo(() => {
    try {
      const dailyTrades = trades.filter(t => t.date === selectedDate);
      const dailyProfitLoss = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
      const dailyTotalBet = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.betAmount) || 0), 0);

      let goalAmount = parseFloat(dailyGoal) || 0;
      if (goalType === '%') {
        const baseBankroll = currentBankroll; // currentBankroll já é um número
        if (!isNaN(baseBankroll) && baseBankroll !== 0) {
          goalAmount = baseBankroll * (parseFloat(dailyGoal) / 100);
        } else {
          goalAmount = parseFloat(dailyGoal);
          console.warn("Current bankroll is zero or invalid for percentage goal calculation. Using fixed goal amount.");
        }
      }

      if (isNaN(goalAmount)) {
        goalAmount = 0;
        console.warn("Goal amount calculation resulted in NaN. Defaulting to 0.");
      }

      const goalProgress = goalAmount !== 0 ? ((dailyProfitLoss / goalAmount) * 100) : 0; // Retorna número
      const metDailyGoal = dailyProfitLoss >= goalAmount;
      const shortfall = Math.max(0, goalAmount - dailyProfitLoss); // Retorna número
      const exceeded = Math.max(0, dailyProfitLoss - goalAmount); // Retorna número

      return {
        tradeCount: dailyTrades.length,
        totalBet: isNaN(dailyTotalBet) ? 0 : dailyTotalBet,
        dailyProfitLoss: isNaN(dailyProfitLoss) ? 0 : dailyProfitLoss,
        goalProgress: isNaN(goalProgress) ? 0 : goalProgress,
        metDailyGoal,
        shortfall: isNaN(shortfall) ? 0 : shortfall,
        exceeded: isNaN(exceeded) ? 0 : exceeded,
        runningTotal: runningTotal, // runningTotal já é um número
        finalBalance: currentBankroll, // currentBankroll já é um número
      };
    } catch (error) {
      console.error("Erro ao calcular relatório diário:", error);
      return {
        tradeCount: 0,
        totalBet: 0,
        dailyProfitLoss: 0,
        goalProgress: 0,
        metDailyGoal: false,
        shortfall: 0,
        exceeded: 0,
        runningTotal: 0,
        finalBalance: 0,
      };
    }
  }, [trades, selectedDate, dailyGoal, goalType, currentBankroll, runningTotal]);

  const handleTabChange = (tab) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      setActiveTab(tab);
      if (tab === 'reports' && activeTab !== 'reports') {
        setActiveReportTab('daily');
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao mudar de aba:", error);
      setLoadError("Ocorreu um erro ao carregar esta seção. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

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

  // Centraliza a lógica de renderização do conteúdo principal
  const renderMainContent = () => {
    // Se houver um erro crítico na aplicação (appError), exibe a mensagem de erro
    if (appError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro Crítico!</strong>
          <span className="block sm:inline"> {loadError || "Ocorreu um erro inesperado na aplicação. Por favor, recarregue a página."}</span>
          <button
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Recarregar Aplicativo
          </button>
          {/* Opcional: Exibir detalhes do erro para depuração */}
          {/* <pre className="mt-2 text-red-600 text-xs overflow-auto">{appError.stack}</pre> */}
        </div>
      );
    }

    // Se estiver carregando, mostra o spinner
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Se houver um erro de carregamento específico da aba, mostra a mensagem
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

    // Renderiza o conteúdo da aba ativa
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
                      currentBankroll={currentBankroll} // Passando como número
                      runningTotal={runningTotal} // Passando como número
                      transactions={transactions}
                      addTransaction={addTransaction}
                      editTransaction={editTransaction}
                      handleTransactionInputChange={handleTransactionInputChange}
                    />
                  </div>
                </div>
                <div>
                  <StatsSection
                    stats={stats} // stats.bestTrade e stats.worstTrade são objetos, garantir que StatsSection os renderize corretamente
                    initialBankroll={initialBankroll}
                    currentBankroll={currentBankroll} // Passando como número
                    runningTotal={runningTotal} // Passando como número
                    dailyGoal={dailyGoal}
                    goalType={goalType}
                    dailyReport={dailyReport}
                    entryPercentage={entryPercentage} // Passa a porcentagem de entrada
                  />
                  <div className="mt-6">
                    <GoalSection
                      dailyGoal={dailyGoal}
                      setDailyGoal={setDailyGoal}
                      goalType={goalType}
                      setGoalType={setGoalType}
                      runningTotal={runningTotal} // Passando como número
                      initialBankroll={initialBankroll}
                      currentBankroll={currentBankroll} // Passando como número
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
                  onEditTransaction={editTransactionHandler}
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
              {activeReportTab === 'daily' && (
                <ReportsSection
                  stats={stats}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  dailyReport={dailyReport}
                  exportData={exportData}
                  importData={importData}
                />
              )}
              {activeReportTab === 'period' && (
                <PeriodGoalReport
                  trades={trades}
                  dailyGoal={dailyGoal}
                  goalType={goalType}
                  initialBankroll={initialBankroll}
                  currentBankroll={currentBankroll} // Passando como número
                />
              )}
              {activeReportTab === 'dashboard' && (
                <DashboardView
                  trades={trades}
                  dailyGoal={dailyGoal}
                  goalType={goalType}
                  initialBankroll={initialBankroll}
                  currentBankroll={currentBankroll} // Passando como número
                  assets={assets}
                  stats={stats}
                  dailyReport={dailyReport}
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
                currentBankroll={currentBankroll} // Passando como número
                entryPercentage={entryPercentage} // Passa a porcentagem de entrada
                setEntryPercentage={setEntryPercentage} // Passa a função para atualizar
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
      console.error("Erro ao renderizar conteúdo da aba:", error);
      // Se um erro ocorrer dentro de um switch case, ele será capturado aqui
      // e definirá appError para que o erro crítico seja exibido.
      setAppError(error);
      setLoadError("Ocorreu um erro ao carregar esta seção. Por favor, tente novamente.");
      return null; // Retorna null para permitir que o estado appError assuma o controle da renderização
    }
  };

  const renderCustomModal = () => {
    if (!showConfirmModal && !showAlertModal) return null;

    const message = showConfirmModal ? confirmModalMessage : alertModalMessage;
    const isConfirm = showConfirmModal;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
          <h3 className="text-lg font-semibold mb-4">{isConfirm ? 'Confirmação' : 'Aviso'}</h3>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            {isConfirm && (
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmModalAction(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => {
                if (isConfirm && confirmModalAction) {
                  confirmModalAction();
                } else if (!isConfirm) {
                  setShowAlertModal(false);
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              {isConfirm ? 'Confirmar' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderImportModal = () => {
    if (!showImportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-4xl">
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
      {renderMainContent()} {/* Chama a função centralizada de renderização */}
      {renderImportModal()}
      {renderCustomModal()}
    </div>
  );
};

export default App;
