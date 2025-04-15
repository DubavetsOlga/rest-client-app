import { Button } from '@/shared/components';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { prepareRequestData } from '@/shared/utils/prepareRequestData';
import { requestAction } from '@/shared/utils/requestAction';
import { setResponse } from '@/shared/store/reducers/restClientSlice';
import { useHistoryRequest } from '@/features/history/hooks/useHistoryRequest';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { memo } from 'react';

type Props = {
  disabled: boolean;
};

export const SendButton = memo(function SendButton({ disabled }: Props) {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const { addToHistory } = useHistoryRequest();
  const dispatch = useAppDispatch();

  const { url, method, body, headers } = useAppSelector(
    (store) => store.restClientReducer
  );
  const variables = useAppSelector((state) => state.variablesReducer.variables);

  const handleSend = async () => {
    if (!url) return;

    const {
      endpoint,
      body: bodyWithVars,
      headers: headersObj,
      historyEntry,
    } = prepareRequestData(method, url, body, headers, variables);

    const res = await requestAction({
      url: endpoint,
      method,
      body: bodyWithVars,
      headers: headersObj,
    });

    dispatch(setResponse(res));

    if (res.status) {
      addToHistory(historyEntry);
    }
  };

  return (
    <Button onClick={handleSend} disabled={disabled}>
      {t.send}
    </Button>
  );
});
