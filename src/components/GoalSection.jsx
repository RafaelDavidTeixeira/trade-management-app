import React from 'react';

const GoalSection = ({ 
  dailyGoal, 
  setDailyGoal, 
  goalType, 
  setGoalType, 
  initialBankroll, 
  setInitialBankroll 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Configuração de Metas</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capital Inicial (R$)
            </label>
            <input
              type="number"
              value={initialBankroll}
              onChange={(e) => setInitialBankroll(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Diária
            </label>
            <div className="flex">
              <input
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary bg-gray-100"
              >
                <option value="R$">R$</option>
                <option value="%">%</option>
              </select>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {goalType === '%' ? 
                `Equivalente a R$ ${((initialBankroll * dailyGoal) / 100).toFixed(2)}` : 
                `Equivalente a ${((dailyGoal / initialBankroll) * 100).toFixed(2)}% do capital`}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            A meta diária será usada para calcular seu progresso diário e determinar quando você atingiu seu objetivo.
            Você pode definir a meta como um valor fixo em reais ou como uma porcentagem do seu capital inicial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalSection;
