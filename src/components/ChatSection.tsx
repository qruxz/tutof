import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";

// API Configuration
const API_BASE_URL = 'https://tutob.onrender.com';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SimpleChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help you with information about Shyampari Edutech. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        response: 'Sorry, I\'m having trouble connecting to the server. Please try again later.',
        success: false,
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || "Sorry, I couldn't process that. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What services do you offer?",
    "How do I book a demo?",
    "What boards do you support?",
    "Tell me about your tutors",
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Chat Window - Always Open */}
      <div 
        className={`bg-white rounded-tl-xl sm:rounded-tl-2xl shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200
          ${isMinimized 
            ? 'w-64 sm:w-80 h-14 sm:h-16' 
            : 'w-[calc(100vw-2rem)] sm:w-80 md:w-96'
          }`}
        style={{
          height: isMinimized ? 'auto' : 'clamp(400px, 70vh, 600px)',
          maxHeight: isMinimized ? '64px' : '70vh'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="text-blue-600" size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-xs sm:text-base truncate">Shyampari Edutech</h3>
              {!isMinimized && <p className="text-xs text-blue-100">Online</p>}
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-800 p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0"
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? (
              <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            ) : (
              <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            )}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl ${
                      message.isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                    <p
                      className={`text-[10px] sm:text-xs mt-1 ${
                        message.isUser ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-2 sm:p-3 bg-white border-t border-gray-200 flex-shrink-0">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-2 px-1">Quick questions:</p>
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(question);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      disabled={isLoading}
                      className="text-[9px] sm:text-xs text-left p-1.5 sm:p-2 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50 font-medium"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-2.5 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type message..."
                  disabled={isLoading}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 sm:p-2.5 rounded-full transition-colors flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleChatbot;
