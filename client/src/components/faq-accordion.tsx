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
    question: "How do I rent a companion discreetly?",
    answer: "Easy — hit the booking button, send a message, and I'll get back to you fast. All communication stays private.",
    keywords: ["discreet", "companion", "rent", "private"]
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
    question: "Do you travel for bookings?",
    answer: "Yes, travel bookings are available near and far with advance arrangements.",
    keywords: ["travel", "booking", "outside", "getaway"]
  },
  // Additional SEO-optimized FAQs
  {
    question: "What services does a male companion offer?",
    answer: "I offer boyfriend-style companionship, engaging conversation, dinner dates, event attendance, and authentic connection. Each experience is tailored to your preferences — whether you need a charming plus-one for an event or simply good company for the evening.",
    keywords: ["male companion", "services", "boyfriend experience", "events"]
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
      <h2 className="text-3xl font-bold text-center text-[#283A2C] mb-8">
        Frequently Asked Questions
      </h2>
      
      {/* Accordion items */}
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div 
            key={index}
            className="sm-card overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#3E5F44]/5 transition-all duration-200 group"
              tabIndex={0}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {/* SEO-friendly H3 for questions */}
              <h3 className="text-[#283A2C] font-semibold text-base md:text-lg group-hover:text-[#3E5F44] transition-colors pr-4">
                {item.question}
              </h3>
              <div className={`
                transition-all 
                duration-300 
                text-[#3E5F44]
                ${openIndex === index ? 'rotate-180' : ''}
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
                <p className="text-[#6B7362] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional SEO text */}
      <div className="mt-8 text-center">
        <p className="text-[#6B7362] text-sm">
          Have more questions about companion services? 
          <button 
            className="text-[#3E5F44] hover:text-[#33503A] ml-2 underline transition-colors"
            onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact me directly
          </button>
        </p>
      </div>
    </div>
  );
}