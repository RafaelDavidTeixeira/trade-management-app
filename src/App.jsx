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
  const appVersion = "v1.0.0";

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [appError, setAppError] = useState(null);
  const [toasts, setToasts] = useState([]); // Novo estado para toasts

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
    return saved ? parseFloat(saved) : 10;
  });

  const [goalType, setGoalType] = useState(() => {
    const saved = localStorage.getItem('goalType');
    return saved || '%';
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

  const [entryPercentage, setEntryPercentage] = useState(() => {
    const saved = localStorage.getItem('entryPercentage');
    return saved ? parseFloat(saved) : 1;
  });

  const [capitalBaseType, setCapitalBaseType] = useState(() => {
    const saved = localStorage.getItem('capitalBaseType');
    return saved && ['current', 'initial'].includes(saved) ? saved : 'current';
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState('');

  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    asset: 'Todos',
    type: 'Todos',
    outcome: 'Todos',
  });

  useEffect(() => {
    const handleError = (event) => {
      console.error("Erro global capturado:", event.error || event.reason);
      setAppError(event.error || new Error(event.reason || "Erro desconhecido na aplicação."));
      setLoadError("Ocorreu um erro crítico na aplicação. Por favor, recarregue a página.");
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

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
        localStorage.setItem('entryPercentage', entryPercentage.toString());
        localStorage.setItem('capitalBaseType', capitalBaseType);
      } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
      }
    };
    saveData();
  }, [trades, transactions, dailyGoal, goalType, initialBankroll, stopLoss, stopWin, stopLossType, stopWinType, assets, lastDate, entryPercentage, capitalBaseType]);

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

  useEffect(() => {
    const autoBackup = () => {
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
        entryPercentage,
        capitalBaseType,
      };
      localStorage.setItem('autoBackup', JSON.stringify(backupData));
      console.log('Backup automático salvo às', new Date().toLocaleTimeString());
    };

    const backupInterval = setInterval(autoBackup, 5 * 60 * 1000); // 5 minutos
    autoBackup(); // Salva imediatamente ao carregar
    return () => clearInterval(backupInterval);
  }, [trades, transactions, initialBankroll, dailyGoal, goalType, stopLoss, stopWin, stopLossType, stopWinType, assets, entryPercentage, capitalBaseType]);

  const runningTotal = useMemo(() => {
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
    const total = deposits - withdrawals;
    return isNaN(total) ? 0 : total;
  }, [transactions]);

  const currentBankroll = useMemo(() => {
    const initial = parseFloat(initialBankroll) || 0;
    const running = runningTotal || 0;
    const transactions = transactionsTotal || 0;
    const result = initial + running + transactions;
    return isNaN(result) ? 0 : result;
  }, [initialBankroll, runningTotal, transactionsTotal]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9); // Chave única combinando timestamp e random
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000); // Remove após 5 segundos
  };

  useEffect(() => {
    const checkCapitalManagement = () => {
      const total = parseFloat(runningTotal);
      let effectiveStopLoss = parseFloat(stopLoss);
      if (stopLossType === '%') {
        effectiveStopLoss = (currentBankroll * (stopLoss / 100));
      }
      let effectiveStopWin = parseFloat(stopWin);
      if (stopWinType === '%') {
        effectiveStopWin = (currentBankroll * (stopWin / 100));
      }
      if (total <= -effectiveStopLoss) {
        addToast('Stop Loss atingido! Suas perdas alcançaram o limite definido.', 'error');
      }
      if (total >= effectiveStopWin) {
        addToast('Stop Win atingido! Seus ganhos alcançaram o limite definido.', 'success');
      }
      // Verificação da meta diária
      const dailyTrades = trades.filter(t => t.date === selectedDate);
      const dailyProfitLoss = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
      let goalAmount = parseFloat(dailyGoal) || 0;
      if (goalType === '%') {
        const baseBankroll = currentBankroll;
        if (!isNaN(baseBankroll) && baseBankroll !== 0) {
          goalAmount = baseBankroll * (parseFloat(dailyGoal) / 100);
        }
      }
      if (dailyProfitLoss >= goalAmount && goalAmount > 0) {
        addToast('Meta Diária atingida! Parabéns!', 'success');
      }
    };
    checkCapitalManagement();
  }, [runningTotal, stopLoss, stopLossType, stopWin, stopWinType, currentBankroll, trades, selectedDate, dailyGoal, goalType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };

      if (name === 'asset' || name === 'betAmount' || name === 'outcome' || name === 'type') {
        const selectedAsset = name === 'asset' ? value : prev.asset;
        const betAmount = name === 'betAmount' ? parseFloat(value) || 0 : parseFloat(prev.betAmount) || 0;
        const outcome = name === 'outcome' ? value : prev.outcome;
        const currentType = name === 'type' ? value : prev.type;

        if (currentType === 'Copy') {
        } else {
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
      date: today,
      amount: parseFloat(transaction.amount) || 0,
    };
    const updatedTransactions = editTransaction
      ? transactions.map(t => t.timestamp === editTransaction.timestamp ? newTransaction : t)
      : [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    setEditTransaction(null);
  };

  const showCustomConfirm = (message, action) => {
    setConfirmModalMessage(message);
    setConfirmModalAction(() => action);
    setShowConfirmModal(true);
  };

  const showCustomAlert = (message) => {
    setAlertModalMessage(message);
    setShowAlertModal(true);
  };

  const deleteTransaction = (timestamp) => {
    showCustomConfirm('Tem certeza que deseja excluir esta transação?', () => {
      setTransactions(transactions.filter(t => t.timestamp !== timestamp));
      setShowConfirmModal(false);
    });
  };

  const deleteTrade = (id) => {
    showCustomConfirm('Tem certeza que deseja excluir esta operação?', () => {
      setTrades(trades.filter(trade => trade.id !== id));
      setShowConfirmModal(false);
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
      setDailyGoal(10);
      setGoalType('%');
      setStopLoss(50);
      setStopWin(100);
      setStopLossType('R$');
      setStopWinType('R$');
      setCapitalBaseType('current');
      localStorage.removeItem('trades');
      localStorage.removeItem('transactions');
      localStorage.removeItem('initialBankroll');
      localStorage.removeItem('dailyGoal');
      localStorage.removeItem('goalType');
      localStorage.removeItem('stopLoss');
      localStorage.removeItem('stopWin');
      localStorage.removeItem('stopLossType');
      localStorage.removeItem('stopWinType');
      localStorage.removeItem('capitalBaseType');
      setShowConfirmModal(false);
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

  const exportData = (format = 'json') => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[:.]/g, '-');
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
      entryPercentage,
      capitalBaseType,
    };

    if (format === 'json') {
      const json = JSON.stringify(backupData);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trade_backup_${formattedDate}.json`;
      a.click();
      URL.revokeObjectURL(url); // Revogar dentro do bloco
    } else if (format === 'csv') {
      const headers = ['id,date,time,asset,type,betAmount,profitLoss'];
      const tradesCsv = trades.map(t => `${t.id},${t.date},${t.time},${t.asset},${t.type},${t.betAmount},${t.profitLoss}`).join('\n');
      const csv = [headers.join(','), tradesCsv].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trade_backup_${formattedDate}.csv`;
      a.click();
      URL.revokeObjectURL(url); // Revogar dentro do bloco
    }
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
        if (backupData.entryPercentage) setEntryPercentage(parseFloat(backupData.entryPercentage));
        if (backupData.capitalBaseType) setCapitalBaseType(backupData.capitalBaseType);

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
    const finalBalance = (gains + losses);
    const tradeCount = trades.length;
    const wins = trades.filter(t => parseFloat(t.profitLoss) > 0).length;
    const lossCount = trades.filter(t => parseFloat(t.profitLoss) < 0).length;
    const tieCount = ties;
    const winRate = tradeCount > 0 ? (wins / tradeCount * 100) : 0;
    const avgReturn = tradeCount > 0 ? (finalBalance / tradeCount) : 0;
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
        const baseBankroll = currentBankroll;
        if (!isNaN(baseBankroll) && baseBankroll !== 0) {
          goalAmount = baseBankroll * (parseFloat(dailyGoal) / 100);
        } else {
          goalAmount = 0;
          console.warn("Current bankroll is zero or invalid for percentage goal calculation. Setting goalAmount to 0.");
        }
      }

      if (isNaN(goalAmount)) {
        goalAmount = 0;
        console.warn("Goal amount calculation resulted in NaN. Defaulting to 0.");
      }

      const goalProgress = goalAmount !== 0 ? ((dailyProfitLoss / goalAmount) * 100) : 0;
      const metDailyGoal = dailyProfitLoss >= goalAmount;
      const shortfall = Math.max(0, goalAmount - dailyProfitLoss);
      const exceeded = Math.max(0, dailyProfitLoss - goalAmount);

      return {
        tradeCount: dailyTrades.length,
        totalBet: isNaN(dailyTotalBet) ? 0 : dailyTotalBet,
        dailyProfitLoss: isNaN(dailyProfitLoss) ? 0 : dailyProfitLoss,
        goalProgress: isNaN(goalProgress) ? 0 : goalProgress,
        metDailyGoal,
        shortfall: isNaN(shortfall) ? 0 : shortfall,
        exceeded: isNaN(exceeded) ? 0 : exceeded,
        runningTotal: runningTotal,
        finalBalance: currentBankroll,
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

  const detailedReport = useMemo(() => {
    let filteredTrades = [...trades];

    if (reportFilters.startDate) {
      filteredTrades = filteredTrades.filter(t => t.date >= reportFilters.startDate);
    }
    if (reportFilters.endDate) {
      filteredTrades = filteredTrades.filter(t => t.date <= reportFilters.endDate);
    }

    if (reportFilters.asset !== 'Todos') {
      filteredTrades = filteredTrades.filter(t => t.asset === reportFilters.asset);
    }

    if (reportFilters.type !== 'Todos') {
      filteredTrades = filteredTrades.filter(t => t.type === reportFilters.type);
    }

    if (reportFilters.outcome !== 'Todos') {
      filteredTrades = filteredTrades.filter(t => {
        const profitLoss = parseFloat(t.profitLoss) || 0;
        if (reportFilters.outcome === 'Positive') return profitLoss > 0;
        if (reportFilters.outcome === 'Negative') return profitLoss < 0;
        if (reportFilters.outcome === 'Tie') return profitLoss === 0;
        return true;
      });
    }

    const totalTrades = filteredTrades.length;
    const totalBet = filteredTrades.reduce((sum, t) => sum + (parseFloat(t.betAmount) || 0), 0);
    const totalProfitLoss = filteredTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);

    return {
      trades: filteredTrades,
      totalTrades,
      totalBet: isNaN(totalBet) ? 0 : totalBet,
      totalProfitLoss: isNaN(totalProfitLoss) ? 0 : totalProfitLoss,
    };
  }, [trades, reportFilters]);

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

  const renderMainContent = () => {
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
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

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
                      editTransaction={editTransaction}
                      handleTransactionInputChange={handleTransactionInputChange}
                    />
                  </div>
                </div>
                <div>
                  <StatsSection
                    stats={stats}
                    initialBankroll={initialBankroll}
                    currentBankroll={currentBankroll}
                    runningTotal={runningTotal}
                    dailyGoal={dailyGoal}
                    goalType={goalType}
                    dailyReport={dailyReport}
                    entryPercentage={entryPercentage}
                  />
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
                  onClick={() => exportData('json')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Exportar Dados (JSON)
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Exportar Dados (CSV)
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
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeReportTab === 'detailed'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleReportTabChange('detailed')}
                  >
                    Relatório Detalhado
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
                  currentBankroll={currentBankroll}
                />
              )}
              {activeReportTab === 'dashboard' && (
                <DashboardView
                  trades={trades}
                  dailyGoal={dailyGoal}
                  goalType={goalType}
                  initialBankroll={initialBankroll}
                  currentBankroll={currentBankroll}
                  assets={assets}
                  stats={stats}
                  dailyReport={dailyReport}
                />
              )}
              {activeReportTab === 'detailed' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Relatório Detalhado de Operações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Data Inicial</label>
                      <input
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={reportFilters.startDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Data Final</label>
                      <input
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={reportFilters.endDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Ativo</label>
                      <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={reportFilters.asset}
                        onChange={(e) => setReportFilters({ ...reportFilters, asset: e.target.value })}
                      >
                        <option value="Todos">Todos</option>
                        {Object.keys(assets).map(asset => (
                          <option key={asset} value={asset}>{asset}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Tipo</label>
                      <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={reportFilters.type}
                        onChange={(e) => setReportFilters({ ...reportFilters, type: e.target.value })}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Crypto">Crypto</option>
                        <option value="Copy">Copy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Resultado</label>
                      <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={reportFilters.outcome}
                        onChange={(e) => setReportFilters({ ...reportFilters, outcome: e.target.value })}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Positive">Positivo</option>
                        <option value="Negative">Negativo</option>
                        <option value="Tie">Empate</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm">Total de Operações: {detailedReport.totalTrades}</p>
                    <p className="text-gray-600 text-sm">Total Apostado: R$ {detailedReport.totalBet.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">Lucro/Prejuízo Total: R$ {detailedReport.totalProfitLoss.toFixed(2)}</p>
                  </div>
                  {detailedReport.trades.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Data</th>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Hora</th>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Ativo</th>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Tipo</th>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Valor Apostado (R$)</th>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Lucro/Prejuízo (R$)</th>
                            <th className="py-2 px-4 border-b text-left text-gray-700">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedReport.trades.map(trade => {
                            const profitLoss = parseFloat(trade.profitLoss) || 0;
                            const outcome = profitLoss > 0 ? 'Positivo' : profitLoss < 0 ? 'Negativo' : 'Empate';
                            return (
                              <tr key={trade.id}>
                                <td className="py-2 px-4 border-b">{trade.date}</td>
                                <td className="py-2 px-4 border-b">{trade.time}</td>
                                <td className="py-2 px-4 border-b">{trade.asset}</td>
                                <td className="py-2 px-4 border-b">{trade.type}</td>
                                <td className="py-2 px-4 border-b">{parseFloat(trade.betAmount).toFixed(2)}</td>
                                <td className={`py-2 px-4 border-b ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {profitLoss.toFixed(2)}
                                </td>
                                <td className="py-2 px-4 border-b">{outcome}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">Nenhuma operação encontrada com os filtros selecionados.</p>
                  )}
                </div>
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
                currentBankroll={currentBankroll}
                entryPercentage={entryPercentage}
                setEntryPercentage={setEntryPercentage}
                capitalBaseType={capitalBaseType}
                setCapitalBaseType={setCapitalBaseType}
                dailyGoal={dailyGoal}
                setDailyGoal={setDailyGoal}
                goalType={goalType}
                setGoalType={setGoalType}
                addToast={addToast}
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
      setAppError(error);
      setLoadError("Ocorreu um erro ao carregar esta seção. Por favor, tente novamente.");
      return null;
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

  const renderToasts = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id} // Chave única já ajustada no addToast
          className={`p-3 rounded-md shadow-md ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          } animate-fade-in-out`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 border-b border-gray-200 flex justify-between items-center">
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
        <span className="text-sm text-gray-500">Versão: {appVersion}</span>
      </div>
      {renderMainContent()}
      {renderImportModal()}
      {renderCustomModal()}
      {renderToasts()}
    </div>
  );
};

export default App;