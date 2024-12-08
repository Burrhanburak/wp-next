
'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlusIcon from "./icons/PlusIcon";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <div 
        className="w-full rounded-xl overflow-hidden"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgb(245, 245, 245)",
          backgroundColor: "rgb(250, 250, 250)",
          borderRadius: "12px"
        }}
      >
        <button
          className="w-full py-6 px-6 text-left flex justify-between items-center hover:bg-gray-50 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg font-medium text-[#5b5f59]">{question}</span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`ml-2 flex items-center justify-center ${isOpen ? 'text-green-500' : 'text-[#5b5f59]'}`}
            style={{ 
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
              width: "24px",
              height: "24px"
            }}
          >
            <PlusIcon />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="p-6 bg-[#fafafa]">
                <p className="text-gray-600">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What is WhatsApp Bulk Messaging?",
      answer: "WhatsApp Bulk Messaging is a service that allows you to send messages to multiple recipients simultaneously through WhatsApp. It's perfect for businesses looking to reach their customers efficiently through broadcast messages, promotional content, or important updates."
    },
    {
      question: "How many messages can I send per day?",
      answer: "The number of messages you can send depends on your subscription plan. The Starter plan allows up to 1,000 messages per day, Pro plan allows up to 5,000 messages per day, and Enterprise plan offers unlimited messaging with custom limits based on your needs."
    },
    {
      question: "Is this service compliant with WhatsApp's policies?",
      answer: "Yes, our service is fully compliant with WhatsApp's Business API policies. We ensure that all messages are sent according to WhatsApp's guidelines and best practices to maintain the highest quality of service and prevent any potential blocks."
    },
    {
      question: "Can I schedule messages for later?",
      answer: "Yes, all our plans include message scheduling functionality. You can schedule messages to be sent at specific times and dates, making it perfect for planned campaigns and automated customer communications."
    },
    {
      question: "Do you provide message templates?",
      answer: "Yes, we provide a variety of pre-approved message templates that you can use for different purposes. You can also create and save your own custom templates for future use, making it easier to maintain consistent communication."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer different levels of support based on your plan. Starter plan includes email support, Pro plan includes priority email and chat support, and Enterprise plan includes dedicated support with a personal account manager available 24/7."
    }
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        {/* FAQ Title Button */}
        <div className="flex justify-center mb-12">
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 border border-[#EAEAEA] bg-white rounded-[999px] text-xs"
            style={{
              boxShadow: "inset 0px -4px 16px 0px rgba(159, 232, 112, 0.1)"
            }}
            tabIndex={0}
          >
            <span className="text-[#070C03] font-medium">
              Friendly Asked Questions
            </span>
          </button>
        </div>

        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Find answers to common questions about our WhatsApp Bulk Messaging service
        </p>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
