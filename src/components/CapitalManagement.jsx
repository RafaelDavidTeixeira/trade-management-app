import React from 'react';

const CapitalManagement = ({
  stopLoss,
  setStopLoss,
  stopWin,
  setStopWin,
  stopLossType,
  setStopLossType,
  stopWinType,
  setStopWinType,
  initialBankroll, // Propriedade não utilizada diretamente neste componente para cálculos de %
  currentBankroll, // Recebe a banca atual como prop para cálculos
  entryPercentage, // Nova prop para a porcentagem de entrada
  setEntryPercentage, // Nova prop para atualizar a porcentagem de entrada
}) => {
  // Garante que currentBankroll é um número para evitar erros de toFixed
  const safeCurrentBankroll = typeof currentBankroll === 'number' ? currentBankroll : parseFloat(currentBankroll || 0);

  // Calcula os valores efetivos de Stop Loss e Stop Win com base na banca atual
  const effectiveStopLossValue = stopLossType === '%'
    ? (safeCurrentBankroll * (stopLoss / 100))
    : parseFloat(stopLoss);

  const effectiveStopWinValue = stopWinType === '%'
    ? (safeCurrentBankroll * (stopWin / 100))
    : parseFloat(stopWin);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Regras de Capital</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">Stop Loss (Limite de Perda)</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="number"
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            placeholder="Valor do Stop Loss"
          />
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stopLossType}
            onChange={(e) => setStopLossType(e.target.value)}
          >
            <option value="R$">R$</option>
            <option value="%">%</option>
          </select>
        </div>
        <p className="text-gray-600 text-sm">
          Se o Stop Loss for em porcentagem, ele será calculado sobre a **Banca Atual** (R$ {safeCurrentBankroll.toFixed(2)}).
          Valor efetivo de Stop Loss: <span className="font-bold text-red-600">R$ {effectiveStopLossValue.toFixed(2)}</span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">Stop Win (Meta de Lucro)</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="number"
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stopWin}
            onChange={(e) => setStopWin(parseFloat(e.target.value) || 0)}
            placeholder="Valor do Stop Win"
          />
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stopWinType}
            onChange={(e) => setStopWinType(e.target.value)}
          >
            <option value="R$">R$</option>
            <option value="%">%</option>
          </select>
        </div>
        <p className="text-gray-600 text-sm">
          Se o Stop Win for em porcentagem, ele será calculado sobre a **Banca Atual** (R$ {safeCurrentBankroll.toFixed(2)}).
          Valor efetivo de Stop Win: <span className="font-bold text-green-600">R$ {effectiveStopWinValue.toFixed(2)}</span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">Porcentagem de Entrada Sugerida</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="number"
            step="0.1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={entryPercentage}
            onChange={(e) => setEntryPercentage(parseFloat(e.target.value) || 0)}
            placeholder="Ex: 1.0"
          />
          <span className="text-gray-700">%</span>
        </div>
        <p className="text-gray-600 text-sm">
          Defina a porcentagem da sua Banca Atual (R$ {safeCurrentBankroll.toFixed(2)}) que você deseja usar como valor de entrada sugerido para novas operações.
        </p>
      </div>
    </div>
  );
};

export default CapitalManagement;
