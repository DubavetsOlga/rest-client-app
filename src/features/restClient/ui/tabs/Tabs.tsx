import { Fragment, useState } from 'react';
import { BodyEditor } from '@/features/restClient/ui/tabs/bodyEditor/BodyEditor';
import { Headers } from '@/features/restClient/ui/tabs/headers/Headers';
import { CodeGenerator } from '@/features/restClient/ui/tabs/codeGenerator/CodeGenerator';
import s from './Tabs.module.css';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';

export const Tabs = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const tabs = [
    { label: t.headers, content: <Headers /> },
    { label: t.body, content: <BodyEditor /> },
    { label: t.code, content: <CodeGenerator /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div className={s.container}>
      <div className={s.list}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`${s.button} ${
              activeTab === tab.label ? s.activeTab : ''
            }`}
            aria-label={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.content}>
        {tabs.map(
          (tab) =>
            activeTab === tab.label && (
              <Fragment key={tab.label}>{tab.content}</Fragment>
            )
        )}
      </div>
    </div>
  );
};
