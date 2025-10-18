import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Minimize2 } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
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
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle size={24} className="sm:w-7 sm:h-7" />
        </button>
      )}

      {/* Chat Window - Properly sized for mobile */}
      {isOpen && (
        <div 
          className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden
            ${isMinimized 
              ? 'w-80 sm:w-80 h-16' 
              : 'w-[calc(100vw-2rem)] max-w-[380px] sm:w-96'
            }`}
          style={{
            height: isMinimized ? '64px' : 'min(600px, calc(100vh - 8rem))',
            maxHeight: isMinimized ? '64px' : 'calc(100vh - 8rem)'
          }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-blue-600" size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-lg truncate">Shyampari Edutech</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-700 p-1.5 sm:p-2 rounded-lg transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1.5 sm:p-2 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50"
                style={{ 
                  minHeight: '200px',
                  maxHeight: 'calc(100% - 180px)' 
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                        message.isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
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
                    <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-none shadow-sm">
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
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-2">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(question);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        disabled={isLoading}
                        className="text-[10px] sm:text-xs text-left p-1.5 sm:p-2 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area - Fixed at bottom */}
              <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 sm:p-2.5 rounded-full transition-colors flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleChatbot;
