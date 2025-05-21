import Image from 'next/image';
import Link from 'next/link';

const logo = '/assets/global/logo.png';

interface Props {
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  alt?: string;
}

export default function Logo({
  width,
  height,
  className,
  href,
  onClick,
  style,
  alt = 'Logo',
}: Props) {
  const imageElement = (
    <Image
      src={logo}
      alt={alt}
      width={width || 218}
      height={height || 39}
      className={className}
      style={{
        width: width ? width : 'auto',
        height: height ? height : 'auto',
        ...style,
      }}
      onClick={onClick}
    />
  );

  if (href) {
    return <Link href={href}>{imageElement}</Link>;
  }

  return imageElement;
}
