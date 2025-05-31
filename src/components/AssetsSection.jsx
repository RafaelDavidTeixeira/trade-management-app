import React, { useState, useEffect } from 'react';

const AssetsSection = ({ assets, setAssets }) => {
  const [newAsset, setNewAsset] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [editingAsset, setEditingAsset] = useState(null);
  const [originalAssetName, setOriginalAssetName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Limpar mensagem de erro após 5 segundos
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Adicionar novo ativo
  const addAsset = (e) => {
    e.preventDefault();
    
    // Validar entrada
    if (!newAsset.trim()) {
      setErrorMessage('Nome do ativo não pode estar vazio.');
      return;
    }
    
    const percentageValue = parseFloat(newPercentage) / 100;
    if (isNaN(percentageValue) || percentageValue <= 0 || percentageValue > 1) {
      setErrorMessage('Percentual deve ser um número entre 1 e 100.');
      return;
    }
    
    // Verificar se o ativo já existe
    if (assets[newAsset] !== undefined && !editingAsset) {
      setErrorMessage('Este ativo já está cadastrado.');
      return;
    }
    
    // Atualizar estado
    const updatedAssets = { ...assets };
    
    if (editingAsset) {
      // Se estiver editando, remover o ativo original e adicionar o atualizado
      if (originalAssetName !== newAsset) {
        delete updatedAssets[originalAssetName];
      }
      updatedAssets[newAsset] = percentageValue;
      setEditingAsset(null);
      setOriginalAssetName('');
    } else {
      // Adicionar novo ativo
      updatedAssets[newAsset] = percentageValue;
    }
    
    setAssets(updatedAssets);
    setNewAsset('');
    setNewPercentage('');
  };

  // Iniciar edição de um ativo
  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setOriginalAssetName(asset);
    setNewAsset(asset);
    setNewPercentage((assets[asset] * 100).toFixed(0));
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingAsset(null);
    setOriginalAssetName('');
    setNewAsset('');
    setNewPercentage('');
  };

  // Excluir ativo
  const handleDeleteAsset = (asset) => {
    if (window.confirm(`Tem certeza que deseja excluir o ativo ${asset}?`)) {
      const updatedAssets = { ...assets };
      delete updatedAssets[asset];
      setAssets(updatedAssets);
      
      // Se estiver editando o ativo que foi excluído, cancelar edição
      if (editingAsset === asset) {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Gestão de Ativos</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="mb-6">
        <form onSubmit={addAsset} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            {editingAsset ? 'Editar Ativo' : 'Adicionar Novo Ativo'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Ativo
              </label>
              <input
                type="text"
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                placeholder="Ex: BTCUSDT"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentual de Retorno (%)
              </label>
              <input
                type="number"
                value={newPercentage}
                onChange={(e) => setNewPercentage(e.target.value)}
                placeholder="Ex: 85"
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Valor entre 1 e 100. Ex: 85 significa 85% de retorno sobre o valor apostado.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            {editingAsset && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {editingAsset ? 'Atualizar Ativo' : 'Adicionar Ativo'}
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Ativos Cadastrados</h3>
        
        {Object.keys(assets).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(assets).map(([asset, percentage], index) => (
                  <tr key={asset} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{asset}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{(percentage * 100).toFixed(0)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum ativo cadastrado.</p>
            <p className="text-sm text-gray-400 mt-1">
              Adicione ativos usando o formulário acima.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsSection;
