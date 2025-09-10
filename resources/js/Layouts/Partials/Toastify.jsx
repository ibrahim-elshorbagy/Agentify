import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toastify() {
  const { flash } = usePage().props;
  const { locale } = usePage().props;

  const place = locale === 'ar' ? 'bottom-left' : 'bottom-right';
  useEffect(() => {
    if (flash && flash.status) {
      switch (flash.status) {
        case 'success':
          toast.success(`${flash.title ?? 'Success'}: ${flash.message}`, {
            position: place,
            autoClose: 4000,
            theme: "colored",
            transition: Bounce,
          });
          break;

        case 'error':
          toast.error(`${flash.title ?? 'Error'}: ${flash.message}`, {
            position: place,
            autoClose: 4000,
            theme: "colored",
            transition: Bounce,
          });
          break;

        case 'warning':
          toast.warning(`${flash.title ?? 'Warning'}: ${flash.message}`, {
            position: place,
            autoClose: 4000,
            theme: "colored",
            transition: Bounce,
          });
          break;
      }

    }
  }, [flash]);

  return <ToastContainer />;
}
