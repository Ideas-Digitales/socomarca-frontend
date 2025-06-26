import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'grid' | 'cart';
}

export default function FavoriteButton({
  isFavorite,
  onToggle,
  disabled = false,
  size = 'md',
  variant = 'default'
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'w-[24px] h-[24px] p-[4px]',
    md: 'w-[30px] h-[30px] p-[6px]',
    lg: 'w-[36px] h-[36px] p-[8px]'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  const getColors = () => {
    if (variant === 'grid') {
      return {
        inactive: '#475569',
        active: '#7ccf00'
      };
    }
    return {
      inactive: '#475569',
      active: '#7ccf00'
    };
  };

  const colors = getColors();
  const IconComponent = isFavorite ? HeartIconSolid : HeartIcon;

  return (
    <div className={`rounded-full bg-slate-100 items-center justify-center flex ${sizeClasses[size]} ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    }`}>
      <IconComponent
        className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        color={isFavorite ? colors.active : colors.inactive}
        width={iconSizes[size]}
        height={iconSizes[size]}
        onClick={disabled ? undefined : onToggle}
      />
    </div>
  );
}
