import React, { useState } from 'react';
import { ArrowDownUp, Play, RotateCcw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [number, setNumber] = useState<string>('');
  const [history, setHistory] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string>('');

  const getAscendingAndDescending = (num: number) => {
    const digits = num.toString().padStart(4, '0').split('');
    const ascending = digits.sort().join('');
    const descending = digits.sort((a, b) => b.localeCompare(a)).join('');
    return {
      ascending: parseInt(ascending),
      descending: parseInt(descending)
    };
  };

  const calculateKaprekar = (num: number): number => {
    const { ascending, descending } = getAscendingAndDescending(num);
    return descending - ascending;
  };

  const startSimulation = async () => {
    if (!number || isNaN(Number(number)) || number.length > 4) {
      setError('Please enter a valid number (up to 4 digits)');
      return;
    }
    setError('');
    setIsCalculating(true);
    setHistory([]);
    
    let currentNum = parseInt(number);
    let newHistory: number[] = [currentNum];
    
    while (currentNum !== 6174 && newHistory.length < 8) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      currentNum = calculateKaprekar(currentNum);
      newHistory.push(currentNum);
      setHistory([...newHistory]);
    }
    setIsCalculating(false);
  };

  const reset = () => {
    setNumber('');
    setHistory([]);
    setError('');
    setIsCalculating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900">Kaprekar's Constant</h1>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
            >
              <Info className="w-6 h-6 text-indigo-600" />
            </button>
          </div>

          <AnimatePresence>
            {!showInfo && (
              <motion.div
  key="info-box"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
  className="bg-indigo-50 rounded-lg p-4 mb-6"
>
  <p className="text-indigo-900">
    Kaprekar's constant (6174) is reached when you take any four-digit number, 
    arrange its digits in ascending and descending order, and subtract the smaller 
    from the larger number. Repeat this process with the result, and you'll 
    eventually reach 6174.
  </p>
</motion.div>

            )}
          </AnimatePresence>

          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter a number"
              className="flex-1 px-4 py-2 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              maxLength={4}
              disabled={isCalculating}
            />
            <button
              onClick={startSimulation}
              disabled={isCalculating}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {history.map((num, index) => {
              const { ascending, descending } = getAscendingAndDescending(num);
              const isLast = index === history.length - 1;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-indigo-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-semibold text-indigo-900">
                        {num.toString().padStart(4, '0')}
                      </div>
                    </div>
                    {num === 6174 && (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
                        Kaprekar's Constant!
                      </div>
                    )}
                  </div>
                  
                  {!isLast && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1 md:min-w-[280px]">
                      <div className="flex justify-between text-gray-600">
                        <span>Descending:</span>
                        <span className="font-mono font-medium">{descending.toString().padStart(4, '0')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Ascending:</span>
                        <span className="font-mono font-medium">{ascending.toString().padStart(4, '0')}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-1 mt-1">
                        <div className="flex justify-between font-medium">
                          <span>Result:</span>
                          <span className="font-mono text-indigo-600">{(descending - ascending).toString().padStart(4, '0')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;