import React from 'react';

const TradeForm = ({ 
  formData, 
  handleInputChange, 
  addTrade, 
  editTrade, 
  assets, 
  handleScreenshotUpload, 
  isLoadingOcr 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editTrade ? 'Editar Operação' : 'Nova Operação'}
      </h2>
      
      <form onSubmit={addTrade} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
              step="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ativo</label>
            <select
              name="asset"
              value={formData.asset}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              {Object.keys(assets).map(asset => (
                <option key={asset} value={asset}>
                  {asset} ({(assets[asset] * 100).toFixed(0)}%)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Crypto">Crypto</option>
              <option value="Forex">Forex</option>
              <option value="Stocks">Ações</option>
              <option value="Commodities">Commodities</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Apostado (R$)</label>
            <input
              type="number"
              name="betAmount"
              value={formData.betAmount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
            <select
              name="outcome"
              value={formData.outcome}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Positive">Positivo</option>
              <option value="Negative">Negativo</option>
              <option value="Tie">Empate</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lucro/Prejuízo (R$)</label>
            <input
              type="number"
              name="profitLoss"
              value={formData.profitLoss}
              onChange={handleInputChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              readOnly
            />
          </div>
          
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {editTrade ? 'Atualizar Operação' : 'Adicionar Operação'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
