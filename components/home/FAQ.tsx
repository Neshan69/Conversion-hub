"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border/50 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left hover:bg-accent/5 transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground group-hover:text-primary transition-colors pr-4">
          {question}
        </span>
        <span className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-primary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pb-5 text-muted-foreground leading-relaxed">
              <p>{answer}</p>
            </div>
          </motion>
        </AnimatePresence>
      </AnimatePresence>
    </motion.div>
  );
}

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is Conversion Hub?",
        a: "Conversion Hub is your all-in-one platform for fast, accurate, and free online conversions. We offer tools for units, currencies, and data formats — designed with precision and user experience in mind."
      },
      {
        q: "Are your conversion tools free to use?",
        a: "Yes! All conversion tools on Conversion Hub are completely free with no limits, no sign-up required, and no hidden costs."
      },
      {
        q: "How accurate are your converters?",
        a: "Our converters use precise conversion factors based on international standards. Currency rates update every 15 minutes from multiple trusted APIs. Unit conversions use NIST-standard factors."
      },
      {
        q: "Is my data safe?",
        a: "Absolutely. We don't collect or store any personal data. All conversions happen locally in your browser. We never share your information with third parties."
      }
    ]
  },
  {
    category: "Currencies",
    items: [
      {
        q: "How often are exchange rates updated?",
        a: "Exchange rates are automatically refreshed every 15 minutes when you have an internet connection. You can also manually refresh at any time."
      },
      {
        q: "What happens when I'm offline?",
        a: "When offline, our converter uses the last cached rates from your localStorage. You'll see a notification indicating you're viewing cached data."
      },
      {
        q: "How many currencies do you support?",
        a: "We support 180+ world currencies including all major ISO 4217 currencies, cryptocurrencies, and many regional currencies."
      },
      {
        q: "Why do exchange rates fluctuate?",
        a: "Exchange rates change due to many factors including interest rate decisions by central banks, economic data releases, geopolitical events, trade balances, and market sentiment. Our AI Insights feature helps explain these movements."
      }
    ]
  },
  {
    category: "Unit Conversions",
    items: [
      {
        q: "How do I convert between units?",
        a: "Select the category (Length, Weight, Temperature, etc.), enter your value, choose source and target units, and get instant results."
      },
      {
        q: "What unit categories do you support?",
        a: "We support Length, Weight, Temperature, Speed, Area, Volume, Time, and Storage — covering both metric and imperial systems."
      },
      {
        q: "Can I convert between different unit systems?",
        a: "Yes! Our converters seamlessly convert between metric and imperial units. For example, convert kilometers to miles or Celsius to Fahrenheit."
      }
    ]
  },
  {
    category: "Features & Privacy",
    items: [
      {
        q: "Do you store my conversion history?",
        a: "Your recent conversions are stored locally in your browser using localStorage for quick access. We don't send or store any data on our servers."
      },
      {
        q: "Can I use this on mobile?",
        a: "Yes! Conversion Hub is fully responsive and optimized for all devices. Touch-friendly controls ensure smooth mobile usage."
      },
      {
        q: "What keyboard shortcuts are available?",
        a: "Press '/' or Ctrl+K to focus search, 'S' to swap currencies in the converter, and Enter to select items in dropdown menus."
      }
    ]
  }
];

export function FAQAccordion() {
  return (
    <div className="max-w-3xl mx-auto space-y-2">
      {faqs.map((section, catIndex) => (
        <div key={catIndex} className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-xl">
              {catIndex === 0 ? "📋" : catIndex === 1 ? "💱" : catIndex === 2 ? "📏" : "🔒"}
            </span>
            {section.category}
          </h3>
          <div className="space-y-1">
            {section.items.map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}