import React from 'react';

const TradeTable = ({ trades, deleteTrade, editTrade, duplicateTrade, selectedDate, setSelectedDate, clearAllTrades }) => {
  const filteredTrades = trades.filter(trade => trade.date === selectedDate);

  const totalProfitLoss = filteredTrades.reduce((sum, trade) => sum + parseFloat(trade.profitLoss), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Histórico de Operações</h2>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <label htmlFor="tradeDate" className="block text-gray-700 text-sm font-bold mb-2">
            Selecionar Data:
          </label>
          <input
            type="date"
            id="tradeDate"
            name="tradeDate" // Adicionado name para consistência
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="text-lg font-bold">
          Lucro/Prejuízo do Dia: <span className={totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>R$ {totalProfitLoss.toFixed(2)}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Data</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Hora</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Ativo</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Tipo</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Valor Apostado</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Lucro/Prejuízo</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">Nenhuma operação para esta data.</td>
              </tr>
            ) : (
              filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{trade.date}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{trade.time}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{trade.asset}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{trade.type}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">R$ {parseFloat(trade.betAmount).toFixed(2)}</td>
                  <td className={`py-2 px-4 border-b text-sm ${parseFloat(trade.profitLoss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {parseFloat(trade.profitLoss).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button
                      onClick={() => editTrade(trade)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => duplicateTrade(trade)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded-md text-xs mr-2"
                    >
                      Duplicar
                    </button>
                    <button
                      onClick={() => deleteTrade(trade.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={clearAllTrades}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Limpar Todas as Operações
        </button>
      </div>
    </div>
  );
};

export default TradeTable;
