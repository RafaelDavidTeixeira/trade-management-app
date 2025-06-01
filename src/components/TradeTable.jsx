import React, { useState } from 'react';

const TradeTable = ({ 
  trades, 
  deleteTrade, 
  editTradeHandler, 
  duplicateTrade, 
  clearAllTrades,
  selectedDate,
  setSelectedDate
}) => {
  // Filtrar trades pela data selecionada
  const filteredTrades = trades.filter(trade => trade.date === selectedDate);
  
  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Calcular total de páginas
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  
  // Obter trades da página atual
  const getCurrentPageTrades = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTrades.slice(startIndex, endIndex);
  };
  
  // Navegação entre páginas
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Histórico de Operações</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={clearAllTrades}
            className="px-3 py-1 bg-danger text-white rounded-md hover:bg-opacity-90 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
          >
            Limpar Tudo
          </button>
        </div>
      </div>
      
      {filteredTrades.length > 0 ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor (R$)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro/Prejuízo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageTrades().map((trade, index) => (
                  <tr key={trade.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap">{trade.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{trade.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{trade.asset}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{trade.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {trade.betAmount.toFixed(2)}</td>
                    <td className={`px-4 py-3 whitespace-nowrap font-medium ${
                      parseFloat(trade.profitLoss) > 0 
                        ? 'text-green-600' 
                        : parseFloat(trade.profitLoss) < 0 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                    }`}>
                      R$ {parseFloat(trade.profitLoss).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editTradeHandler(trade)}
                          className="text-primary hover:text-primary-dark p-1 rounded hover:bg-gray-100"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => duplicateTrade(trade)}
                          className="text-secondary hover:text-secondary-dark p-1 rounded hover:bg-gray-100"
                          title="Duplicar"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteTrade(trade.id)}
                          className="text-danger hover:text-danger-dark p-1 rounded hover:bg-gray-100"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredTrades.length)}
                    </span> de <span className="font-medium">{filteredTrades.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      &laquo; Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-primary text-white border-primary'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Próximo &raquo;
                    </button>
                  </nav>
                </div>
              </div>
              <div className="flex sm:hidden justify-between w-full">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Nenhuma operação registrada para esta data.</p>
          <p className="text-sm text-gray-400 mt-2">Adicione uma nova operação usando o formulário acima.</p>
        </div>
      )}
    </div>
  );
};

export default TradeTable;
