import React from 'react';

const ConsolidatedReport = ({ 
  dailyTrades, 
  dailyProfitLoss, 
  goalStatus, 
  selectedDate 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Relatório Consolidado</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Resumo do Dia: {selectedDate}</h3>
          
          {dailyTrades.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Operações</div>
                  <div className="text-xl font-bold">{dailyTrades.length}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Resultado</div>
                  <div className={`text-xl font-bold ${parseFloat(dailyProfitLoss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {dailyProfitLoss}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Meta Diária: R$ {goalStatus.effectiveGoal}</div>
                
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${goalStatus.metGoal ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ 
                      width: `${Math.min(Math.abs(parseFloat(dailyProfitLoss) / parseFloat(goalStatus.effectiveGoal) * 100), 100)}%` 
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                
                <div className="mt-4">
                  {goalStatus.metGoal ? (
                    <div className="p-3 bg-green-100 text-green-800 rounded-md">
                      <span className="font-medium">Meta atingida!</span> Você superou sua meta diária em R$ {goalStatus.exceeded}.
                    </div>
                  ) : (
                    <div className="p-3 bg-red-100 text-red-800 rounded-md">
                      <span className="font-medium">Meta não atingida.</span> Faltam R$ {goalStatus.shortfall} para atingir sua meta diária.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Distribuição por Ativo</h4>
                
                {(() => {
                  const assetCounts = dailyTrades.reduce((acc, trade) => {
                    acc[trade.asset] = (acc[trade.asset] || 0) + 1;
                    return acc;
                  }, {});
                  
                  const assetProfits = dailyTrades.reduce((acc, trade) => {
                    acc[trade.asset] = (acc[trade.asset] || 0) + parseFloat(trade.profitLoss);
                    return acc;
                  }, {});
                  
                  return Object.entries(assetCounts).map(([asset, count]) => (
                    <div key={asset} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{asset}</span>
                        <span className="text-sm">{count} operações</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${assetProfits[asset] >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(count / dailyTrades.length) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{((count / dailyTrades.length) * 100).toFixed(0)}%</span>
                        <span className={`text-xs ${assetProfits[asset] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {assetProfits[asset].toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">Nenhuma operação registrada para esta data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedReport;
