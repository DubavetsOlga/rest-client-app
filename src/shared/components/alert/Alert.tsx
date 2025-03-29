'use client';

import { Flip, ToastContainer, ToastContainerProps } from 'react-toastify';
import { ReactElement } from 'react';
import { X } from 'lucide-react';

export const Alert = (props: ToastContainerProps): ReactElement => {
  return (
    <ToastContainer
      closeButton={() => <X />}
      closeOnClick={true}
      hideProgressBar
      position={'top-center'}
      transition={Flip}
      icon={false}
      {...props}
    />
  );
};
