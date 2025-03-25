import s from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';
import dev1 from '../../assets/dev1.png';
import dev2 from '../../assets/dev2.png';
import dev3 from '../../assets/dev3.png';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';

export const Developers = () => {
  const locale = useLocale();
  const { developers: t } = translate(locale);

  const developers = [
    {
      name: t.Volha,
      github: 'https://github.com/DubavetsOlga',
      photo: dev1,
      about: t.frontendDeveloper,
    },
    {
      name: t.Timofei,
      github: 'https://github.com/timofeynaryshkin',
      photo: dev2,
      about: t.frontendDeveloper,
    },
    {
      name: t.Polina,
      github: 'https://github.com/lagertt',
      photo: dev3,
      about: t.frontendDeveloper,
    },
  ];

  return (
    <div className={s.developers}>
      {developers.map((developer) => (
        <div key={developer.name} className={s.developerContainer}>
          <Image src={developer.photo} alt={developer.name} priority />
          <div className={s.developerInfo}>
            <h4>{developer.name}</h4>
            <p>{developer.about}</p>
            <Link href={developer.github} target="_blank" className={s.link}>
              GitHub
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
