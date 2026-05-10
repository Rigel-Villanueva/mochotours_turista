'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/shared/lib/TranslationProvider';

// ── Accordion Item ──────────────────────────────────────────────────

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
  isVisible,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const targetHeight = isOpen ? contentRef.current.scrollHeight : 0;
      setTimeout(() => setMaxHeight(targetHeight), 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`border-b border-stone-200 last:border-b-0 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm sm:text-base lg:text-lg font-medium leading-snug transition-colors ${
            isOpen ? 'text-primary' : 'text-stone-800 group-hover:text-primary'
          }`}
        >
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <div ref={contentRef} className="pb-5 sm:pb-6 pr-10">
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Section ─────────────────────────────────────────────────────

export function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0); // Primera abierta por defecto
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // JSON-LD FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section
      ref={sectionRef}
      className="bg-stone-50 py-20 lg:py-28"
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Encabezado */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            {t.faq.label}
          </span>
          <h2 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mt-3">
            {t.faq.heading}
          </h2>
        </div>

        {/* Acordeón */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 px-5 sm:px-8">
          {t.faq.items.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
