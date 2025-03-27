import { ReactElement } from 'react';
import s from './Spinner.module.css';

type Props = {
  size?: number;
};

export const Spinner = ({ size = 48 }: Props): ReactElement => {
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
