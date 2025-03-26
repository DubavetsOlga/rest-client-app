import Link from 'next/link';
import s from './NotFound.module.css';

type Props = {
  text?: string;
  linkText?: string;
};

export const NotFound = ({
  text = 'Page Not Found',
  linkText = 'Go to Main',
}: Props) => {
  return (
    <div className={s.container}>
      <h1 className={s.title}>404</h1>
      <h2 className={s.subtitle}>{text}</h2>
      <Link href="/" className={s.link}>
        {linkText}
      </Link>
    </div>
  );
};
