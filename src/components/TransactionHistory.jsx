import React, { useState } from 'react';

const TransactionHistory = ({ transactions, onDeleteTransaction }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'deposit', 'withdrawal'
  
  // Filtrar transações com base no filtro selecionado
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });
  
  // Ordenar transações por data (mais recente primeiro)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.timestamp - a.timestamp);
  
  // Calcular totais
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netBalance = totalDeposits - totalWithdrawals;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Histórico de Depósitos e Retiradas</h2>
      
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filter === 'deposit' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFilter('deposit')}
          >
            Depósitos
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filter === 'withdrawal' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFilter('withdrawal')}
          >
            Retiradas
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Total de transações: {filteredTransactions.length}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total de Depósitos</div>
          <div className="text-xl font-bold text-green-600">R$ {totalDeposits.toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total de Retiradas</div>
          <div className="text-xl font-bold text-red-600">R$ {totalWithdrawals.toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Saldo Líquido</div>
          <div className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {netBalance.toFixed(2)}
          </div>
        </div>
      </div>
      
      {sortedTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTransactions.map((transaction, index) => (
                <tr key={transaction.timestamp} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'deposit' ? 'Depósito' : 'Retirada'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {transaction.description || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onDeleteTransaction(transaction.timestamp)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir transação"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Nenhuma transação registrada.' 
              : filter === 'deposit' 
                ? 'Nenhum depósito registrado.' 
                : 'Nenhuma retirada registrada.'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Use os botões acima para registrar depósitos e retiradas.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
