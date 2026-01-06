"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I find the nearest EV charging station?",
      answer: "Use our interactive map to locate charging stations near you. You can also use our AI chatbot for personalized recommendations based on your location."
    },
    {
      question: "What types of charging connectors are available?",
      answer: "Most stations support Type 2 AC charging and CCS DC fast charging. Some older stations may have CHAdeMO connectors. Check station details before visiting."
    },
    {
      question: "How long does it take to charge an EV?",
      answer: "Charging time depends on your battery size and charger type. AC charging (3-22kW) takes 4-8 hours, while DC fast charging (50-150kW) takes 30-60 minutes for 80% charge."
    },
    {
      question: "Are the charging stations free to use?",
      answer: "Most public charging stations charge a fee. Rates vary by network provider, typically ₹8-15 per kWh for AC charging and ₹12-20 per kWh for DC fast charging."
    },
    {
      question: "Can I reserve a charging slot in advance?",
      answer: "Some networks like Tata Power and Ather Grid offer slot booking through their mobile apps. Check with the specific network provider for reservation options."
    },
    {
      question: "What should I do if a charging station is not working?",
      answer: "Report the issue through the network provider's app or customer service. You can also use our chatbot to find alternative nearby stations."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-black via-black to-black relative">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-green-900/10 to-transparent"></div>
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-up">Frequently Asked Questions</h2>
          <p className="text-gray-300 text-lg animate-slide-up-delay">Everything you need to know about EV charging</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 hover:border-green-400/30 transition-all duration-500 hover:shadow-lg hover:shadow-green-400/10 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center group transition-all duration-300"
              >
                <span className="font-semibold text-gray-100 group-hover:text-green-300 transition-colors duration-300">{faq.question}</span>
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-green-300 animate-spin-once" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-green-300 transition-colors duration-300" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-4 border-t border-white/10 animate-fade-in">
                  <p className="text-gray-200 leading-relaxed pt-4 transform transition-transform duration-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to { transform: rotate(180deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-spin-once {
          animation: spin-once 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}