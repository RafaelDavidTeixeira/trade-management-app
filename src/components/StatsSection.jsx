import React from 'react';

const StatsSection = ({ stats = {}, initialBankroll = 0, currentBankroll = 0, runningTotal = '0.00', dailyGoal = 0, goalType = 'R$' }) => {
  // Garantir que stats tenha valores padrão para todas as propriedades
  const safeStats = {
    tradeCount: 0,
    hitRate: '0.00',
    gains: '0.00',
    losses: '0.00',
    ties: 0,
    wins: 0,
    lossCount: 0,
    tieCount: 0,
    avgReturn: '0.00',
    totalBet: '0.00',
    bestTrade: '0.00',
    worstTrade: '0.00',
    finalBalance: '0.00',
    ...stats
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Estatísticas Gerais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Desempenho</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Operações:</span>
              <span className="font-medium">{safeStats.tradeCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de Acerto:</span>
              <span className="font-medium">{safeStats.hitRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ganhos:</span>
              <span className="font-medium text-green-600">R$ {safeStats.gains}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Perdas:</span>
              <span className="font-medium text-red-600">R$ {safeStats.losses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Empates:</span>
              <span className="font-medium">{safeStats.ties}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Resultados</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Operações Ganhas:</span>
              <span className="font-medium text-green-600">{safeStats.wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Operações Perdidas:</span>
              <span className="font-medium text-red-600">{safeStats.lossCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Operações Empatadas:</span>
              <span className="font-medium">{safeStats.tieCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retorno Médio:</span>
              <span className={`font-medium ${parseFloat(safeStats.avgReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {safeStats.avgReturn}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Valores</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Apostado:</span>
              <span className="font-medium">R$ {safeStats.totalBet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Melhor Operação:</span>
              <span className="font-medium text-green-600">R$ {safeStats.bestTrade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pior Operação:</span>
              <span className="font-medium text-red-600">R$ {safeStats.worstTrade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Saldo Final:</span>
              <span className={`font-medium ${parseFloat(safeStats.finalBalance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {safeStats.finalBalance}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Capital</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Capital Inicial:</span>
              <span className="font-medium">R$ {parseFloat(initialBankroll).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lucro/Prejuízo:</span>
              <span className={`font-medium ${parseFloat(runningTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {runningTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Capital Atual:</span>
              <span className={`font-medium ${currentBankroll >= initialBankroll ? 'text-green-600' : 'text-red-600'}`}>
                R$ {parseFloat(currentBankroll).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Variação:</span>
              <span className={`font-medium ${currentBankroll >= initialBankroll ? 'text-green-600' : 'text-red-600'}`}>
                {initialBankroll > 0 
                  ? `${((currentBankroll / initialBankroll - 1) * 100).toFixed(2)}%` 
                  : '0.00%'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Progresso da Meta Diária</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Meta:</span>
              <span className="font-medium">
                {goalType === 'R$' ? `R$ ${dailyGoal.toFixed(2)}` : `${dailyGoal}%`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Progresso Atual:</span>
              <span className={`font-medium ${parseFloat(runningTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {runningTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">% da Meta:</span>
              <span className={`font-medium ${parseFloat(runningTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(() => {
                  const goalValue = goalType === 'R$' ? dailyGoal : (currentBankroll * dailyGoal / 100); // Usar currentBankroll para meta %
                  const progressPercent = goalValue > 0 ? (parseFloat(runningTotal) / goalValue * 100) : 0;
                  return `${progressPercent.toFixed(2)}%`;
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
