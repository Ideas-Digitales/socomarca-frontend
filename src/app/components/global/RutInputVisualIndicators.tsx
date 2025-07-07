'use client';
import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';

interface RutInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  errorMessage?: string;
  className?: string;
}

const validateRut = (rut: string): boolean => {
  if (!/^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9kK]$/.test(rut)) return false;

  const cleanRut = rut.replace(/\./g, '').replace('-', '');
  const rutBody = parseInt(cleanRut.slice(0, -1), 10);
  const dv = cleanRut.slice(-1).toLowerCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = rutBody.toString().length - 1; i >= 0; i--) {
    sum += parseInt(rutBody.toString().charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  const calculatedDv =
    expectedDv === 11 ? '0' : expectedDv === 10 ? 'k' : expectedDv.toString();

  return dv === calculatedDv;
};

export const rutRule = {
  validator: (_: unknown, value: string) =>
    validateRut(value) ? Promise.resolve() : Promise.reject('RUT inválido'),
};

export const formatRut = (rut: string): string => {
  const cleanedRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanedRut.length <= 1) return cleanedRut;

  const body = cleanedRut.slice(0, -1);
  const dv = cleanedRut.slice(-1);

  let formattedBody = '';
  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body.charAt(i) + formattedBody;
    if ((body.length - i) % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody;
    }
  }

  return `${formattedBody}-${dv}`;
};

const RutInput: React.FC<RutInputProps> = ({
  value,
  onChange,
  onValidationChange,
  className,
  errorMessage = 'RUT inválido',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const validateInput = useCallback((rutValue: string): void => {
    if (!rutValue || rutValue.length < 3) {
      setIsValid(true);
      if (onValidationChange) {
        onValidationChange(false);
      }
      return;
    }

    const valid = validateRut(rutValue);
    setIsValid(valid);

    if (onValidationChange) {
      onValidationChange(valid);
    }
  }, [onValidationChange]);

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
      validateInput(value);
    }
  }, [value, internalValue, validateInput]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const rawValue = e.target.value;
    const formattedValue = formatRut(rawValue);

    setInternalValue(formattedValue);
    setIsDirty(true);
    validateInput(formattedValue);

    if (onChange) {
      onChange(formattedValue);
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        className={`w-full border bg-[#EBEFF7] ${
          !isValid && isDirty ? 'border-red-500' : 'border-[#EBEFF7]'
        } p-[10px] h-[40px] focus:outline-none focus:ring-1 focus:ring-[#EBEFF7] focus:border-[#EBEFF7] ${
          className || ''
        }`}
        {...props}
      />
      {!isValid && isDirty && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default RutInput;
