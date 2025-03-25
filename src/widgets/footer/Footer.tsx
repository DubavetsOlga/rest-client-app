'use client';

import s from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';
import rslogo from '@/assets/rs-logo.svg';
import github from '@/assets/github.svg';

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <Link
        href="https://github.com/DubavetsOlga/rest-client-app/"
        target="_blank"
      >
        <Image src={github} alt="github" height={30} priority />
      </Link>
      <span>2025</span>
      <Link href="https://rs.school/" target="_blank">
        <Image src={rslogo} alt="rs-school" height={30} priority />
      </Link>
    </footer>
  );
};
