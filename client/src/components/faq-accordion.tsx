import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  keywords?: string[]; // For SEO tracking
}

const faqData: FAQItem[] = [
  // SEO-specific FAQs from the document
  {
    question: "How do I rent a companion in Austin discreetly?",
    answer: "Easy — hit the booking button, send a message, and I'll get back to you fast. All communication stays private.",
    keywords: ["austin", "discreet", "companion", "rent", "private"]
  },
  {
    question: "What does LGBTQ-friendly companion mean?",
    answer: "It means this is a safe, inclusive space for everyone. No judgment, just genuine connection.",
    keywords: ["lgbtq", "friendly", "inclusive", "safe", "companion"]
  },
  {
    question: "What's a 'twunk' escort?",
    answer: "It's shorthand for someone who's a mix of twink and hunk — youthful, fit, and confident. That's me in a nutshell.",
    keywords: ["twunk", "escort", "twink", "hunk", "youthful"]
  },
  {
    question: "Can I book you outside of Austin?",
    answer: "Yes, travel bookings are available across Texas (and beyond) with arrangements.",
    keywords: ["travel", "booking", "texas", "austin", "outside"]
  },
  // Additional SEO-optimized FAQs
  {
    question: "What services does a male companion in Austin offer?",
    answer: "I offer boyfriend-style companionship, engaging conversation, dinner dates, event attendance, and authentic connection. Each experience is tailored to your preferences — whether you need a charming plus-one for an event or simply good company for the evening.",
    keywords: ["male companion", "austin", "services", "boyfriend experience", "events"]
  },
  {
    question: "How much notice do you need for bookings?",
    answer: "While I appreciate 24-48 hours advance notice for most bookings, I understand spontaneous moments happen. Same-day bookings may be available depending on my schedule. For overnight or weekend plans, please book at least 3-5 days in advance.",
    keywords: ["booking", "notice", "advance", "same-day", "schedule"]
  },
  {
    question: "Are you available for overnight or extended dates?",
    answer: "Yes! I'm available for overnights and extended dates. These longer experiences allow for genuine connection and create memorable moments. Whether it's a special evening, overnight, or weekend getaway, I'm here to make it special.",
    keywords: ["overnight", "weekend", "trips", "extended", "travel"]
  },
  {
    question: "Do you offer virtual companionship services?",
    answer: "Yes, I offer virtual companionship for those who prefer online connection or when distance is a factor. This includes video calls, engaging conversation, and maintaining our connection between in-person meetings. It's perfect for busy professionals or long-distance arrangements.",
    keywords: ["virtual", "online", "video", "distance", "companionship"]
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* SEO-friendly H2 section title */}
      <h2 className="text-2xl font-bold text-center text-white mb-8">
        Frequently Asked Questions
      </h2>
      
      {/* Accordion items */}
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div 
            key={index}
            className={`
              glass-effect 
              border border-white/20 
              rounded-2xl 
              overflow-hidden 
              transition-all 
              duration-300 
              hover:border-purple-400/40
              ${openIndex === index ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20' : 'bg-black/40'}
            `}
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-200 group"
              tabIndex={0}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {/* SEO-friendly H3 for questions */}
              <h3 className="text-white font-semibold text-base md:text-lg group-hover:text-purple-300 transition-colors pr-4">
                {item.question}
              </h3>
              <div className={`
                transition-all 
                duration-300 
                ${openIndex === index ? 'rotate-180 text-purple-400' : 'text-gray-400 group-hover:text-purple-400'}
              `}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            
            {/* Animated answer panel */}
            <div 
              id={`faq-answer-${index}`}
              className={`
                transition-all 
                duration-300 
                ease-in-out
                ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}
              style={{
                overflow: 'hidden'
              }}
            >
              <div className="px-6 pb-5">
                <p className="text-gray-200 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional SEO text */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Have more questions about companion services in Austin? 
          <button 
            className="text-purple-400 hover:text-purple-300 ml-2 underline transition-colors"
            onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact me directly
          </button>
        </p>
      </div>
    </div>
  );
}