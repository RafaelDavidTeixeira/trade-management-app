// components/DetailedReports.jsx
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DetailedReports = ({ trades, assets, stats }) => {
  const [filterDate, setFilterDate] = useState('');
  const [filterAsset, setFilterAsset] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('');

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchDate = filterDate ? trade.date === filterDate : true;
      const matchAsset = filterAsset ? trade.asset === filterAsset : true;
      const matchType = filterType ? trade.type === filterType : true;
      const matchOutcome = filterOutcome ?
        (filterOutcome === 'Positive' && trade.profitLoss > 0) ||
        (filterOutcome === 'Negative' && trade.profitLoss < 0) ||
        (filterOutcome === 'Tie' && trade.profitLoss === 0)
        : true;
      return matchDate && matchAsset && matchType && matchOutcome;
    }).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)); // Ordena por data e hora decrescente
  }, [trades, filterDate, filterAsset, filterType, filterOutcome]);

  const reportSummary = useMemo(() => {
    const totalBet = filteredTrades.reduce((sum, t) => sum + (parseFloat(t.betAmount) || 0), 0);
    const totalProfitLoss = filteredTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
    const wins = filteredTrades.filter(t => parseFloat(t.profitLoss) > 0).length;
    const losses = filteredTrades.filter(t => parseFloat(t.profitLoss) < 0).length;
    const ties = filteredTrades.filter(t => parseFloat(t.profitLoss) === 0).length;
    const tradeCount = filteredTrades.length;
    const winRate = tradeCount > 0 ? (wins / tradeCount * 100) : 0;
    const avgProfit = wins > 0 ? filteredTrades.filter(t => t.profitLoss > 0).reduce((sum, t) => sum + parseFloat(t.profitLoss), 0) / wins : 0;
    const avgLoss = losses > 0 ? filteredTrades.filter(t => t.profitLoss < 0).reduce((sum, t) => sum + parseFloat(t.profitLoss), 0) / losses : 0;

    return {
      totalBet: totalBet.toFixed(2),
      totalProfitLoss: totalProfitLoss.toFixed(2),
      tradeCount,
      wins,
      losses,
      ties,
      winRate: winRate.toFixed(2),
      avgProfit: avgProfit.toFixed(2),
      avgLoss: avgLoss.toFixed(2),
    };
  }, [filteredTrades]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Relatório Detalhado de Operações</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="filterDate" className="block text-gray-700 text-sm font-bold mb-2">Data</label>
          <input
            type="date"
            id="filterDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filterAsset" className="block text-gray-700 text-sm font-bold mb-2">Ativo</label>
          <select
            id="filterAsset"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterAsset}
            onChange={(e) => setFilterAsset(e.target.value)}
          >
            <option value="">Todos</option>
            {Object.keys(assets).map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filterType" className="block text-gray-700 text-sm font-bold mb-2">Tipo</label>
          <select
            id="filterType"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Crypto">Crypto</option>
            <option value="Forex">Forex</option>
            <option value="Stocks">Stocks</option>
            <option value="Copy">Copy</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterOutcome" className="block text-gray-700 text-sm font-bold mb-2">Resultado</label>
          <select
            id="filterOutcome"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Positive">Positivo</option>
            <option value="Negative">Negativo</option>
            <option value="Tie">Empate</option>
          </select>
        </div>
      </div>

      {/* Resumo do Relatório */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <h3 className="text-lg font-semibold mb-3 text-secondary">Resumo do Período Filtrado</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <p><strong>Total de Operações:</strong> {reportSummary.tradeCount}</p>
          <p><strong>Total Apostado:</strong> R$ {reportSummary.totalBet}</p>
          <p><strong>Lucro/Prejuízo Líquido:</strong> R$ <span className={reportSummary.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>{reportSummary.totalProfitLoss}</span></p>
          <p><strong>Vitórias:</strong> {reportSummary.wins}</p>
          <p><strong>Derrotas:</strong> {reportSummary.losses}</p>
          <p><strong>Empates:</strong> {reportSummary.ties}</p>
          <p><strong>Taxa de Vitórias:</strong> {reportSummary.winRate}%</p>
          <p><strong>Lucro Médio por Vitória:</strong> R$ {reportSummary.avgProfit}</p>
          <p><strong>Prejuízo Médio por Derrota:</strong> R$ {reportSummary.avgLoss}</p>
        </div>
      </div>

      {/* Tabela de Operações Detalhadas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Data</th>
              <th className="py-3 px-6 text-left">Hora</th>
              <th className="py-3 px-6 text-left">Ativo</th>
              <th className="py-3 px-6 text-left">Tipo</th>
              <th className="py-3 px-6 text-left">Valor Apostado</th>
              <th className="py-3 px-6 text-left">Lucro/Prejuízo</th>
              <th className="py-3 px-6 text-left">Resultado</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredTrades.length > 0 ? (
              filteredTrades.map(trade => (
                <tr key={trade.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{format(new Date(trade.date + 'T' + trade.time), 'dd/MM/yyyy', { locale: ptBR })}</td>
                  <td className="py-3 px-6 text-left">{trade.time}</td>
                  <td className="py-3 px-6 text-left">{trade.asset}</td>
                  <td className="py-3 px-6 text-left">{trade.type}</td>
                  <td className="py-3 px-6 text-left">R$ {trade.betAmount.toFixed(2)}</td>
                  <td className={`py-3 px-6 text-left ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {trade.profitLoss.toFixed(2)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {trade.profitLoss > 0 ? 'Positivo' : trade.profitLoss < 0 ? 'Negativo' : 'Empate'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-6 text-center text-gray-500">Nenhuma operação encontrada para os filtros selecionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedReports;