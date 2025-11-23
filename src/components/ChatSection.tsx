import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";

// API Configuration
const API_BASE_URL = 'https://faissrag.onrender.com';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FullPageChatbot = () => {
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
    <div className="w-full h-screen bg-gradient-to-br from-purple-600 via-orange-500 to-purple-700 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-orange-600 text-white p-4 sm:p-6 flex items-center justify-between flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="text-orange-600" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-2xl">Shyampari Edutech</h1>
            <p className="text-xs sm:text-sm text-orange-100">Online Support</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div
              className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 sm:px-5 py-3 sm:py-4 rounded-2xl ${
                message.isUser
                  ? "bg-white text-purple-900 rounded-br-none shadow-md"
                  : "bg-purple-100 text-purple-900 rounded-bl-none shadow-md"
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
              <p className="text-xs text-purple-600 mt-2">
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
            <div className="bg-purple-100 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl rounded-bl-none shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <p className="text-xs sm:text-sm text-orange-100 mb-3">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(question);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                disabled={isLoading}
                className="text-xs sm:text-sm text-left p-2.5 sm:p-3 bg-white hover:bg-orange-50 active:bg-orange-100 text-orange-700 rounded-lg transition-colors disabled:opacity-50 font-medium shadow-md"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 sm:p-6 flex-shrink-0 bg-gradient-to-t from-purple-900 to-transparent">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 border-2 border-white bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-white hover:bg-orange-50 active:bg-orange-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-orange-600 p-3 sm:p-3.5 rounded-full transition-colors flex-shrink-0 font-bold shadow-md"
            aria-label="Send message"
          >
            <Send size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullPageChatbot;
