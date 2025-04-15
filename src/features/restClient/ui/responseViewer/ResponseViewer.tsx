import s from './ResponseViewer.module.css';
import ReactCodeMirror from '@uiw/react-codemirror';
import { clouds } from 'thememirror';
import { json } from '@codemirror/lang-json';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { selectResponse } from '@/shared/store/selectors/restClientSelectors';
import { isJSON } from '@/shared/utils/isJson';
import { useState } from 'react';
import { ResponseHeaders } from '@/features/restClient/ui/responseViewer/responseHeaders/ResponseHeaders';
import { ResponseSettings } from '@/features/restClient/ui/responseViewer/responseSetting/ResponseSetting';

export const ResponseViewer = () => {
  const response = useAppSelector(selectResponse);

  const [isBody, setIsBody] = useState(true);

  return (
    <div>
      <ResponseSettings
        status={response.status}
        isBody={isBody}
        setIsBody={setIsBody}
      />

      {isBody ? (
        <ReactCodeMirror
          value={response.result}
          editable={false}
          extensions={
            response.status === 0 || !isJSON(response.result) ? [] : [json()]
          }
          className={s.response}
          theme={clouds}
        />
      ) : (
        <div className={s.response}>
          <ResponseHeaders />
        </div>
      )}
    </div>
  );
};
