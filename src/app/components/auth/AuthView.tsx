import Image from 'next/image';
const logoUrl = '/assets/global/logo.png';

interface Props {
  children: React.ReactNode;
  title?: string;
  text?: string;
  showLogo?: boolean;
}

export default function AuthView({
  children,
  title = '',
  text = '',
  showLogo = true,
}: Props) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-2 md:px-0"
      style={{
        backgroundImage:
          "linear-gradient(0deg,rgba(0,0,0,.52) 0%,rgba(0,0,0,.52) 100%),url('/assets/login/login-bg.jpg')",
      }}
    >
      <div className="flex max-w-[704px] w-full py-[36px] px-6 md:px-[128px] flex-col justify-center items-center rounded-[24px] bg-white h-full">
        {showLogo && <Image src={logoUrl} alt="Logo" width={221} height={40} />}
        <div className="text-center gap-[10px]">
          {title.length > 0 && (
            <h1 className="text-[24px] font-bold text-[#1E1E2F]">{title}</h1>
          )}
          {text.length > 0 && (
            <p className="text-[14px] font-normal text-[#1E1E2F]">{text}</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-6 w-full justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
