import React, { useState, useEffect } from 'react';

const BankrollManagement = ({
  initialBankroll,
  setInitialBankroll,
  currentBankroll,
  runningTotal,
  transactions, // Embora não utilizado diretamente no formulário, é passado para o App
  addTransaction,
  editTransaction, // Prop que indica a transação a ser editada
}) => {
  // Estados locais para o formulário de transação
  const [transactionType, setTransactionType] = useState('deposit');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');

  // useEffect para preencher o formulário quando 'editTransaction' muda (modo de edição)
  useEffect(() => {
    if (editTransaction) {
      // Se há uma transação para editar, preenche os campos do formulário
      setTransactionType(editTransaction.type);
      setTransactionAmount(editTransaction.amount.toString());
      setTransactionDescription(editTransaction.description || '');
    } else {
      // Se não há transação em edição, limpa o formulário
      setTransactionType('deposit');
      setTransactionAmount('');
      setTransactionDescription('');
    }
  }, [editTransaction]); // Depende de editTransaction

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (transactionAmount === '' || parseFloat(transactionAmount) <= 0) {
      // Usando alert() temporariamente para feedback, mas idealmente seria um modal
      alert('Por favor, insira um valor válido para a transação.');
      return;
    }
    // Chama a função addTransaction do componente pai (App.jsx)
    addTransaction({
      type: transactionType,
      amount: parseFloat(transactionAmount),
      description: transactionDescription,
      // A data já é adicionada no App.jsx ao chamar addTransaction
    });
    // Limpa o formulário após adicionar/atualizar
    setTransactionAmount('');
    setTransactionDescription('');
    setTransactionType('deposit'); // Reseta para o padrão
  };

  // Garante que os valores são números antes de formatar para exibição
  const formattedInitialBankroll = typeof initialBankroll === 'number' ? initialBankroll.toFixed(2) : parseFloat(initialBankroll || 0).toFixed(2);
  const formattedCurrentBankroll = typeof currentBankroll === 'number' ? currentBankroll.toFixed(2) : parseFloat(currentBankroll || 0).toFixed(2);
  const formattedRunningTotal = typeof runningTotal === 'number' ? runningTotal.toFixed(2) : parseFloat(runningTotal || 0).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">Gestão de Banca</h2>

      <div className="mb-4">
        <p className="text-gray-700">Banca Inicial: <span className="font-bold">R$ {formattedInitialBankroll}</span></p>
        <p className="text-gray-700">Lucro/Prejuízo das Operações: <span className={`font-bold ${runningTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {formattedRunningTotal}</span></p>
        <p className="text-gray-700 text-lg">Banca Atual: <span className="font-bold text-green-600">R$ {formattedCurrentBankroll}</span></p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="initialBankrollInput">
          Ajustar Banca Inicial:
        </label>
        <input
          type="number"
          step="0.01"
          id="initialBankrollInput"
          name="initialBankrollInput"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={initialBankroll}
          onChange={(e) => setInitialBankroll(parseFloat(e.target.value) || 0)}
        />
      </div>

      <h3 className="text-lg font-semibold mb-3 text-primary">Transações de Banca</h3>
      <form onSubmit={handleAddTransaction} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="transactionType" className="block text-gray-700 text-sm font-bold mb-2">Tipo</label>
            <select
              id="transactionType"
              name="type"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="deposit">Depósito</option>
              <option value="withdrawal">Retirada</option>
            </select>
          </div>
          <div>
            <label htmlFor="transactionAmount" className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
            <input
              type="number"
              step="0.01"
              id="transactionAmount"
              name="amount"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="transactionDescription" className="block text-gray-700 text-sm font-bold mb-2">Descrição (Opcional)</label>
            <input
              type="text"
              id="transactionDescription"
              name="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={transactionDescription}
              onChange={(e) => setTransactionDescription(e.target.value)}
              placeholder="Ex: Bônus de boas-vindas"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editTransaction ? 'Atualizar Transação' : 'Adicionar Transação'}
        </button>
      </form>
    </div>
  );
};

export default BankrollManagement;
