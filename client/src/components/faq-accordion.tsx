import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do you travel?",
    answer: "Yes. Local, U.S., and international when travel + room handled in advance."
  },
  {
    question: "Kink friendly?", 
    answer: "Open to explore; we talk limits first in screening."
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {faqData.map((item, index) => (
        <div 
          key={index}
          className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            tabIndex={0}
            aria-expanded={openIndex === index}
          >
            <span className="text-white font-medium">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4">
              <p className="text-gray-300 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}