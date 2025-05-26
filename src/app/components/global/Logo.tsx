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
  width = 218,
  height = 39,
  className,
  href,
  onClick,
  style,
  alt = 'Logo',
}: Props) {
  console.log(width, height, className, href, onClick, style, alt);
  const imageElement = (
    <Image
      src={logo}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        ...style,
      }}
      onClick={onClick}
      priority={true}
      quality={100}
    />
  );

  if (href) {
    return <Link href={href}>{imageElement}</Link>;
  }

  return imageElement;
}
