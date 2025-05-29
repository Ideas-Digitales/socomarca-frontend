interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AmountFilter({
  value,
  onChange,
  placeholder = 'Montos',
  className = '',
}: AmountInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-gray-100 w-full p-[10px] h-10 text-gray-500 text-md rounded ${className} [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]`}
    />
  );
}
