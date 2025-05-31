import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVImporter = ({ onImport }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Formato esperado do CSV
  const expectedFormat = [
    'data', 'hora', 'ativo', 'tipo', 'valor', 'resultado', 'lucro_prejuizo'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
    setPreview([]);
    setShowPreview(false);
  };

  const validateAndParseCSV = () => {
    if (!file) {
      setError('Por favor, selecione um arquivo CSV para importar.');
      return;
    }

    setIsLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsLoading(false);
        
        // Verificar se há erros de parsing
        if (results.errors.length > 0) {
          setError(`Erro ao processar o arquivo: ${results.errors[0].message}`);
          return;
        }
        
        // Verificar se há dados
        if (results.data.length === 0) {
          setError('O arquivo não contém dados.');
          return;
        }
        
        // Verificar cabeçalhos
        const headers = Object.keys(results.data[0]);
        const missingHeaders = expectedFormat.filter(header => 
          !headers.some(h => h.toLowerCase() === header.toLowerCase())
        );
        
        if (missingHeaders.length > 0) {
          setError(`Formato de arquivo inválido. Colunas ausentes: ${missingHeaders.join(', ')}`);
          return;
        }
        
        // Mostrar preview dos dados
        setPreview(results.data.slice(0, 5));
        setShowPreview(true);
      },
      error: (error) => {
        setIsLoading(false);
        setError(`Erro ao processar o arquivo: ${error.message}`);
      }
    });
  };

  const processImport = () => {
    if (!file) return;
    
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsLoading(false);
        
        // Mapear dados do CSV para o formato esperado pelo aplicativo
        const mappedData = results.data.map(row => {
          // Normalizar nomes de colunas (case insensitive)
          const getField = (fieldName) => {
            const key = Object.keys(row).find(k => 
              k.toLowerCase() === fieldName.toLowerCase()
            );
            return key ? row[key] : '';
          };
          
          return {
            date: getField('data'),
            time: getField('hora'),
            asset: getField('ativo'),
            type: getField('tipo'),
            amount: parseFloat(getField('valor')) || 0,
            result: getField('resultado'),
            profitLoss: parseFloat(getField('lucro_prejuizo')) || 0
          };
        });
        
        // Enviar dados processados para o componente pai
        onImport(mappedData);
        
        // Limpar estado
        setFile(null);
        setPreview([]);
        setShowPreview(false);
      },
      error: (error) => {
        setIsLoading(false);
        setError(`Erro ao processar o arquivo: ${error.message}`);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Importar Operações via CSV</h2>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o arquivo CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark"
          />
          <p className="mt-1 text-sm text-gray-500">
            O arquivo deve estar no formato CSV com as colunas: data, hora, ativo, tipo, valor, resultado, lucro_prejuizo
          </p>
        </div>
        
        {file && (
          <div className="flex space-x-2">
            <button
              onClick={validateAndParseCSV}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Processando...' : 'Validar CSV'}
            </button>
            
            {showPreview && (
              <button
                onClick={processImport}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? 'Importando...' : 'Importar Operações'}
              </button>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
      
      {showPreview && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Prévia dos Dados (5 primeiras linhas)</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map((header, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-blue-800 mb-2">Formato do CSV</h3>
        <p className="text-sm text-blue-700 mb-2">
          O arquivo CSV deve conter as seguintes colunas:
        </p>
        <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
          <li><strong>data</strong>: Data da operação no formato YYYY-MM-DD (ex: 2025-05-22)</li>
          <li><strong>hora</strong>: Hora da operação no formato HH:MM (ex: 14:30)</li>
          <li><strong>ativo</strong>: Nome do ativo operado (ex: BTCUSDT)</li>
          <li><strong>tipo</strong>: Tipo de operação (ex: Crypto, Forex)</li>
          <li><strong>valor</strong>: Valor apostado em R$ (ex: 100.00)</li>
          <li><strong>resultado</strong>: Resultado da operação (Positivo, Negativo, Empate)</li>
          <li><strong>lucro_prejuizo</strong>: Valor do lucro ou prejuízo em R$ (ex: 25.00 ou -15.00)</li>
        </ul>
        <p className="text-sm text-blue-700 mt-2">
          Você pode baixar um <a href="#" className="text-blue-600 underline">modelo de CSV</a> para preencher com seus dados.
        </p>
      </div>
    </div>
  );
};

export default CSVImporter;
