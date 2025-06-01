import React from 'react';

const ReportsSection = ({
  trades,
  stats,
  selectedDate,
  setSelectedDate,
  dailyReport,
  goalStatus,
  exportData,
  importData
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Relatório Diário</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          {dailyReport.tradeCount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total de Operações</div>
                <div className="text-xl font-bold">{dailyReport.tradeCount}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Total Apostado</div>
                <div className="text-xl font-bold">R$ {dailyReport.totalBet}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Lucro/Prejuízo do Dia</div>
                <div className={`text-xl font-bold ${parseFloat(dailyReport.dailyProfitLoss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {dailyReport.dailyProfitLoss}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Meta Diária</div>
                <div className={`text-xl font-bold ${dailyReport.metDailyGoal ? 'text-green-600' : 'text-red-600'}`}>
                  {dailyReport.metDailyGoal ? 'Atingida' : 'Não Atingida'}
                </div>
              </div>
              
              {dailyReport.metDailyGoal ? (
                <div>
                  <div className="text-sm text-gray-600">Excedente</div>
                  <div className="text-xl font-bold text-green-600">
                    R$ {dailyReport.exceeded}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-600">Faltante</div>
                  <div className="text-xl font-bold text-red-600">
                    R$ {dailyReport.shortfall}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">Nenhuma operação registrada para esta data.</p>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Relatório Geral</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total de Operações</div>
              <div className="text-xl font-bold">{stats.tradeCount}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
              <div className="text-xl font-bold">{stats.hitRate}%</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Total Apostado</div>
              <div className="text-xl font-bold">R$ {stats.totalBet}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Saldo Final</div>
              <div className={`text-xl font-bold ${parseFloat(stats.finalBalance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {stats.finalBalance}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Retorno Médio por Operação</div>
              <div className={`text-xl font-bold ${parseFloat(stats.avgReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {stats.avgReturn}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Lucro/Prejuízo Acumulado</div>
              <div className={`text-xl font-bold ${parseFloat(stats.finalBalance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {stats.finalBalance} {/* Corrigido para usar stats.finalBalance */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Backup e Restauração</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <button
                onClick={exportData}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Exportar Dados
              </button>
              <p className="text-sm text-gray-600 mt-1">
                Salve seus dados em um arquivo JSON para backup.
              </p>
            </div>
            
            <div>
              <label className="block w-full">
                <span className="sr-only">Importar Dados</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-opacity-90"
                />
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Restaure seus dados a partir de um arquivo JSON.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
