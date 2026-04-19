"use client";

import { useState } from "react";
import { FaPlus, FaMinus, FaWhatsapp } from "react-icons/fa";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      category: "General",
      items: [
        {
          q: "How to top-up Free Fire diamonds?",
          a: "Enter your Free Fire Player ID, select your desired diamond package, and complete the payment."
        },
        {
          q: "Do I need to log in to my Free Fire account?",
          a: "No. শুধুমাত্র Player ID দিলেই হবে। কখনোই আপনার password শেয়ার করবেন না।"
        },
        {
          q: "Is this website safe?",
          a: "Yes, we are a trusted third-party top-up service. Your account remains completely safe."
        }
      ]
    },
    {
      category: "Payment",
      items: [
        {
          q: "What payment methods are available?",
          a: "We support bKash, Nagad, Rocket, and other local payment methods."
        },
        {
          q: "Payment successful but diamonds not received?",
          a: "Usually delivery instant হয়। 5–10 মিনিট অপেক্ষা করুন। তারপরও না পেলে support-এ যোগাযোগ করুন।"
        },
        {
          q: "Can I cancel my order?",
          a: "Payment complete হওয়ার পর order cancel করা সম্ভব না।"
        }
      ]
    },
    {
      category: "Delivery",
      items: [
        {
          q: "How long does it take to receive diamonds?",
          a: "Most orders are delivered instantly. কখনো কখনো 10–15 মিনিট সময় লাগতে পারে।"
        },
        {
          q: "Why is my order delayed?",
          a: "Server issue বা payment verification এর কারণে delay হতে পারে।"
        }
      ]
    },
    {
      category: "Security",
      items: [
        {
          q: "Is my account safe?",
          a: "Yes. আমরা কখনো password বা login info চাই না। শুধুমাত্র Player ID লাগে।"
        },
        {
          q: "Do you store my data?",
          a: "We only store necessary order information for support purposes."
        }
      ]
    },
    {
      category: "Refund",
items: [
  {
    q: "❓ Can I get a refund?",
    a: "Refund is only applicable if the diamond delivery fails or the order cannot be processed successfully. In such cases, the refund will be credited to your wallet balance for future use on our platform. We do not provide cash refunds."
  },
  {
    q: "How long does refund take?",
    a: "Refunds are usually processed within 1–2 working hours after verification of the issue. In rare cases, it may take longer depending on system or payment status."
  }
]
    }
  ];

  const filteredFaqs = faqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    )
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* 🔥 Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500">
          Free Fire diamond top-up related common questions & answers
        </p>
      </div>

      {/* 🔍 Search */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search your question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* 📚 FAQ Sections */}
      {filteredFaqs.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-10">

          <h2 className="text-2xl font-semibold mb-4 text-red-500">
            {section.category}
          </h2>

          <div className="space-y-3">
            {section.items.map((item, index) => {
              const currentIndex = `${sectionIndex}-${index}`;

              return (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === currentIndex ? null : currentIndex)
                    }
                    className="w-full text-left px-5 py-4 flex justify-between items-center font-medium hover:bg-gray-50 transition"
                  >
                    <span>{item.q}</span>
                    <span className="text-red-500">
                      {openIndex === currentIndex ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>

                  {openIndex === currentIndex && (
                    <div className="px-5 pb-4 text-gray-600 border-t leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      ))}

      {/* 💬 Support Section */}
      <div className="mt-16 text-center bg-gray-50 p-8 rounded-xl">
        <h3 className="text-2xl font-semibold mb-2">
          Still need help?
        </h3>
        <p className="text-gray-500 mb-5">
          আমাদের support team 24/7 available আছে
        </p>

        <a
          href="https://wa.me/8801317956376"
          target="_blank"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp />
          Contact Support
        </a>
      </div>

    </div>
  );
}