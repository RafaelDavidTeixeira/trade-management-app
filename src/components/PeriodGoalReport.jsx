import React, { useState, useMemo } from 'react';

const PeriodGoalReport = ({ trades, dailyGoal, goalType, initialBankroll, currentBankroll }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const start = startDate ? new Date(startDate + 'T00:00:00') : null; // Garante que a data seja comparável
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;     // Garante que a data seja comparável

      return (!start || tradeDate >= start) && (!end || tradeDate <= end);
    });
  }, [trades, startDate, endDate]);

  const periodStats = useMemo(() => {
    const totalProfitLoss = filteredTrades.reduce((sum, trade) => sum + parseFloat(trade.profitLoss), 0);
    const totalBetAmount = filteredTrades.reduce((sum, trade) => sum + parseFloat(trade.betAmount), 0);
    const tradeCount = filteredTrades.length;
    const wins = filteredTrades.filter(trade => parseFloat(trade.profitLoss) > 0).length;
    const losses = filteredTrades.filter(trade => parseFloat(trade.profitLoss) < 0).length;
    const ties = filteredTrades.filter(trade => parseFloat(trade.profitLoss) === 0).length;

    let periodGoalAmount = 0;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia final

      if (goalType === 'R$') {
        // Se a meta é em R$, a meta do período é a meta diária multiplicada pelo número de dias
        periodGoalAmount = dailyGoal * diffDays;
      } else {
        // Se a meta é em %, a meta do período é a soma das metas diárias percentuais
        // aplicadas à banca inicial. Isso é uma interpretação comum para metas de período.
        const baseBankrollForPercentageGoal = parseFloat(initialBankroll) || 0;
        periodGoalAmount = (baseBankrollForPercentageGoal * (dailyGoal / 100)) * diffDays;
      }
    } else {
      // Se não há período selecionado, a meta do período é 0
      periodGoalAmount = 0;
    }

    const goalProgress = periodGoalAmount !== 0 ? ((totalProfitLoss / periodGoalAmount) * 100) : 0;
    const metPeriodGoal = totalProfitLoss >= periodGoalAmount;
    const shortfall = Math.max(0, periodGoalAmount - totalProfitLoss);
    const exceeded = Math.max(0, totalProfitLoss - periodGoalAmount);

    return {
      totalProfitLoss: isNaN(totalProfitLoss) ? 0 : totalProfitLoss,
      totalBetAmount: isNaN(totalBetAmount) ? 0 : totalBetAmount,
      tradeCount,
      wins,
      losses,
      ties,
      periodGoalAmount: isNaN(periodGoalAmount) ? 0 : periodGoalAmount,
      goalProgress: isNaN(goalProgress) ? 0 : goalProgress,
      metPeriodGoal,
      shortfall: isNaN(shortfall) ? 0 : shortfall,
      exceeded: isNaN(exceeded) ? 0 : exceeded,
    };
  }, [filteredTrades, startDate, endDate, dailyGoal, goalType, initialBankroll, currentBankroll]); // Adiciona initialBankroll como dependência

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Relatório de Metas por Período</h2>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div>
          <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
            Data de Início:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
            Data de Fim:
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resumo do Período */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Resumo do Período</h3>
          <p>Total de Operações: <span className="font-bold">{periodStats.tradeCount}</span></p>
          <p>Total Apostado: <span className="font-bold">R$ {periodStats.totalBetAmount.toFixed(2)}</span></p>
          <p>Lucro/Prejuízo do Período: <span className={`font-bold ${periodStats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {periodStats.totalProfitLoss.toFixed(2)}</span></p>
          <p>Vitórias: <span className="font-bold text-green-600">{periodStats.wins}</span></p>
          <p>Derrotas: <span className="font-bold text-red-600">{periodStats.losses}</span></p>
          <p>Empates: <span className="font-bold text-gray-600">{periodStats.ties}</span></p>
        </div>

        {/* Progresso da Meta do Período */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Progresso da Meta do Período</h3>
          <p>Meta do Período: <span className="font-bold">R$ {periodStats.periodGoalAmount.toFixed(2)}</span></p>
          <p>Progresso da Meta: <span className="font-bold">{periodStats.goalProgress.toFixed(2)}%</span></p>
          {periodStats.metPeriodGoal ? (
            <p className="text-green-600 font-bold">Meta do Período Atingida! (Excedeu em R$ {periodStats.exceeded.toFixed(2)})</p>
          ) : (
            <p className="text-red-600 font-bold">Faltam R$ {periodStats.shortfall.toFixed(2)} para a meta.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodGoalReport;
