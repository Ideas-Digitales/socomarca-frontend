import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface AddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  quantity?: number;
  variant?: 'default' | 'full-width';
  size?: 'sm' | 'md';
  text?: {
    default?: string;
    loading?: string;
    success?: string;
  };
}

export default function AddToCartButton({
  onClick,
  disabled = false,
  isLoading = false,
  isSuccess = false,
  quantity = 0,
  variant = 'default',
  size = 'md',
  text = {},
}: AddToCartButtonProps) {
  const {
    default: defaultText = 'Agregar al carro',
    success: successText = '✓ Agregado',
  } = text;

  const isDisabled = disabled || quantity === 0 || isLoading;

  const sizeClasses = {
    sm: 'h-[28px] text-[11px]',
    md: 'h-[32px] text-[12px]',
  };

  const widthClass = variant === 'full-width' ? 'w-full' : 'w-auto';

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <span className="animate-spin">
          <ArrowPathIcon width={16} />
        </span>
      );
    }

    if (isSuccess) {
      return successText;
    }

    return defaultText;
  };

  const getButtonClass = () => {
    const baseClass = `flex ${widthClass} p-2 flex-col justify-center items-center rounded-[6px] text-white ${sizeClasses[size]} cursor-pointer disabled:cursor-not-allowed transition-all duration-300 ease-in-out`;

    if (isSuccess) {
      return `${baseClass} bg-lime-500`;
    }

    return `${baseClass} bg-lime-500 hover:bg-[#257f00] disabled:bg-lime-500`;
  };

  return (
    <button
      data-cy="add-to-cart-btn"
      onClick={onClick}
      disabled={isDisabled}
      className={getButtonClass()}
    >
      {getButtonContent()}
    </button>
  );
}
