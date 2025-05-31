import React from 'react';

const ReportsSection = ({ stats, selectedDate, setSelectedDate, dailyReport, exportData, importData }) => {
  // Garante que dailyReport e suas propriedades são válidas antes de usar .toFixed()
  const currentDailyReport = dailyReport || {}; // Garante que dailyReport não é null/undefined

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Relatório Diário</h2>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <label htmlFor="reportDate" className="block text-gray-700 text-sm font-bold mb-2">
            Selecionar Data:
          </label>
          <input
            type="date"
            id="reportDate"
            name="reportDate"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resumo do Dia */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Resumo do Dia ({selectedDate})</h3>
          <p>Total de Operações: <span className="font-bold">{currentDailyReport.tradeCount || 0}</span></p>
          <p>Total Apostado: <span className="font-bold">R$ {(currentDailyReport.totalBet || 0).toFixed(2)}</span></p>
          <p>Lucro/Prejuízo Diário: <span className={`font-bold ${(currentDailyReport.dailyProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {(currentDailyReport.dailyProfitLoss || 0).toFixed(2)}</span></p>
        </div>

        {/* Progresso da Meta */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Progresso da Meta</h3>
          <p>Meta Diária: <span className="font-bold">{currentDailyReport.goalType === '%' ? `${(currentDailyReport.dailyGoal || 0)}%` : `R$ ${(currentDailyReport.dailyGoal || 0).toFixed(2)}`}</span></p>
          <p>Progresso da Meta: <span className="font-bold">{(currentDailyReport.goalProgress || 0).toFixed(2)}%</span></p>
          {(currentDailyReport.metDailyGoal) ? (
            <p className="text-green-600 font-bold">Meta Diária Atingida! (Excedeu em R$ {(currentDailyReport.exceeded || 0).toFixed(2)})</p>
          ) : (
            <p className="text-red-600 font-bold">Faltam R$ {(currentDailyReport.shortfall || 0).toFixed(2)} para a meta.</p>
          )}
        </div>

        {/* Relatório Geral */}
        <div className="bg-gray-50 p-4 rounded-md col-span-full">
          <h3 className="font-semibold text-lg mb-2">Relatório Geral</h3>
          <p>Banca Atual: <span className="font-bold">R$ {(currentDailyReport.finalBalance || 0).toFixed(2)}</span></p>
          <p>Lucro/Prejuízo Acumulado: <span className={`font-bold ${(currentDailyReport.runningTotal || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {(currentDailyReport.runningTotal || 0).toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
