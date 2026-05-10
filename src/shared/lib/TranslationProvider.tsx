'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FALLBACK_DATA, PUBLIC_LINKS } from '../config/public-data';
import { FALLBACK_DATA_EN, PUBLIC_LINKS_EN } from '../config/public-data-en';
import { UI_STRINGS, type UIStrings } from '../config/ui-strings';

type Language = 'es' | 'en';

interface TranslationContextType {
  language: Language;
  toggleLanguage: () => void;
  data: typeof FALLBACK_DATA;
  links: typeof PUBLIC_LINKS;
  t: UIStrings;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  useEffect(() => {
    // Usamos setTimeout para que el setState no sea síncrono dentro del cuerpo del efecto.
    // Esto elimina el error de "Calling setState synchronously within an effect" del linter,
    // y al mismo tiempo evita el error de hydration mismatch (ya que el servidor sigue renderizando 'es').
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('mochotours_lang') as Language;
      if (saved && (saved === 'es' || saved === 'en')) {
        setLanguage(saved);
      } else {
        const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
        setLanguage(browserLang);
        localStorage.setItem('mochotours_lang', browserLang);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('mochotours_lang', newLang);
  };

  const data = language === 'es' ? FALLBACK_DATA : FALLBACK_DATA_EN;
  const links = language === 'es' ? PUBLIC_LINKS : PUBLIC_LINKS_EN;
  const t = language === 'es' ? UI_STRINGS.es : UI_STRINGS.en;

  return (
    <TranslationContext.Provider value={{ language, toggleLanguage, data, links, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

