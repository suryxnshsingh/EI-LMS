import React, { useState, useEffect } from 'react';
import { X, ChevronUp, History, Moon, Sun } from 'lucide-react';
import * as math from 'mathjs';

const ScientificCalculator = ({ onClose, theme }) => {
  const [input, setInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [angleMode, setAngleMode] = useState('deg');
  const [memory, setMemory] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [scientificTab, setScientificTab] = useState('trig');
  const [expandKeypad, setExpandKeypad] = useState(true);
  const [inputHistory, setInputHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Handle button clicks for basic and scientific functions
  const handleButtonClick = (value) => {
    if (value === 'Ans' && lastAnswer !== null) {
      setInput(prev => prev + 'ans');
      return;
    }
    setInput(prev => prev + value);
  };

  // Handle scientific function calculations
  const handleFunction = (func) => {
    try {
      // For functions that operate on the current expression
      if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
           'log', 'log10', 'ln', 'sqrt', 'abs', 'floor', 'ceil', 'exp'].includes(func)) {
        setInput(prev => `${func}(${prev || ''})`);
        return;
      }

      // For constants and other operations
      switch (func) {
        case 'π':
          setInput(prev => prev + 'pi');
          return;
        case 'e':
          setInput(prev => prev + 'e');
          return;
        case 'x^2':
          setInput(prev => `(${prev || ''})^2`);
          return;
        case 'x^3':
          setInput(prev => `(${prev || ''})^3`);
          return;
        case '10^x':
          setInput(prev => `10^(${prev || ''})`);
          return;
        case '1/x':
          setInput(prev => `1/(${prev || ''})`);
          return;
        case 'x!':
          setInput(prev => `factorial(${prev || ''})`);
          return;
        case 'rand':
          const result = math.random();
          setInput(result.toString());
          break;
        default:
          return;
      }
    } catch (error) {
      setInput('Error');
    }
  };

  // Clear the input field
  const handleClear = () => {
    setInput('');
  };

  // Calculate the result using math.js
  const handleCalculate = () => {
    if (!input) return;
    
    try {
      // Create a scope with the lastAnswer and config
      const scope = { 
        ...((lastAnswer !== null) ? { ans: lastAnswer } : {}),
        // Math.js requires config to be part of the scope object
        config: { angle: angleMode }
      };
      
      // Evaluate the expression with math.js (only 2 arguments: expression and scope)
      const result = math.evaluate(input, scope);
      
      // Save to history
      setHistory(prev => [...prev, { expression: input, result: result }]);
      setInputHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      
      // Format the result nicely
      if (typeof result === 'number') {
        // Format number to avoid excessive decimals
        const formattedResult = math.format(result, { precision: 10 });
        setInput(formattedResult);
        setLastAnswer(result);
      } else {
        // For non-numeric results (like matrices, etc.)
        setInput(result.toString());
        setLastAnswer(result);
      }
    } catch (error) {
      setInput('Error');
    }
  };

  // Memory functions
  const handleMemory = (action) => {
    try {
      let currentValue;
      try {
        // Create a scope with the lastAnswer if available
        const scope = lastAnswer !== null ? { ans: lastAnswer } : {};
        // Math.js only accepts two parameters
        currentValue = math.evaluate(input || '0', scope);
      } catch (e) {
        currentValue = 0;
      }
      
      switch (action) {
        case 'MS': // Memory Store
          setMemory(currentValue);
          break;
        case 'MR': // Memory Recall
          if (memory !== null) {
            setInput(prev => prev + memory.toString());
          }
          break;
        case 'MC': // Memory Clear
          setMemory(null);
          break;
        case 'M+': // Memory Add
          setMemory((memory || 0) + currentValue);
          break;
        case 'M-': // Memory Subtract
          setMemory((memory || 0) - currentValue);
          break;
      }
    } catch (error) {
      // Silently fail for memory operations
    }
  };

  // Toggle between degrees and radians
  const toggleAngleMode = () => {
    setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg');
  };

  // Delete the last character
  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  // Navigate through input history
  const navigateHistory = (direction) => {
    if (inputHistory.length === 0) return;
    
    if (direction === 'up') {
      const newIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(inputHistory[newIndex]);
    } else if (direction === 'down') {
      if (historyIndex === -1) return;
      
      const newIndex = historyIndex + 1;
      if (newIndex >= inputHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(inputHistory[newIndex]);
      }
    }
  };

  // Use a historical calculation
  const useHistoryItem = (item) => {
    setInput(item.expression);
    setShowHistory(false);
  };

  // Basic calculator buttons
  const basicButtons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  // Extended basic buttons (shown when in expanded mode)
  const extendedBasicButtons = [
    ['(', ')', '%', '^'],
  ];

  // Scientific calculator buttons - first tab
  const trigButtons = [
    ['sin', 'cos', 'tan', 'log10'],
    ['asin', 'acos', 'atan', 'ln'],
    ['sinh', 'cosh', 'tanh', 'log'],
    ['π', 'e', 'mod', 'Ans']
  ];

  // Scientific calculator buttons - second tab
  const advancedButtons = [
    ['sqrt', 'x^2', 'x^3', '10^x'],
    ['abs', 'floor', 'ceil', 'x!'],
    ['1/x', 'exp', 'rand', '['],
    [']', ',', '±', 'DEL']
  ];

  // Memory buttons
  const memoryButtons = ['MC', 'MR', 'MS', 'M+', 'M-'];

  // Determine background and text colors based on theme
  const isDark = theme === 'dark';
  
  return (
    <div className="fixed bottom-4 right-4 bg-transparent p-4 rounded-lg z-50 w-80">
      <div 
        className={`p-4 rounded-lg shadow-lg z-50 w-80 ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } transition-all duration-300`}
      >
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">
              {showAdvanced ? 'Scientific Calculator' : 'Calculator'}
            </h3>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className={`mr-2 p-1 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } ${showHistory ? (isDark ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
            >
              <History className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Display history if toggled */}
        {showHistory && (
          <div className={`mb-3 max-h-40 overflow-y-auto rounded-lg p-2 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {history.length === 0 ? (
              <p className="text-center text-sm p-2">No calculation history</p>
            ) : (
              <ul>
                {history.map((item, index) => (
                  <li 
                    key={index}
                    onClick={() => useHistoryItem(item)}
                    className={`cursor-pointer p-1 text-sm hover:${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    } rounded mb-1`}
                  >
                    <div>{item.expression}</div>
                    <div className="font-bold">{typeof item.result === 'number' 
                      ? math.format(item.result, { precision: 10 }) 
                      : item.result.toString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Input display */}
        <div className="mb-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCalculate();
              if (e.key === 'ArrowUp') navigateHistory('up');
              if (e.key === 'ArrowDown') navigateHistory('down');
            }}
            className={`w-full p-2 text-lg rounded-lg text-right pr-8 ${
              isDark 
                ? 'bg-gray-700 text-white border border-gray-600 focus:border-blue-500' 
                : 'bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500'
            } focus:outline-none transition-all`}
          />
          {input && (
            <button
              onClick={handleBackspace}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-${
                isDark ? 'gray-400 hover:text-white' : 'gray-600 hover:text-gray-900'
              }`}
            >
              ←
            </button>
          )}
        </div>
        
        {/* Mode indicators */}
        <div className="flex justify-between mb-2 text-xs">
          <div className="flex space-x-1">
            <button 
              onClick={toggleAngleMode}
              className={`px-2 py-1 rounded transition-colors ${
                angleMode === 'deg' 
                  ? 'bg-blue-500 text-white' 
                  : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
              }`}
            >
              DEG
            </button>
            <button 
              onClick={toggleAngleMode}
              className={`px-2 py-1 rounded transition-colors ${
                angleMode === 'rad' 
                  ? 'bg-blue-500 text-white' 
                  : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
              }`}
            >
              RAD
            </button>
          </div>
          <div className="flex items-center">
            {memory !== null && (
              <span className={`px-2 py-1 rounded ${
                isDark ? 'bg-gray-700 text-blue-400' : 'bg-gray-200 text-blue-600'
              }`}>
                M
              </span>
            )}
            {lastAnswer !== null && (
              <span className={`ml-1 px-2 py-1 rounded ${
                isDark ? 'bg-gray-700 text-green-400' : 'bg-gray-200 text-green-600'
              }`}>
                ANS
              </span>
            )}
          </div>
        </div>
        
        {/* Toggle scientific mode button (removed expand button) */}
        <div className="flex space-x-1 mb-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full p-2 rounded text-sm font-medium transition-colors ${
              isDark 
                ? (showAdvanced ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white') 
                : (showAdvanced ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800')
            }`}
          >
            {showAdvanced ? 'Basic Mode' : 'Scientific Mode'}
          </button>
        </div>
        
        {/* Memory buttons - only shown in scientific mode */}
        {showAdvanced && (
          <div className="grid grid-cols-5 gap-1 mb-2">
            {memoryButtons.map((value) => (
              <button
                key={value}
                onClick={() => handleMemory(value)}
                className={`p-1 rounded text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        )}
        
        {/* Scientific tab selector - only shown in advanced mode */}
        {showAdvanced && (
          <div className="flex mb-2">
            <button
              onClick={() => setScientificTab('trig')}
              className={`flex-1 p-1 rounded-l text-sm font-medium transition-colors ${
                scientificTab === 'trig'
                  ? 'bg-blue-500 text-white'
                  : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
              }`}
            >
              Trig & Log
            </button>
            <button
              onClick={() => setScientificTab('advanced')}
              className={`flex-1 p-1 rounded-r text-sm font-medium transition-colors ${
                scientificTab === 'advanced'
                  ? 'bg-blue-500 text-white'
                  : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
              }`}
            >
              Advanced
            </button>
          </div>
        )}
        
        {/* Scientific buttons - only shown when advanced mode is toggled */}
        {showAdvanced && (
          <div className="grid grid-cols-4 gap-1 mb-2">
            {(scientificTab === 'trig' ? trigButtons : advancedButtons).map((row, rowIndex) => (
              row.map((value, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => {
                    if (value === 'DEL') {
                      handleBackspace();
                    } else if (value === '±') {
                      setInput(prev => prev.startsWith('-') ? prev.substring(1) : `-${prev}`);
                    } else if (value === 'Ans') {
                      handleButtonClick('Ans');
                    } else {
                      handleFunction(value);
                    }
                  }}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } ${value === 'DEL' ? (isDark ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600 text-white') : ''}`}
                >
                  {value}
                </button>
              ))
            ))}
          </div>
        )}
        
        {/* Extended basic buttons - shown when expanded */}
        {expandKeypad && (
          <div className="grid grid-cols-4 gap-1 mb-2">
            {extendedBasicButtons.map((row, rowIndex) => (
              row.map((value, colIndex) => (
                <button
                  key={`extended-${rowIndex}-${colIndex}`}
                  onClick={() => handleButtonClick(value)}
                  className={`p-2 rounded text-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {value}
                </button>
              ))
            ))}
          </div>
        )}
        
        {/* Basic calculator buttons - always shown */}
        <div className="grid grid-cols-4 gap-1">
          {basicButtons.map((row, rowIndex) => (
            row.map((value, colIndex) => (
              <button
                key={`basic-${rowIndex}-${colIndex}`}
                onClick={value === '=' ? handleCalculate : () => handleButtonClick(value)}
                className={`p-2 rounded text-lg font-medium transition-colors ${
                  value === '='
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : (isDark 
                      ? (!/[0-9.]/.test(value) 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500 text-white')
                      : (!/[0-9.]/.test(value) 
                        ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800')
                    )
                }`}
              >
                {value}
              </button>
            ))
          ))}
          <button
            onClick={handleClear}
            className={`col-span-4 p-2 rounded text-lg font-medium transition-colors ${
              isDark
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;