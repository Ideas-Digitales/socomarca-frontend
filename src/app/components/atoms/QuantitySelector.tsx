interface QuantitySelectorProps {
  quantity: number;
  minQuantity?: number;
  maxQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  quantity,
  minQuantity = 0,
  maxQuantity,
  onDecrease,
  onIncrease,
  onChange,
  disabled = false,
  size = 'md'
}: QuantitySelectorProps) {
  const isDecreaseDisabled = disabled || quantity <= minQuantity;
  const isIncreaseDisabled = disabled || quantity >= maxQuantity;
  
  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-8 h-8 text-sm'
  };

  const buttonClass = sizeClasses[size];
  const inputClass = size === 'sm' ? 'w-6 h-7 text-xs' : 'w-8 h-8 text-sm';

  return (
    <div className="flex items-center gap-1">
      <button
        data-cy="quantity-decrease-btn"
        disabled={isDecreaseDisabled}
        className={`flex ${buttonClass} justify-center items-center rounded-[6px] transition-all duration-200 ${
          isDecreaseDisabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            : 'bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700'
        }`}
        onClick={onDecrease}
      >
        <span>-</span>
      </button>

      {size === 'sm' ? (
        <span className={`${inputClass} flex items-center justify-center font-medium`}>
          {quantity}
        </span>
      ) : (
        <input
          data-cy="quantity-input"
          type="number"
          min={minQuantity}
          max={maxQuantity}
          value={quantity}
          onChange={onChange}
          disabled={disabled}
          className={`${inputClass} text-center border border-slate-300 rounded-[4px] focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 mx-0 p-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${
            disabled ? 'bg-slate-100 cursor-not-allowed' : ''
          }`}
          placeholder="0"
        />
      )}

      <button
        data-cy="quantity-increase-btn"
        disabled={isIncreaseDisabled}
        className={`flex ${buttonClass} justify-center items-center rounded-[6px] transition-all duration-200 ${
          isIncreaseDisabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            : 'bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700'
        }`}
        onClick={onIncrease}
      >
        <span>+</span>
      </button>
    </div>
  );
}
