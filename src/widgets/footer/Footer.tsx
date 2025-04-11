'use client';

import s from './Footer.module.css';
import Image from 'next/image';
import rslogo from '@/assets/rs-logo.svg';
import github from '@/assets/github.svg';
import { developersData } from '@/shared/data/developers';

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.gitContainer}>
        <a
          href="https://github.com/DubavetsOlga/rest-client-app/"
          target="_blank"
        >
          <Image src={github} alt="github" height={38} priority />
        </a>
        <div className={s.gitDevLinks}>
          {developersData.map((dev) => (
            <a
              key={dev.github}
              href={dev.github}
              target="_blank"
              className={s.devLink}
            >
              {dev.name}
            </a>
          ))}
        </div>
      </div>
      <span>2025</span>
      <a href="https://rs.school/" target="_blank">
        <Image src={rslogo} alt="rs-school" height={30} priority />
      </a>
    </footer>
  );
};
