import React, { useState } from 'react';

const BankrollSection = ({ initialBankroll, setInitialBankroll, currentBankroll, runningTotal }) => {
  // Estado local para controlar o valor editável
  const [editingInitialBankroll, setEditingInitialBankroll] = useState(false);
  const [tempInitialBankroll, setTempInitialBankroll] = useState(initialBankroll.toFixed(2));
  
  // Calcular a variação percentual
  const percentChange = initialBankroll > 0 
    ? ((currentBankroll / initialBankroll - 1) * 100).toFixed(2)
    : '0.00';
  
  // Determinar a classe de cor com base no resultado
  const resultColorClass = parseFloat(runningTotal) >= 0 ? 'text-green-600' : 'text-red-600';
  
  // Função para salvar o valor editado
  const handleSaveInitialBankroll = () => {
    const newValue = parseFloat(tempInitialBankroll);
    if (!isNaN(newValue) && newValue >= 0) {
      setInitialBankroll(newValue);
    } else {
      setTempInitialBankroll(initialBankroll.toFixed(2));
    }
    setEditingInitialBankroll(false);
  };
  
  // Função para lidar com mudanças no input
  const handleInputChange = (e) => {
    setTempInitialBankroll(e.target.value);
  };
  
  // Função para lidar com tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveInitialBankroll();
    } else if (e.key === 'Escape') {
      setTempInitialBankroll(initialBankroll.toFixed(2));
      setEditingInitialBankroll(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestão de Capital</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm text-gray-600">Capital Inicial</div>
            {editingInitialBankroll ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={tempInitialBankroll}
                  onChange={handleInputChange}
                  onBlur={handleSaveInitialBankroll}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-xl font-bold"
                  step="0.01"
                  min="0"
                  autoFocus
                />
                <span className="ml-2 text-gray-600">R$</span>
              </div>
            ) : (
              <div 
                className="text-2xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingInitialBankroll(true)}
                title="Clique para editar"
              >
                R$ {parseFloat(initialBankroll).toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm text-gray-600">Capital Atual</div>
            <div className={`text-2xl font-bold ${currentBankroll >= initialBankroll ? 'text-green-600' : 'text-red-600'}`}>
              R$ {currentBankroll.toFixed(2)}
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm text-gray-600">Lucro/Prejuízo</div>
            <div className={`text-2xl font-bold ${resultColorClass}`}>
              R$ {runningTotal}
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm text-gray-600">Variação</div>
            <div className={`text-2xl font-bold ${parseFloat(percentChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentChange}%
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Evolução do Capital</div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${parseFloat(runningTotal) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ 
                width: `${Math.min(Math.abs(parseFloat(percentChange)), 100)}%`,
                marginLeft: parseFloat(runningTotal) >= 0 ? '0' : 'auto',
                marginRight: parseFloat(runningTotal) >= 0 ? 'auto' : '0'
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>-100%</span>
            <span>0%</span>
            <span>+100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankrollSection;
