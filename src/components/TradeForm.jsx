// components/TradeForm.jsx
import React from 'react';

const TradeForm = ({ formData, handleInputChange, addTrade, editTrade, assets, handleScreenshotUpload, isLoadingOcr }) => {
  const isCopyType = formData.type === 'Copy';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">{editTrade ? 'Editar Operação' : 'Nova Operação'}</h2>
      <form onSubmit={addTrade}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Data</label>
            <input
              type="date"
              id="date"
              name="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">Hora</label>
            <input
              type="time"
              id="time"
              name="time"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="asset" className="block text-gray-700 text-sm font-bold mb-2">Ativo</label>
            <select
              id="asset"
              name="asset"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.asset}
              onChange={handleInputChange}
              required
            >
              {Object.keys(assets).map(asset => (
                <option key={asset} value={asset}>{asset}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Tipo</label>
            <select
              id="type"
              name="type"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="Crypto">Crypto</option>
              <option value="Forex">Forex</option>
              <option value="Stocks">Stocks</option>
              <option value="Copy">Copy</option> {/* Nova opção */}
            </select>
          </div>
          <div>
            <label htmlFor="betAmount" className="block text-gray-700 text-sm font-bold mb-2">Valor Apostado</label>
            <input
              type="number"
              step="0.01"
              id="betAmount"
              name="betAmount"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.betAmount}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label htmlFor="outcome" className="block text-gray-700 text-sm font-bold mb-2">Resultado</label>
            <select
              id="outcome"
              name="outcome"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.outcome}
              onChange={handleInputChange}
              required
            >
              <option value="Positive">Positivo</option>
              <option value="Negative">Negativo</option>
              <option value="Tie">Empate</option>
            </select>
          </div>
          <div>
            <label htmlFor="profitLoss" className="block text-gray-700 text-sm font-bold mb-2">Lucro/Prejuízo</label>
            <input
              type="number"
              step="0.01"
              id="profitLoss"
              name="profitLoss"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.profitLoss}
              onChange={handleInputChange}
              placeholder="0.00"
              required
              // REMOVIDO: disabled={!isCopyType}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editTrade ? 'Atualizar Operação' : 'Adicionar Operação'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-primary">Importar de Captura de Tela</h3>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="screenshotUpload">
          Carregar Imagem:
        </label>
        <input
          type="file"
          id="screenshotUpload"
          accept="image/*"
          onChange={handleScreenshotUpload}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {isLoadingOcr && <p className="text-blue-500 mt-2">Processando imagem...</p>}
      </div>
    </div>
  );
};

export default TradeForm;