"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Conversion Hub?",
        a: "Conversion Hub is your all-in-one platform for fast, accurate, and free online conversions. We offer tools for units, currencies, files, images, and data formats. Our tools are designed with precision and user experience in mind, providing instant results with a beautiful, modern interface."
      },
      {
        q: "Are your conversion tools free to use?",
        a: "Yes, absolutely! All conversion tools on Conversion Hub are completely free with no limits. We believe essential tools should be accessible to everyone without restrictions or hidden costs."
      },
      {
        q: "How accurate are your converters?",
        a: "Our converters use precise conversion factors based on international standards. For unit conversions, we use factors defined by NIST and other standard bodies. Currency rates update daily. All calculations are performed with high precision to ensure accuracy."
      }
    ]
  },
  {
    category: "Unit Converters",
    questions: [
      {
        q: "How do I convert between different units?",
        a: "Simply select the category (like Length, Weight, Temperature), enter your value, choose the source and target units, and our tool will instantly calculate the conversion. You can copy the result with one click."
      },
      {
        q: "What unit categories do you support?",
        a: "We support Length, Weight, Temperature, Speed, Area, Volume, Time, and Storage conversions. Each category includes comprehensive unit options from both metric and imperial systems."
      },
      {
        q: "Why is my temperature conversion not working?",
        a: "Temperature conversions require special handling due to offset values. Our engine properly converts between Celsius, Fahrenheit, and Kelvin using accurate formulas: C = (F - 32) × 5/9 and K = C + 273.15."
      }
    ]
  },
  {
    category: "Features & Usage",
    questions: [
      {
        q: "Can I use Conversion Hub on mobile?",
        a: "Yes! Conversion Hub is fully responsive and optimized for all devices—desktop, tablet, and mobile. Our mobile-first design ensures a smooth experience on any screen size with touch-friendly controls."
      },
      {
        q: "Do you store my conversion history?",
        a: "Your recent conversions are stored locally in your browser using localStorage for quick access, but we don't store any personal data on our servers. You can clear your history at any time."
      },
      {
        q: "How do I copy a conversion result?",
        a: "Simply click the copy button next to the result field. It will be copied to your clipboard instantly. A checkmark will confirm successful copying."
      }
    ]
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Conversion Hub
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {category.category}
              </h3>
              {category.questions.map((faq, index) => {
                const globalIndex = catIndex * 10 + index;
                const isOpen = openIndex === globalIndex;

                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: globalIndex * 0.05 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/5 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-foreground pr-4">
                        {faq.q}
                      </span>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}