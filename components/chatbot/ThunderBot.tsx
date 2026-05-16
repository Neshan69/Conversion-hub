"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
}

export function ThunderBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "⚡ Welcome to Thunder Bot! I can help you with currency conversions, unit conversions, and financial insights. What can I help you with today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate bot response (can be replaced with actual API call)
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: botResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input_lower = userInput.toLowerCase();

    if (input_lower.includes("hello") || input_lower.includes("hi")) {
      return "Hey there! ⚡ I'm Thunder Bot. How can I assist you with conversions or financial insights today?";
    }

    if (input_lower.includes("currency")) {
      return "💱 I can help with currency conversions! Just visit our Currency Converter page where you can convert between over 150 currencies with real-time rates.";
    }

    if (input_lower.includes("convert")) {
      return "🔄 We offer multiple converters:\n• Currency Converter (real-time rates)\n• Unit Converter (length, weight, temperature, etc.)\n• Crypto Converter (Bitcoin, Ethereum, and more)\n\nWhich would you like to use?";
    }

    if (input_lower.includes("unit")) {
      return "📏 Our Unit Converter supports:\n• Length (meters, feet, miles, etc.)\n• Weight (kg, lbs, tons, etc.)\n• Temperature (°C, °F, K)\n• Volume, Speed, and more!\n\nVisit /unit to start converting!";
    }

    if (input_lower.includes("help")) {
      return "📚 Here's what I can help with:\n✓ Currency conversions & rates\n✓ Unit conversions\n✓ Crypto exchange rates\n✓ Financial insights\n✓ Search for specific conversions\n\nWhat interests you?";
    }

    if (input_lower.includes("exchange rate")) {
      return "📈 Exchange rates update in real-time! You can:\n• View live rates on the Currency page\n• Check historical trends\n• Get insights on factors affecting rates\n• Compare multiple currency pairs\n\nVisit /currency to explore!";
    }

    if (input_lower.includes("crypto")) {
      return "🪙 We support multiple cryptocurrencies including:\n• Bitcoin (BTC)\n• Ethereum (ETH)\n• Litecoin (LTC)\n• And many more!\n\nCheck our Crypto Converter page for live rates!";
    }

    return "⚡ Thanks for your question! I'm here to help with currency conversions, unit conversions, and financial insights. Feel free to ask me anything about our converters or features!";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-96 h-[600px] mb-4 bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/80 to-primary/60 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Thunder Bot</h3>
                  <p className="text-xs text-primary-foreground/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2.5">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-muted border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground p-2.5 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
