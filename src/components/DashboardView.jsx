import React, { useState, useMemo } from 'react';

const DashboardView = ({ 
  trades, 
  dailyGoal, 
  goalType, 
  initialBankroll, 
  currentBankroll,
  assets
}) => {
  // Estado para período de análise
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year'
  
  // Calcular datas com base no período
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'year':
        startDate.setDate(endDate.getDate() - 365);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  }, [period]);
  
  // Filtrar trades pelo período
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const tradeDate = trade.date;
      return tradeDate >= dateRange.start && tradeDate <= dateRange.end;
    });
  }, [trades, dateRange]);
  
  // Calcular KPIs
  const kpis = useMemo(() => {
    const totalTrades = filteredTrades.length;
    const profitLoss = filteredTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
    const winningTrades = filteredTrades.filter(t => parseFloat(t.profitLoss) > 0).length;
    const losingTrades = filteredTrades.filter(t => parseFloat(t.profitLoss) < 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    // Agrupar por dia para análise de metas
    const tradesByDay = filteredTrades.reduce((acc, trade) => {
      if (!acc[trade.date]) {
        acc[trade.date] = [];
      }
      acc[trade.date].push(trade);
      return acc;
    }, {});
    
    // Calcular dias com meta atingida
    let daysWithTrades = 0;
    let daysMetGoal = 0;
    
    Object.entries(tradesByDay).forEach(([date, dayTrades]) => {
      daysWithTrades++;
      const dailyProfitLoss = dayTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
      let effectiveGoal = parseFloat(dailyGoal) || 0;
      if (goalType === '%') {
        effectiveGoal = (parseFloat(initialBankroll) * (effectiveGoal / 100));
      }
      
      if (dailyProfitLoss >= effectiveGoal) {
        daysMetGoal++;
      }
    });
    
    const goalSuccessRate = daysWithTrades > 0 ? (daysMetGoal / daysWithTrades) * 100 : 0;
    
    // Calcular distribuição por ativo
    const assetDistribution = filteredTrades.reduce((acc, trade) => {
      if (!acc[trade.asset]) {
        acc[trade.asset] = {
          count: 0,
          profitLoss: 0
        };
      }
      acc[trade.asset].count++;
      acc[trade.asset].profitLoss += parseFloat(trade.profitLoss) || 0;
      return acc;
    }, {});
    
    return {
      totalTrades,
      profitLoss,
      winningTrades,
      losingTrades,
      winRate,
      daysWithTrades,
      daysMetGoal,
      goalSuccessRate,
      assetDistribution
    };
  }, [filteredTrades, dailyGoal, goalType, initialBankroll]);
  
  // Preparar dados para gráficos
  const chartData = useMemo(() => {
    // Dados para gráfico de desempenho diário
    const dailyPerformance = {};
    
    // Inicializar todas as datas no intervalo
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const dateArray = [];
    
    while (start <= end) {
      const dateStr = start.toISOString().split('T')[0];
      dateArray.push(dateStr);
      dailyPerformance[dateStr] = 0;
      start.setDate(start.getDate() + 1);
    }
    
    // Preencher com dados reais
    filteredTrades.forEach(trade => {
      if (dailyPerformance[trade.date] !== undefined) {
        dailyPerformance[trade.date] += parseFloat(trade.profitLoss) || 0;
      }
    });
    
    // Converter para arrays para uso em gráficos
    const labels = Object.keys(dailyPerformance).sort();
    const values = labels.map(date => dailyPerformance[date]);
    
    // Dados para gráfico de distribuição por ativo
    const assetLabels = Object.keys(kpis.assetDistribution);
    const assetCounts = assetLabels.map(asset => kpis.assetDistribution[asset].count);
    const assetProfits = assetLabels.map(asset => kpis.assetDistribution[asset].profitLoss);
    
    return {
      dailyPerformance: {
        labels,
        values
      },
      assetDistribution: {
        labels: assetLabels,
        counts: assetCounts,
        profits: assetProfits
      }
    };
  }, [filteredTrades, dateRange, kpis.assetDistribution]);
  
  // Função para formatar datas de acordo com o período
  const formatDateLabel = (dateStr, index, totalLabels) => {
    const date = new Date(dateStr);
    
    // Determinar o intervalo de exibição com base no período
    let interval;
    if (period === 'week') {
      interval = 1; // Mostrar todos os dias na semana
    } else if (period === 'month') {
      interval = 3; // Mostrar a cada 3 dias no mês
    } else {
      // Para 365 dias, mostrar apenas o primeiro dia de cada mês
      const isFirstOfMonth = date.getDate() === 1;
      if (isFirstOfMonth) {
        // Formato MM/AA para o primeiro dia do mês
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
      } else {
        return ''; // Não mostrar outras datas
      }
    }
    
    // Verificar se deve mostrar esta data baseado no intervalo
    if (index % interval !== 0 && period !== 'year') {
      return '';
    }
    
    // Formatar a data de acordo com o período
    if (period === 'week') {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } else if (period === 'month') {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      // Já tratado acima para o período anual
      return '';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 rounded-md text-sm ${
              period === 'week' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              period === 'month' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-3 py-1 rounded-md text-sm ${
              period === 'year' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            365 dias
          </button>
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Operações</div>
          <div className="text-2xl font-bold">{kpis.totalTrades}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Lucro/Prejuízo</div>
          <div className={`text-2xl font-bold ${kpis.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {kpis.profitLoss.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Taxa de Acerto</div>
          <div className="text-2xl font-bold">{kpis.winRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">{kpis.winningTrades} ganhos, {kpis.losingTrades} perdas</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Metas Atingidas</div>
          <div className="text-2xl font-bold">{kpis.goalSuccessRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">{kpis.daysMetGoal} de {kpis.daysWithTrades} dias</div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Desempenho Diário</h3>
          
          {/* Gráfico de barras com formatação de datas melhorada */}
          <div className="h-64 flex items-end space-x-0.5 overflow-x-auto pb-6">
            {chartData.dailyPerformance.labels.map((date, index) => {
              const value = chartData.dailyPerformance.values[index];
              const maxValue = Math.max(...chartData.dailyPerformance.values.map(v => Math.abs(v))) || 1;
              const height = Math.abs(value) / maxValue * 100;
              const dateLabel = formatDateLabel(date, index, chartData.dailyPerformance.labels.length);
              
              return (
                <div key={date} className="flex-1 min-w-[4px] flex flex-col items-center">
                  <div 
                    className={`w-full ${value >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${date}: R$ ${value.toFixed(2)}`}
                  ></div>
                  {dateLabel && (
                    <div className="text-[8px] mt-1 transform -rotate-90 origin-top-left whitespace-nowrap">
                      {dateLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legenda para período anual */}
          {period === 'year' && (
            <div className="text-xs text-gray-500 text-center mt-2">
              * Apenas o primeiro dia de cada mês é exibido no eixo X
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Distribuição por Ativo</h3>
          
          {/* Gráfico de distribuição simulado */}
          <div className="space-y-3">
            {chartData.assetDistribution.labels.map((asset, index) => {
              const count = chartData.assetDistribution.counts[index];
              const profit = chartData.assetDistribution.profits[index];
              const percentage = kpis.totalTrades > 0 ? (count / kpis.totalTrades) * 100 : 0;
              
              return (
                <div key={asset}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{asset}</span>
                    <span className="text-sm">{count} operações ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={profit >= 0 ? 'bg-green-500' : 'bg-red-500'} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {profit.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {assets[asset] ? `${(assets[asset] * 100).toFixed(0)}% retorno` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Resumo de Capital */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Evolução do Capital</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Capital Inicial</div>
            <div className="text-2xl font-bold">R$ {parseFloat(initialBankroll).toFixed(2)}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600">Capital Atual</div>
            <div className={`text-2xl font-bold ${currentBankroll >= initialBankroll ? 'text-green-600' : 'text-red-600'}`}>
              R$ {currentBankroll.toFixed(2)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600">Variação</div>
            <div className={`text-2xl font-bold ${currentBankroll >= initialBankroll ? 'text-green-600' : 'text-red-600'}`}>
              {initialBankroll > 0 
                ? `${((currentBankroll / initialBankroll - 1) * 100).toFixed(2)}%` 
                : '0.00%'}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${currentBankroll >= initialBankroll ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ 
                width: `${Math.min(Math.abs((currentBankroll / initialBankroll - 1) * 100), 100)}%`,
                marginLeft: currentBankroll >= initialBankroll ? '0' : 'auto',
                marginRight: currentBankroll >= initialBankroll ? 'auto' : '0'
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>-100%</span>
            <span>0%</span>
            <span>+100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
