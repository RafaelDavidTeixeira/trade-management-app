import React, { useState, useMemo } from 'react';

const PeriodGoalReport = ({ 
  trades, 
  dailyGoal, 
  goalType, 
  initialBankroll 
}) => {
  // Estado para período selecionado - inicialmente vazio
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Estado para controlar validação
  const [dateError, setDateError] = useState('');

  // Calcular meta efetiva com base no tipo (valor fixo ou percentual)
  const calculateEffectiveGoal = (date) => {
    let effectiveGoal = parseFloat(dailyGoal) || 0;
    if (goalType === '%') {
      effectiveGoal = (parseFloat(initialBankroll) * (effectiveGoal / 100));
    }
    return effectiveGoal;
  };

  // Validar datas antes de gerar relatório
  const validateDates = () => {
    if (!startDate || !endDate) {
      setDateError('Por favor, selecione as datas inicial e final');
      return false;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setDateError('A data inicial não pode ser posterior à data final');
      return false;
    }
    
    setDateError('');
    return true;
  };

  // Gerar relatório diário para o período selecionado
  const dailyReports = useMemo(() => {
    // Verificar se as datas são válidas
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      return [];
    }
    
    // Criar array de todas as datas no intervalo
    const dateArray = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dateArray.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Gerar relatório para cada data
    return dateArray.map(date => {
      const dailyTrades = trades.filter(trade => trade.date === date);
      const dailyProfitLoss = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
      const effectiveGoal = calculateEffectiveGoal(date);
      const metGoal = dailyTrades.length > 0 && dailyProfitLoss >= effectiveGoal;
      
      return {
        date,
        trades: dailyTrades,
        tradeCount: dailyTrades.length,
        profitLoss: dailyProfitLoss,
        effectiveGoal,
        metGoal,
        percentage: effectiveGoal > 0 ? (dailyProfitLoss / effectiveGoal) * 100 : 0,
        shortfall: metGoal ? 0 : (effectiveGoal - dailyProfitLoss),
        exceeded: metGoal ? (dailyProfitLoss - effectiveGoal) : 0
      };
    });
  }, [trades, startDate, endDate, dailyGoal, goalType, initialBankroll]);

  // Calcular estatísticas do período
  const periodStats = useMemo(() => {
    const totalDays = dailyReports.length;
    const daysWithTrades = dailyReports.filter(day => day.tradeCount > 0).length;
    const daysMetGoal = dailyReports.filter(day => day.metGoal).length;
    const totalProfitLoss = dailyReports.reduce((sum, day) => sum + day.profitLoss, 0);
    const successRate = daysWithTrades > 0 ? (daysMetGoal / daysWithTrades) * 100 : 0;
    
    return {
      totalDays,
      daysWithTrades,
      daysMetGoal,
      totalProfitLoss,
      successRate,
      averageProfitLoss: daysWithTrades > 0 ? totalProfitLoss / daysWithTrades : 0
    };
  }, [dailyReports]);

  // Exportar relatório como CSV
  const exportCSV = () => {
    if (!validateDates()) {
      return;
    }
    
    // Cabeçalho do CSV
    let csvContent = "Data,Operações,Lucro/Prejuízo,Meta,Meta Atingida,Percentual da Meta\n";
    
    // Adicionar linhas para cada dia
    dailyReports.forEach(day => {
      csvContent += `${day.date},${day.tradeCount},${day.profitLoss.toFixed(2)},${day.effectiveGoal.toFixed(2)},${day.metGoal ? "Sim" : "Não"},${day.percentage.toFixed(2)}%\n`;
    });
    
    // Criar e baixar o arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_metas_${startDate}_a_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Relatório de Metas por Período</h2>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Selecione a data inicial"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Selecione a data final"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Exportar CSV
            </button>
          </div>
        </div>
        
        {dateError && (
          <div className="mt-2 text-sm text-red-600">
            {dateError}
          </div>
        )}
        
        {!startDate || !endDate ? (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
            <p className="text-sm">
              Selecione as datas inicial e final para gerar o relatório de metas do período.
            </p>
          </div>
        ) : null}
      </div>
      
      {startDate && endDate && new Date(startDate) <= new Date(endDate) ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Resumo do Período</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Dias com Operações</div>
                <div className="text-2xl font-bold">{periodStats.daysWithTrades} <span className="text-sm text-gray-500">de {periodStats.totalDays}</span></div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Dias com Meta Atingida</div>
                <div className="text-2xl font-bold text-green-600">{periodStats.daysMetGoal}</div>
                <div className="text-sm text-gray-500">
                  Taxa de Sucesso: {periodStats.successRate.toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Lucro/Prejuízo Total</div>
                <div className={`text-2xl font-bold ${periodStats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {periodStats.totalProfitLoss.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Média Diária: R$ {periodStats.averageProfitLoss.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Desempenho Diário</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operações</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro/Prejuízo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta Diária</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% da Meta</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyReports.map((day, index) => (
                    <tr key={day.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">{day.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{day.tradeCount}</td>
                      <td className={`px-4 py-3 whitespace-nowrap font-medium ${
                        day.profitLoss > 0 
                          ? 'text-green-600' 
                          : day.profitLoss < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                      }`}>
                        R$ {day.profitLoss.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">R$ {day.effectiveGoal.toFixed(2)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {day.tradeCount === 0 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            Sem operações
                          </span>
                        ) : day.metGoal ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Meta atingida
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Meta não atingida
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {day.tradeCount === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${day.metGoal ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(day.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <span>{day.percentage.toFixed(2)}%</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PeriodGoalReport;
