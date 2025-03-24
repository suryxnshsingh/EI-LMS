import React, { useState, useEffect } from 'react';
import { X, History, GripHorizontal } from 'lucide-react';
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
  const [error, setError] = useState(null);

  // Handle button clicks for basic and scientific functions
  const handleButtonClick = (value) => {
    setError(null);
    if (value === 'Ans' && lastAnswer !== null) {
      setInput(prev => prev + 'ans');
      return;
    }
    setInput(prev => prev + value);
  };

  // Map function names to their math.js equivalents
  const functionMappings = {
    'ln': 'log',       // Natural logarithm (base e)
    'log': 'log10',    // Common logarithm (base 10)
    'x^2': 'square',   // Square function
    'x^3': 'cube',     // Cube function 
    '10^x': 'pow10',   // 10 to the power of x
    '±': 'negate',     // Negation
    'mod': 'mod',      // Modulo 
    'rand': 'random',  // Random number
  };

  // Wrap expression with function calls properly
  const wrapWithFunction = (func, expression) => {
    // Get the mapped function name or use the original
    const mappedFunc = functionMappings[func] || func;
    
    // Handle special cases
    switch(func) {
      case 'x^2':
        return `(${expression || '0'})^2`;
      case 'x^3':
        return `(${expression || '0'})^3`;
      case '10^x':
        return `10^(${expression || '0'})`;
      case '1/x':
        return `1/(${expression || '0'})`;
      case '±':
        // If it already starts with a minus, remove it; otherwise, add it
        return expression.startsWith('-') ? expression.substring(1) : `-${expression}`;
      case 'π':
        return expression + 'pi';
      case 'e':
        return expression + 'e';
      default:
        // Standard function wrapping
        return `${mappedFunc}(${expression || '0'})`;
    }
  };

  // Handle scientific function calculations
  const handleFunction = (func) => {
    try {
      setError(null);
      
      // Handle direct constants
      if (func === 'π') {
        setInput(prev => prev + 'pi');
        return;
      }
      
      if (func === 'e') {
        setInput(prev => prev + 'e');
        return;
      }
      
      // Handle functions
      if (func === 'DEL') {
        handleBackspace();
        return;
      }
      
      if (func === '±') {
        setInput(prev => prev.startsWith('-') ? prev.substring(1) : `-${prev}`);
        return;
      }
      
      // For standard functions
      const standardFunctions = [
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 
        'sinh', 'cosh', 'tanh', 'sqrt', 'abs', 
        'floor', 'ceil', 'exp'
      ];
      
      if (standardFunctions.includes(func) || Object.keys(functionMappings).includes(func)) {
        setInput(prev => wrapWithFunction(func, prev));
        return;
      }
      
    } catch (error) {
      setError(`Function error: ${error.message}`);
    }
  };

  // Clear the input field
  const handleClear = () => {
    setInput('');
    setError(null);
  };

  // Get the proper scope for math.js evaluation
  const getScope = () => {
    // Create a basic scope with the previous answer if available
    const baseScope = lastAnswer !== null ? { ans: lastAnswer } : {};
    
    // Add special functions
    const customFunctions = {
      // Add specific functions that need custom implementation
      square: (x) => Math.pow(x, 2),
      cube: (x) => Math.pow(x, 3),
      pow10: (x) => Math.pow(10, x),
      negate: (x) => -x,
    };
    
    return {
      ...baseScope,
      ...customFunctions,
      // Add config for angle mode
      config: { angle: angleMode }
    };
  };

  // Calculate the result using math.js
  const handleCalculate = () => {
    if (!input) return;
    
    try {
      setError(null);
      
      // Prepare the expression by replacing certain patterns
      let processedInput = input
        .replace(/(\d)(?=\()/g, '$1*') // Add implied multiplication: 2(3) -> 2*(3)
        .replace(/\)([\d(])/g, ')*$1'); // Add implied multiplication: (2)(3) -> (2)*(3)
      
      // Get the scope with all necessary variables and functions
      const scope = getScope();
      
      // Evaluate the expression with math.js
      const result = math.evaluate(processedInput, scope);
      
      // Save to history
      setHistory(prev => [...prev, { expression: input, result: result }]);
      setInputHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      
      // Format and display the result
      let formattedResult;
      
      if (typeof result === 'number') {
        // Handle numbers: format to avoid excessive decimals
        const precision = Math.abs(result) < 0.0001 || Math.abs(result) >= 10000 
          ? { notation: 'exponential', precision: 6 } 
          : { precision: 10 };
        
        formattedResult = math.format(result, precision);
        setInput(formattedResult);
        setLastAnswer(result);
      } else if (result && typeof result === 'object' && result.hasOwnProperty('entries')) {
        // Handle matrices or arrays
        formattedResult = '[' + result.toArray().toString() + ']';
        setInput(formattedResult);
        setLastAnswer(result);
      } else {
        // For other types (like boolean, string, etc.)
        formattedResult = result.toString();
        setInput(formattedResult);
        setLastAnswer(result);
      }
    } catch (error) {
      setError(`Calculation error: ${error.message}`);
      console.error("Calculation error:", error);
    }
  };

  // Memory functions
  const handleMemory = (action) => {
    try {
      setError(null);
      
      let currentValue;
      try {
        // Get current value if input is not empty
        const scope = getScope();
        currentValue = input ? math.evaluate(input, scope) : 0;
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
        default:
          break;
      }
    } catch (error) {
      setError(`Memory operation error: ${error.message}`);
    }
  };

  // Toggle between degrees and radians
  const toggleAngleMode = () => {
    setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg');
  };

  // Delete the last character
  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
    setError(null);
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
    setError(null);
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
    ['sin', 'cos', 'tan', 'log'],   // 'log' is actually log10 in the UI
    ['asin', 'acos', 'atan', 'ln'],  // 'ln' is actually log in the UI
    ['sinh', 'cosh', 'tanh', 'sqrt'],
    ['π', 'e', 'mod', 'Ans']
  ];

  // Scientific calculator buttons - second tab
  const advancedButtons = [
    ['abs', 'x^2', 'x^3', '10^x'],
    ['floor', 'ceil', '1/x', 'exp'],
    ['[', ']', ',', 'rand'],
    ['±', 'DEL', '(', ')']
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
        {/* Drag indicator */}
        <div className="w-full flex justify-center items-center -mt-2 mb-1 cursor-move">
          <div className="flex flex-col items-center">
            <GripHorizontal className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            {/* <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Drag to move</span> */}
          </div>
        </div>
        
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
        <div className="mb-1 relative">
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
        
        {/* Error display */}
        {error && (
          <div className={`text-xs px-2 py-1 mb-2 rounded ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}
        
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
        
        {/* Extended basic buttons - always shown */}
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