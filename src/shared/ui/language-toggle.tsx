'use client';

import { useTranslation } from '@/shared/lib/TranslationProvider';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors shadow-sm border border-stone-200"
      aria-label="Toggle language / Cambiar idioma"
      suppressHydrationWarning
    >
      <Globe className="w-4 h-4 text-stone-500" />
      <span className="w-5 text-center" suppressHydrationWarning>
        {language === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  );
}
