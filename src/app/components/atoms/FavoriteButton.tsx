import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  isFavorite: boolean | null; // null indica estado de carga
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
  variant = 'default',
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'w-[24px] h-[24px] p-[4px]',
    md: 'w-[30px] h-[30px] p-[6px]',
    lg: 'w-[36px] h-[36px] p-[8px]',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const getColors = () => {
    if (variant === 'grid') {
      return {
        inactive: '#475569',
        active: '#7ccf00',
        loading: '#94a3b8', // Color más claro para estado de carga
      };
    }
    return {
      inactive: '#475569',
      active: '#7ccf00',
      loading: '#94a3b8', // Color más claro para estado de carga
    };
  };

  const colors = getColors();
  
  // Si está en estado de carga (null), mostrar ícono desactivado
  const isLoading = isFavorite === null;
  const isActive = isFavorite === true;
  
  const IconComponent = isActive ? HeartIconSolid : HeartIcon;

  // Determinar el color del ícono
  const getIconColor = () => {
    if (isLoading) return colors.loading;
    if (isActive) return colors.active;
    return colors.inactive;
  };

  // Determinar las clases del contenedor
  const getContainerClasses = () => {
    const baseClasses = `rounded-full items-center justify-center flex ${sizeClasses[size]}`;
    
    if (isLoading) {
      // Estado de carga: fondo diferente y animación de pulso
      return `${baseClasses} bg-slate-200 animate-pulse cursor-not-allowed`;
    } else if (disabled) {
      return `${baseClasses} bg-slate-100 opacity-50 cursor-not-allowed`;
    } else {
      return `${baseClasses} bg-slate-100 cursor-pointer`;
    }
  };

  return (
    <div className={getContainerClasses()}>
      <IconComponent
        className={disabled || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
        color={getIconColor()}
        width={iconSizes[size]}
        height={iconSizes[size]}
        onClick={disabled || isLoading ? undefined : onToggle}
      />
    </div>
  );
}
