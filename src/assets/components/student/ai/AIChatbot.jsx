import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Send, 
  Loader2, 
  BookOpen, 
  X, 
  Sparkles, 
  CornerDownLeft, 
  RefreshCcw, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  Cpu, 
  Lightbulb,
  Sun,
  Copy,
  Check
} from 'lucide-react';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX React components
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07,
      delayChildren: 0.2
    } 
  }
};

const messageVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9 
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20
    } 
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
}

const floatingBubbleVariants = {
  animate: {
    y: [0, -15, 0],
    x: [-5, 5, -5],
    opacity: [0.3, 0.7, 0.3],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut"
    }
  }
}

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1">
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        className="w-2 h-2 rounded-full bg-purple-400"
      />
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15, ease: "easeInOut" }}
        className="w-2 h-2 rounded-full bg-purple-400"
      />
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        className="w-2 h-2 rounded-full bg-purple-400"
      />
    </div>
  );
};

// New components
const CommandBar = ({ activeCommand, setActiveCommand, isLoading }) => {
  const commands = [
    { id: 'explain', label: 'Explain', icon: <Lightbulb className="h-4 w-4 mr-1.5" /> },
    { id: 'summarize', label: 'Summarize', icon: <BookOpen className="h-4 w-4 mr-1.5" /> },
    { id: 'solve', label: 'Solve', icon: <Cpu className="h-4 w-4 mr-1.5" /> },
    { id: 'examples', label: 'Examples', icon: <Sun className="h-4 w-4 mr-1.5" /> }
  ];

  return (
    <motion.div 
      className="flex flex-wrap gap-2 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      {commands.map((cmd) => (
        <motion.button
          key={cmd.id}
          onClick={() => setActiveCommand(cmd.id)}
          disabled={isLoading}
          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            activeCommand === cmd.id 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700'
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {cmd.icon}
          {cmd.label}
        </motion.button>
      ))}
    </motion.div>
  );
};

const ChatMessage = ({ message, index, firstName }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      variants={messageVariants}
      className={`mb-6 flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <motion.div 
          className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0 shadow-md"
          whileHover={{ scale: 1.1, rotate: 5 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
        >
          <BookOpen className="h-4 w-4 text-white" />
        </motion.div>
      )}
      
      <motion.div
        className={`relative max-w-[90%] rounded-lg px-4 py-3 shadow-sm ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-tr-none'
            : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-neutral-700 rounded-tl-none'
        }`}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)", 
          transition: { duration: 0.2 } 
        }}
      >
        <div className="whitespace-normal break-words">
          {renderMessage(message.content)}
        </div>
        
        {message.role === 'assistant' && (
          <motion.div 
            className="absolute -bottom-7 left-0 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              onClick={copyToClipboard}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Copy to clipboard"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </motion.button>
            <motion.button
              className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
              title="Helpful"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title="Not helpful"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
      
      {message.role === 'user' && (
        <motion.div 
          className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ml-2 mt-1 flex-shrink-0 shadow-md"
          whileHover={{ scale: 1.1, rotate: -5 }}
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
        >
          <span className="text-white text-sm font-medium">{firstName[0]}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Formats text with markdown-like syntax and renders LaTeX
const renderMessage = (content) => {
  // Split the content into segments of normal text and LaTeX formulas
  const segments = [];
  let currentText = '';
  let i = 0;
  
  // Process the content to extract LaTeX formulas
  while (i < content.length) {
    // Detect block LaTeX formula: \[formula\]
    if (content.slice(i, i + 2) === '\\[' && content.indexOf('\\]', i + 2) !== -1) {
      const end = content.indexOf('\\]', i + 2);
      if (currentText) {
        segments.push({ type: 'text', content: currentText });
        currentText = '';
      }
      segments.push({ type: 'block-math', content: content.slice(i + 2, end) });
      i = end + 2;
    } 
    // Detect inline LaTeX formula: \(formula\)
    else if (content.slice(i, i + 2) === '\\(' && content.indexOf('\\)', i + 2) !== -1) {
      const end = content.indexOf('\\)', i + 2);
      if (currentText) {
        segments.push({ type: 'text', content: currentText });
        currentText = '';
      }
      // Clean up any double escaping in the LaTeX
      let formula = content.slice(i + 2, end).replace(/\\\(/g, '(').replace(/\\\)/g, ')');
      segments.push({ type: 'inline-math', content: formula });
      i = end + 2;
    }
    // Also support the $ and $$ syntax
    else if (content.slice(i, i + 1) === '$' && content.slice(i + 1, i + 2) !== '$' && content.indexOf('$', i + 1) !== -1) {
      const end = content.indexOf('$', i + 1);
      if (currentText) {
        segments.push({ type: 'text', content: currentText });
        currentText = '';
      }
      segments.push({ type: 'inline-math', content: content.slice(i + 1, end) });
      i = end + 1;
    }
    else if (content.slice(i, i + 2) === '$$' && content.indexOf('$$', i + 2) !== -1) {
      const end = content.indexOf('$$', i + 2);
      if (currentText) {
        segments.push({ type: 'text', content: currentText });
        currentText = '';
      }
      segments.push({ type: 'block-math', content: content.slice(i + 2, end) });
      i = end + 2;
    } else {
      currentText += content[i];
      i++;
    }
  }
  
  if (currentText) {
    segments.push({ type: 'text', content: currentText });
  }
  
  return segments.map((segment, index) => {
    if (segment.type === 'inline-math') {
      try {
        return <InlineMath key={index} math={segment.content} />;
      } catch (err) {
        console.error('KaTeX error:', err);
        return <code key={index}>\({segment.content}\)</code>;
      }
    }
    
    if (segment.type === 'block-math') {
      try {
        return <BlockMath key={index} math={segment.content} />;
      } catch (err) {
        console.error('KaTeX error:', err);
        return <pre key={index}><code>\[{segment.content}\]</code></pre>;
      }
    }
    
    // Format text with markdown-like syntax
    // Handle text formatting - split by newlines
    return (
      <div key={index} className="message-text">
        {segment.content.split('\n').map((line, lineIdx) => {
          // Format lists, headers, bold, italic text
          if (line.trim() === '') {
            return <br key={`br-${lineIdx}`} />;
          }
          
          // Handle code blocks
          if (line.trim().startsWith('```')) {
            return (
              <pre key={`code-${lineIdx}`} className="bg-gray-100 dark:bg-neutral-900 p-2 rounded-md my-2 overflow-x-auto text-sm font-mono">
                {line.trim().substring(3)}
              </pre>
            );
          }
          
          // Handle inline code
          if (line.includes('`')) {
            const parts = line.split('`');
            const formatted = [];
            for (let i = 0; i < parts.length; i++) {
              if (i % 2 === 0) {
                formatted.push(parts[i]);
              } else {
                formatted.push(
                  <code key={`inline-code-${i}`} className="bg-gray-100 dark:bg-neutral-900 px-1 py-0.5 rounded text-sm font-mono">
                    {parts[i]}
                  </code>
                );
              }
            }
            return (
              <div key={`line-code-${lineIdx}`} className="my-1">
                {formatted}
              </div>
            );
          }
          
          // Handle lists (- item)
          if (line.trim().startsWith('- ')) {
            return (
              <div key={`list-${lineIdx}`} className="flex ml-2 my-1">
                <span className="mr-2">•</span>
                <span>{line.trim().substring(2)}</span>
              </div>
            );
          }
          
          // Handle headers (# Header)
          if (line.trim().startsWith('#')) {
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s+/, '');
            
            if (level === 1) {
              return <h1 key={`h-${lineIdx}`} className="text-xl font-bold my-2">{text}</h1>;
            } else if (level === 2) {
              return <h2 key={`h-${lineIdx}`} className="text-lg font-bold my-2">{text}</h2>;
            } else {
              return <h3 key={`h-${lineIdx}`} className="font-bold my-1">{text}</h3>;
            }
          }
          
          // Process bold and italic
          let processed = line;
          let elements = [];
          
          // Bold: **text**
          const boldRegex = /\*\*(.*?)\*\*/g;
          let lastIndex = 0;
          let match;
          
          while ((match = boldRegex.exec(processed)) !== null) {
            if (match.index > lastIndex) {
              elements.push(processed.substring(lastIndex, match.index));
            }
            elements.push(<strong key={`b-${match.index}`}>{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
          }
          
          if (lastIndex < processed.length) {
            elements.push(processed.substring(lastIndex));
          }
          
          return <div key={`line-${lineIdx}`} className="my-1">{elements.length > 0 ? elements : processed}</div>;
        })}
      </div>
    );
  });
};

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your academic assistant powered by AI. Ask me any questions about your engineering subjects or use the command buttons below for specific help!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCommand, setActiveCommand] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const firstName = Cookies.get("firstName") || "User";

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Apply active command to input
  useEffect(() => {
    if (activeCommand) {
      const commandPrefixes = {
        explain: 'Explain ',
        summarize: 'Summarize ',
        solve: 'Solve this problem: ',
        examples: 'Give examples of '
      };
      
      setInput(commandPrefixes[activeCommand]);
      inputRef.current?.focus();
    }
  }, [activeCommand]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setActiveCommand(null);
    setIsLoading(true);
    setError(null);
    setShowIntro(false);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/supra/ask`, {
        question: input
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });
      
      if (response.data && response.data.response) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.data.response 
        }]);
      }
    } catch (err) {
      console.error('Error querying AI:', err);
      setError(
        err.response?.data?.error || 
        'Sorry, I couldn\'t process your request. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared! How can I help you with your studies today?'
      }
    ]);
    setShowIntro(true);
  };

  const downloadChat = () => {
    // Format chat content
    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? '👤 You' : '🤖 AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      className="flex flex-col h-full min-h-screen w-full overflow-hidden" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with gradient background */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-neutral-800 p-2 rounded-full shadow-md mr-3"
          >
            <BookOpen className="h-5 w-5 text-purple-500" />
          </motion.div>
          <motion.h1 
            className="text-xl font-semibold text-white flex items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Academic AI Assistant
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              className="ml-2"
            >
              <Sparkles size={16} className="text-yellow-300" />
            </motion.span>
          </motion.h1>
        </div>
        <div className="flex items-center">
          <motion.button
            onClick={clearChat}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10"
            title="Clear chat"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-black p-4 relative">
        <div className="w-full max-w-6xl mx-auto px-4">
          {/* Floating decorative elements */}
          <div className="absolute left-0 top-0 h-full w-16 pointer-events-none opacity-10 overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center pt-8 gap-8">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 blur-sm"
                  variants={floatingBubbleVariants}
                  animate="animate"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.3 + Math.random() * 0.2
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="absolute right-0 top-0 h-full w-16 pointer-events-none opacity-10 overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center pt-16 gap-12">
              {[...Array(16)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-sm"
                  variants={floatingBubbleVariants}
                  animate="animate"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.2 + Math.random() * 0.2
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Welcome card */}
          {showIntro && (
            <motion.div 
              className="mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to your AI Academic Assistant</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  I can help you with your engineering studies, solve problems, explain concepts, and more. Try these example queries:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {[
                    "Explain the concept of Fourier Transforms",
                    "Solve this differential equation: dy/dx + 2y = x²",
                    "What are the applications of microcontrollers?",
                    "Summarize the principles of electromagnetism"
                  ].map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setInput(suggestion);
                        setActiveCommand(null);
                        inputRef.current?.focus();
                      }}
                      className="text-left px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150"
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-purple-500 mr-2">→</span>
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index}
                  message={message}
                  index={index}
                  firstName={firstName}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              className="flex justify-start mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0 shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <BookOpen className="h-4 w-4 text-white" />
              </motion.div>
              <motion.div 
                className="max-w-[85%] rounded-lg px-4 py-3 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-neutral-700 rounded-tl-none shadow-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center">
                  <TypingIndicator />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">AI is thinking...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div 
                className="max-w-[85%] rounded-lg px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-sm"
                animate={{ 
                  x: [0, -5, 5, -5, 0],
                  transition: { duration: 0.4 }
                }}
              >
                {error}
              </motion.div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Command buttons and input */}
      <motion.div 
        className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          {!isMobile && (
            <CommandBar 
              activeCommand={activeCommand}
              setActiveCommand={setActiveCommand}
              isLoading={isLoading}
            />
          )}
          
          <motion.form 
            onSubmit={handleSend} 
            className="flex space-x-2"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div className="relative flex-grow">
              <motion.input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your academic subjects..."
                className="w-full p-3 pr-10 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-200"
                disabled={isLoading}
                whileFocus={{ boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.35)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
                <CornerDownLeft className="h-4 w-4" />
              </span>
            </motion.div>
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="h-5 w-5" />
                </motion.div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </motion.form>
          
          {/* Mobile command buttons */}
          {isMobile && (
            <CommandBar 
              activeCommand={activeCommand}
              setActiveCommand={setActiveCommand}
              isLoading={isLoading}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIChatbot;