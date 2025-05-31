import React from 'react';

const StatsSection = ({ stats, initialBankroll, currentBankroll, runningTotal, dailyGoal, goalType, dailyReport, entryPercentage }) => {
  // Garante que os valores são números antes de formatar para exibição
  const formattedInitialBankroll = typeof initialBankroll === 'number' ? initialBankroll.toFixed(2) : parseFloat(initialBankroll || 0).toFixed(2);
  const formattedCurrentBankroll = typeof currentBankroll === 'number' ? currentBankroll.toFixed(2) : parseFloat(currentBankroll || 0).toFixed(2);
  const formattedRunningTotal = typeof runningTotal === 'number' ? runningTotal.toFixed(2) : parseFloat(runningTotal || 0).toFixed(2);

  // Calcula o valor de entrada sugerido com base na banca atual e na porcentagem definida
  const suggestedEntryAmount = (currentBankroll * (entryPercentage / 100)).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Estatísticas Gerais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resumo da Banca */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Resumo da Banca</h3>
          <p>Banca Inicial: <span className="font-bold">R$ {formattedInitialBankroll}</span></p>
          <p>Lucro/Prejuízo das Operações: <span className={`font-bold ${runningTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {formattedRunningTotal}</span></p>
          <p className="text-xl">Banca Atual: <span className="font-bold text-green-600">R$ {formattedCurrentBankroll}</span></p>
        </div>

        {/* Desempenho Geral */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Desempenho Geral</h3>
          <p>Total de Operações: <span className="font-bold">{stats.tradeCount}</span></p>
          <p>Vitórias: <span className="font-bold text-green-600">{stats.wins}</span></p>
          <p>Derrotas: <span className="font-bold text-red-600">{stats.lossCount}</span></p>
          <p>Empates: <span className="font-bold text-gray-600">{stats.tieCount}</span></p>
          <p>Taxa de Vitória: <span className="font-bold">{stats.winRate.toFixed(2)}%</span></p>
          <p>Retorno Médio por Operação: <span className={`font-bold ${stats.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {stats.avgReturn.toFixed(2)}</span></p>
        </div>

        {/* Resultados Financeiros */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Resultados Financeiros</h3>
          <p>Total Apostado: <span className="font-bold">R$ {stats.totalBet.toFixed(2)}</span></p>
          <p>Ganhos Brutos: <span className="font-bold text-green-600">R$ {stats.gains.toFixed(2)}</span></p>
          <p>Perdas Brutas: <span className="font-bold text-red-600">R$ {stats.losses.toFixed(2)}</span></p>
          <p className="text-xl">Saldo Final: <span className={`font-bold ${stats.finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {stats.finalBalance.toFixed(2)}</span></p>
        </div>

        {/* Progresso da Meta Diária */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Progresso da Meta Diária</h3>
          <p>Lucro/Prejuízo Diário: <span className={`font-bold ${(dailyReport.dailyProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {(dailyReport.dailyProfitLoss || 0).toFixed(2)}</span></p>
          <p>Meta Diária: <span className="font-bold">{goalType === '%' ? `${dailyGoal}%` : `R$ ${dailyGoal.toFixed(2)}`}</span></p>
          <p>Progresso da Meta: <span className="font-bold">{(dailyReport.goalProgress || 0).toFixed(2)}%</span></p>
          {(dailyReport.metDailyGoal) ? (
            <p className="text-green-600 font-bold">Meta Diária Atingida! (Excedeu em R$ {(dailyReport.exceeded || 0).toFixed(2)})</p>
          ) : (
            <p className="text-red-600 font-bold">Faltam R$ {(dailyReport.shortfall || 0).toFixed(2)} para a meta.</p>
          )}
        </div>

        {/* Novo quadro para Valor de Entrada Sugerido */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Valor de Entrada Sugerido</h3>
          <p>Baseado em {entryPercentage}% da Banca Atual:</p>
          <p className="text-xl font-bold text-purple-600">R$ {suggestedEntryAmount}</p>
        </div>

        {/* Melhor e Pior Operação */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Melhor e Pior Operação</h3>
          {stats.bestTrade ? (
            <p>Melhor Operação: <span className="font-bold text-green-600">{stats.bestTrade.asset} (R$ {stats.bestTrade.profitLoss.toFixed(2)})</span></p>
          ) : (
            <p>N/A</p>
          )}
          {stats.worstTrade ? (
            <p>Pior Operação: <span className="font-bold text-red-600">{stats.worstTrade.asset} (R$ {stats.worstTrade.profitLoss.toFixed(2)})</span></p>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
