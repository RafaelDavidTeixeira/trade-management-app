import React from 'react';

const TransactionHistory = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Histórico de Depósitos e Retiradas</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhuma transação registrada ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Data</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Tipo</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Valor</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Descrição</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.timestamp} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{transaction.date}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700 capitalize">{transaction.type === 'deposit' ? 'Depósito' : 'Retirada'}</td>
                  <td className={`py-2 px-4 border-b text-sm ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {parseFloat(transaction.amount).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{transaction.description || '-'}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button
                      onClick={() => onEditTransaction(transaction)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(transaction.timestamp)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
