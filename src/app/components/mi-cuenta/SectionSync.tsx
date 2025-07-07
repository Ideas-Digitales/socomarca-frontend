'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SectionSync({
  setSelected,
  validSections,
}: {
  setSelected: (section: string) => void;
  validSections: string[];
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam && validSections.includes(sectionParam)) {
      setSelected(sectionParam);
    }
  }, [searchParams, setSelected, validSections]);

  return null;
}
