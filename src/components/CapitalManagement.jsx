const CapitalManagement = ({
  stopLoss, setStopLoss, stopWin, setStopWin,
  stopLossType, setStopLossType, stopWinType, setStopWinType,
  initialBankroll, currentBankroll,
  entryPercentage, setEntryPercentage,
  capitalBaseType, setCapitalBaseType,
  dailyGoal, setDailyGoal, goalType, setGoalType,
  addToast, // Receber a função addToast do App
}) => {
  const calculateEquivalentGoal = () => {
    let equivalent = parseFloat(dailyGoal) || 0;
    if (goalType === '%') {
      if (!isNaN(currentBankroll) && currentBankroll !== 0) {
        equivalent = currentBankroll * (parseFloat(dailyGoal) / 100);
      } else {
        console.warn("Current bankroll is zero or invalid for percentage goal calculation.");
      }
    }
    return isNaN(equivalent) ? 'R$ 0.00' : `R$ ${equivalent.toFixed(2)}`;
  };

  const handleDailyGoalChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0) {
      setDailyGoal(value);
    } else {
      addToast('A Meta Diária não pode ser negativa.', 'error');
    }
  };

  const handleEntryPercentageChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0 && value <= 100) {
      setEntryPercentage(value);
    } else {
      addToast('A Porcentagem de Entrada deve estar entre 0% e 100%.', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">Gerenciamento de Capital</h2>

      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-secondary">Configurações de Risco</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entryPercentage" className="block text-gray-700 text-sm font-bold mb-2">
              Porcentagem de Entrada (%)
            </label>
            <input
              type="number"
              id="entryPercentage"
              name="entryPercentage"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={entryPercentage}
              onChange={handleEntryPercentageChange}
              step="0.01"
              placeholder="1.00"
            />
          </div>
          <div>
            <label htmlFor="stopLoss" className="block text-gray-700 text-sm font-bold mb-2">
              Stop Loss
            </label>
            <div className="flex">
              <input
                type="number"
                id="stopLoss"
                name="stopLoss"
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                step="0.01"
                placeholder="50.00"
              />
              <select
                className="shadow border rounded-r py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={stopLossType}
                onChange={(e) => setStopLossType(e.target.value)}
              >
                <option value="R$">R$</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="stopWin" className="block text-gray-700 text-sm font-bold mb-2">
              Stop Win
            </label>
            <div className="flex">
              <input
                type="number"
                id="stopWin"
                name="stopWin"
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={stopWin}
                onChange={(e) => setStopWin(parseFloat(e.target.value) || 0)}
                step="0.01"
                placeholder="100.00"
              />
              <select
                className="shadow border rounded-r py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={stopWinType}
                onChange={(e) => setStopWinType(e.target.value)}
              >
                <option value="R$">R$</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Base para Stop Loss/Win (%)
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary"
                name="capitalBase"
                value="current"
                checked={capitalBaseType === 'current'}
                onChange={() => setCapitalBaseType('current')}
              />
              <span className="ml-2">Capital Atual (R$ {currentBankroll.toFixed(2)})</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary"
                name="capitalBase"
                value="initial"
                checked={capitalBaseType === 'initial'}
                onChange={() => setCapitalBaseType('initial')}
              />
              <span className="ml-2">Capital Inicial (R$ {initialBankroll.toFixed(2)})</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-secondary">Configuração de Metas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dailyGoal" className="block text-gray-700 text-sm font-bold mb-2">
              Meta Diária
            </label>
            <div className="flex">
              <input
                type="number"
                id="dailyGoal"
                name="dailyGoal"
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dailyGoal}
                onChange={handleDailyGoalChange}
                step="0.01"
                placeholder="10"
              />
              <select
                className="shadow border rounded-r py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
              >
                <option value="R$">R$</option>
                <option value="%">%</option>
              </select>
            </div>
            <p className="text-gray-600 text-sm mt-1">Equivalente a {calculateEquivalentGoal()}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          A meta diária será usada para calcular seu progresso diário e determinar quando você atingiu seu objetivo.
          Você pode definir a meta como um valor fixo em reais ou como uma porcentagem do seu capital atual.
        </p>
      </div>
    </div>
  );
};

export default CapitalManagement;