import Logo from '../global/Logo';

export default function Sidebar() {
  return (
    <div className="flex w-[290px] flex-col items-center bg-slate-100">
      {/* Logo */}
      <div className="py-8 px-6 mx-auto">
        <Logo />
      </div>
      {/* Perfil */}
      <div className="flex py-[14px] px-6 gap-5 items-center"></div>
    </div>
  );
}
