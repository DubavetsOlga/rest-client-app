'use client';

import { Flip, ToastContainer, ToastContainerProps } from 'react-toastify';
import { ReactElement } from 'react';
import Image from 'next/image';
import close from '../../../assets/close.svg';

export const Alert = (props: ToastContainerProps): ReactElement => {
  return (
    <ToastContainer
      closeButton={() => <Image src={close} alt="close" />}
      closeOnClick={true}
      hideProgressBar
      position={'top-center'}
      transition={Flip}
      icon={false}
      {...props}
    />
  );
};
