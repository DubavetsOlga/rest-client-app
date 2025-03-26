import { ReactElement } from 'react';
import s from './Spinner.module.css';

export type SpinnerProps = {
  size?: number;
};

export const Spinner = ({ size = 48 }: SpinnerProps): ReactElement => {
  const style = {
    height: size,
    width: size,
  };

  return (
    <div className={s.spinnerContainer}>
      <span className={s.spinner} style={style} />
    </div>
  );
};
