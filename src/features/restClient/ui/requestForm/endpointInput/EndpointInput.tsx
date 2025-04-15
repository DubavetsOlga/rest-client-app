'use client';

import { memo, useEffect, useRef, useState } from 'react';
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { clouds } from 'thememirror';
import { EditorView } from '@codemirror/view';
import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import s from './EndpointInput.module.css';
import { setUrl } from '@/shared/store/reducers/restClientSlice';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { selectUrl } from '@/shared/store/selectors/restClientSelectors';
import { getEndpointExtensions } from '@/shared/utils/getEndpointExtensions';

type Props = {
  onChange: (isDisabled: boolean) => void;
};

export const EndpointInput = memo(function EndpointInput({ onChange }: Props) {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const dispatch = useAppDispatch();
  const variables = useAppSelector((state) => state.variablesReducer.variables);
  const url = useAppSelector(selectUrl);

  const [value, setValue] = useState(url);

  useEffect(() => {
    setValue(url);
    onChange(!url);
  }, [url]);

  const extensions = getEndpointExtensions(variables);

  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const handleBlur = () => {
    editorRef.current?.view?.dispatch({
      effects: EditorView.scrollIntoView(0, { x: 'start', y: 'nearest' }),
    });

    dispatch(setUrl(value.trim()));
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(!newValue.trim());
  };

  return (
    <ReactCodeMirror
      ref={editorRef}
      value={value}
      editable={true}
      extensions={extensions}
      onChange={handleChange}
      onBlur={handleBlur}
      theme={clouds}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
        drawSelection: false,
      }}
      className={s.input}
      placeholder={t.urlPlaceholder}
      aria-label={t.urlPlaceholder}
    />
  );
});
