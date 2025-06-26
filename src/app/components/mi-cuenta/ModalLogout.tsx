'use client';
import { logoutAction } from '@/services/actions/auth.actions';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function ModalLogout({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();

const handleLogout = async () => {
  await logoutAction();
  router.push('/auth/login');
  onClose();
};

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
        <div className="flex items-start gap-2 mb-4">
          <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h2 className="text-lg font-bold">¿Deseas cerrar sesión?</h2>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleLogout}
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
          >
            Continuar
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
