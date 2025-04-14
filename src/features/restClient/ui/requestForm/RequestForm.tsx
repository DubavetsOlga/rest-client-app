'use client';

import { useState } from 'react';
import s from './RequestForm.module.css';
import { MethodSelect } from './methodSelect/MethodSelect';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { EndpointInput } from '@/features/restClient/ui/requestForm/endpointInput/EndpointInput';
import { selectUrl } from '@/shared/store/selectors/restClientSelectors';
import { SendButton } from '@/features/restClient/ui/requestForm/sendButton/SendButton';

export const RequestForm = () => {
  const url = useAppSelector(selectUrl);

  const [isDisabled, setIsDisabled] = useState(!url);

  return (
    <div className={s.container}>
      <MethodSelect />
      <EndpointInput onChange={setIsDisabled} />
      <SendButton disabled={isDisabled} />
    </div>
  );
};
