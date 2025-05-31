import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';

const ImageImporter = ({ onImport, assets, onCancel }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [extractedData, setExtractedData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [imageName, setImageName] = useState('');

  // Limpar mensagem de erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setImageName(selectedImage.name);
      setError('');
      setRecognizedText('');
      setExtractedData([]);
      setShowPreview(false);
      
      // Mostrar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.getElementById('preview-image');
        if (img) {
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const processImage = async () => {
    if (!image) {
      setError('Por favor, selecione uma imagem para analisar.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Criar worker do Tesseract com configurações otimizadas
      const worker = await createWorker({
        logger: m => console.log(m),
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      });
      
      // Carregar idioma português e inglês para melhor reconhecimento
      await worker.loadLanguage('por+eng');
      await worker.initialize('por+eng');
      
      // Configurar para reconhecer melhor números e símbolos
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:/.+-$%,() ',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: '6', // Assume um único bloco de texto uniforme
      });
      
      // Reconhecer texto na imagem
      const { data } = await worker.recognize(image);
      await worker.terminate();
      
      setRecognizedText(data.text);
      
      // Extrair dados da imagem usando expressões regulares aprimoradas
      const extractedOperations = extractOperationsFromText(data.text);
      
      if (extractedOperations.length === 0) {
        setError('Não foi possível identificar operações na imagem. Verifique se a imagem contém dados no formato esperado.');
      } else {
        setExtractedData(extractedOperations);
        setShowPreview(true);
      }
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(`Erro ao processar a imagem: ${err.message}`);
    }
  };

  // Função aprimorada para extrair operações do texto usando expressões regulares
  const extractOperationsFromText = (text) => {
    const operations = [];
    
    // Normalizar texto: remover espaços extras, normalizar quebras de linha
    const normalizedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Dividir o texto em linhas para processamento linha por linha
    const lines = normalizedText.split('\n');
    
    // Determinar a data atual para operações sem data explícita
    const today = new Date();
    const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Extrair data do nome do arquivo se possível (formato: DDMMAAAA.png)
    let dateFromFilename = defaultDate;
    const dateMatch = imageName.match(/(\d{2})(\d{2})(\d{4})/);
    if (dateMatch) {
      const [_, day, month, year] = dateMatch;
      dateFromFilename = `${year}-${month}-${day}`;
    }
    
    // Processar cada linha
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      // Extrair horário (formato: HH:MM ou H:MM)
      const timeMatch = line.match(/(\d{1,2}:\d{2})/);
      const time = timeMatch ? timeMatch[1] : '';
      if (!time) continue; // Pular linhas sem horário
      
      // Extrair ativo
      let asset = '';
      for (const knownAsset of Object.keys(assets)) {
        if (line.includes(knownAsset)) {
          asset = knownAsset;
          break;
        }
      }
      // Se não encontrou ativo conhecido, tenta extrair padrão de ativo
      if (!asset) {
        const assetMatch = line.match(/([A-Z]{3,}USDT)/);
        if (assetMatch) {
          asset = assetMatch[1];
        }
      }
      
      // Extrair tipo (Crypto é o padrão)
      const type = line.includes('Forex') ? 'Forex' : 'Crypto';
      
      // Extrair valor apostado e lucro/prejuízo
      // Primeiro, procurar por padrões de valor monetário
      const moneyValues = [];
      const moneyMatches = line.matchAll(/[+-]?\s*R\$\s*(\d+[.,]\d+|\d+)/g);
      for (const match of moneyMatches) {
        const valueStr = match[0].replace(/[^\d.,+-]/g, '').replace(',', '.');
        moneyValues.push({
          original: match[0],
          value: parseFloat(valueStr) || 0,
          isPositive: !match[0].includes('-')
        });
      }
      
      // Determinar qual é o valor apostado e qual é o lucro/prejuízo
      let amount = 0;
      let profitLoss = 0;
      
      if (moneyValues.length >= 2) {
        // Assumir que o maior valor absoluto é o valor apostado
        // e o outro é o lucro/prejuízo
        const sortedValues = [...moneyValues].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
        
        // Verificar se há um valor claramente marcado como positivo/negativo
        const explicitProfitLoss = moneyValues.find(v => v.original.includes('+') || v.original.includes('-'));
        
        if (explicitProfitLoss) {
          profitLoss = explicitProfitLoss.isPositive ? explicitProfitLoss.value : -explicitProfitLoss.value;
          amount = moneyValues.find(v => v !== explicitProfitLoss)?.value || 0;
        } else {
          // Se não há marcação explícita, usar a heurística de tamanho
          amount = sortedValues[0].value;
          profitLoss = sortedValues[1].isPositive ? sortedValues[1].value : -sortedValues[1].value;
        }
      } else if (moneyValues.length === 1) {
        // Se só há um valor, verificar contexto para determinar se é valor ou lucro
        const value = moneyValues[0];
        
        if (value.original.includes('+') || value.original.includes('-')) {
          // É claramente um lucro/prejuízo
          profitLoss = value.isPositive ? value.value : -value.value;
          
          // Tentar inferir o valor apostado com base no lucro e no percentual do ativo
          if (asset && assets[asset]) {
            const percentage = assets[asset];
            amount = Math.abs(profitLoss / percentage);
          }
        } else {
          // Provavelmente é o valor apostado
          amount = value.value;
          
          // Verificar se há indicação de resultado na linha
          const isPositive = line.match(/ganho|lucro|profit|win|positivo/i);
          const isNegative = line.match(/perda|prejuízo|loss|negativo/i);
          
          if (isPositive && asset && assets[asset]) {
            profitLoss = amount * assets[asset];
          } else if (isNegative) {
            profitLoss = -amount;
          }
        }
      }
      
      // Determinar resultado com base no lucro/prejuízo
      let result = 'Empate';
      if (profitLoss > 0) {
        result = 'Positivo';
      } else if (profitLoss < 0) {
        result = 'Negativo';
      }
      
      // Criar objeto de operação apenas se temos pelo menos horário e algum valor
      if (time && (amount > 0 || profitLoss !== 0)) {
        operations.push({
          date: dateFromFilename,
          time,
          asset: asset || 'XRPUSDT', // Usar um ativo padrão se não foi identificado
          type,
          amount,
          result,
          profitLoss
        });
      }
    }
    
    return operations;
  };

  const handleImport = () => {
    if (extractedData.length === 0) {
      setError('Não há dados para importar.');
      return;
    }
    
    onImport(extractedData);
    
    // Limpar estado
    setImage(null);
    setImageName('');
    setRecognizedText('');
    setExtractedData([]);
    setShowPreview(false);
    
    // Limpar preview da imagem
    const img = document.getElementById('preview-image');
    if (img) {
      img.src = '';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Importar Operações via Imagem</h2>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione uma imagem com suas operações
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark"
          />
          <p className="mt-1 text-sm text-gray-500">
            A imagem deve conter informações claras sobre suas operações (horário, ativo, tipo, valor, resultado).
          </p>
          <p className="mt-1 text-sm text-gray-500">
            <strong>Dica:</strong> Para melhor reconhecimento da data, nomeie o arquivo no formato DDMMAAAA.png (ex: 18052025.png)
          </p>
        </div>
        
        {image && (
          <div className="flex flex-col space-y-3">
            <div className="border border-gray-300 rounded-md p-2 max-w-md">
              <img id="preview-image" className="max-w-full h-auto" alt="Preview" />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={processImage}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Processando...' : 'Analisar Imagem'}
              </button>
              
              {showPreview && (
                <button
                  onClick={handleImport}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  Importar Operações
                </button>
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
      
      {showPreview && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Operações Identificadas</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor (R$)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro/Prejuízo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {extractedData.map((operation, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{operation.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{operation.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{operation.asset}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{operation.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">R$ {operation.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{operation.result}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                      operation.profitLoss > 0 
                        ? 'text-green-600' 
                        : operation.profitLoss < 0 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                    }`}>
                      {operation.profitLoss > 0 ? '+' : ''}{operation.profitLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-yellow-800 mb-2">Dicas para melhor reconhecimento</h3>
        <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
          <li>Use imagens com boa resolução e bem iluminadas</li>
          <li>Evite imagens com texto borrado ou muito pequeno</li>
          <li>Nomeie o arquivo de imagem com a data no formato DDMMAAAA.png (ex: 18052025.png)</li>
          <li>Certifique-se de que a imagem contenha informações claras sobre horário, ativo, tipo, valor e resultado</li>
          <li>Após a análise, verifique se os dados foram extraídos corretamente antes de importar</li>
          <li>Para maior precisão, considere usar a importação via CSV</li>
        </ul>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ImageImporter;
