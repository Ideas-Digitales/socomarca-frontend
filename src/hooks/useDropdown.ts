import { useState, useRef, useEffect, RefObject } from 'react';

export interface UseDropdownReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  ref: RefObject<HTMLDivElement | null>;
}

export function useDropdown(): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    toggle,
    close,
    open,
    ref,
  };
}
