import React, { useState } from 'react';

const CapitalManagement = ({ 
  stopLoss, 
  setStopLoss, 
  stopWin, 
  setStopWin,
  stopLossType,
  setStopLossType,
  stopWinType,
  setStopWinType,
  initialBankroll
}) => {
  // Função para calcular o valor equivalente em R$ quando o tipo é %
  const getPercentValue = (value, type, bankroll) => {
    if (type === '%') {
      return ((bankroll || 0) * (value / 100)).toFixed(2);
    }
    return value;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Regras de Capital</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Stop Loss
              </label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs ${stopLossType === 'R$' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => setStopLossType('R$')}
                >
                  R$
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs ${stopLossType === '%' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => setStopLossType('%')}
                >
                  %
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="ml-2 text-sm font-medium">{stopLossType}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Valor máximo de perda diária permitida.
              {stopLossType === '%' && initialBankroll > 0 && (
                <span className="block text-xs text-gray-500 mt-1">
                  Equivalente a R$ {getPercentValue(stopLoss, stopLossType, initialBankroll)}
                </span>
              )}
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Stop Win
              </label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs ${stopWinType === 'R$' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => setStopWinType('R$')}
                >
                  R$
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs ${stopWinType === '%' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => setStopWinType('%')}
                >
                  %
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={stopWin}
                onChange={(e) => setStopWin(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="ml-2 text-sm font-medium">{stopWinType}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Valor de lucro diário para encerrar as operações.
              {stopWinType === '%' && initialBankroll > 0 && (
                <span className="block text-xs text-gray-500 mt-1">
                  Equivalente a R$ {getPercentValue(stopWin, stopWinType, initialBankroll)}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
            <h4 className="font-medium mb-1">Como funcionam as regras de capital?</h4>
            <p className="text-sm">
              O <strong>Stop Loss</strong> é um mecanismo de proteção que alerta quando suas perdas atingem o valor definido, ajudando a limitar prejuízos.
            </p>
            <p className="text-sm mt-2">
              O <strong>Stop Win</strong> é uma meta de lucro que, quando atingida, sugere encerrar as operações do dia para proteger os ganhos obtidos.
            </p>
            {(stopLossType === '%' || stopWinType === '%') && (
              <p className="text-sm mt-2">
                <strong>Valores em porcentagem</strong> são calculados com base no seu capital inicial de R$ {initialBankroll.toFixed(2)}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalManagement;
