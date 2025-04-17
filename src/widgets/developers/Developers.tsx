'use client';

import s from './Developers.module.css';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { developersData } from '@/shared/data/developers';

export const Developers = () => {
  const locale = useLocale();
  const { developers: t } = translate(locale);

  const developers = developersData.map((dev) => ({
    ...dev,
    name: t[dev.name as keyof typeof t],
    about: t.frontendDeveloper,
    from: t[dev.from as keyof typeof t],
  }));

  return (
    <div className={s.developers}>
      {developers.map((developer) => (
        <div key={developer.name} className={s.developerContainer}>
          <Image
            src={developer.photo}
            alt={developer.name}
            className={s.photo}
            width={80}
            height={80}
            priority
          />
          <div className={s.developerInfo}>
            <h4>{developer.name}</h4>
            <p>{developer.about}</p>
            <p>{developer.from}</p>
            <a
              href={developer.github}
              target="_blank"
              className={s.link}
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
