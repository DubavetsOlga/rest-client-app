'use client';

import { ReactNode, useState } from 'react';
import s from './Accordion.module.css';
import { ChevronRight, ChevronDown } from 'lucide-react';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export const Accordion = ({ title, children, defaultOpen = true }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={s.accordion}>
      <div className={s.accordionTitle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown /> : <ChevronRight />}
        <span>{title}</span>
      </div>
      {isOpen && <div className={s.accordionChildren}>{children}</div>}
    </div>
  );
};
