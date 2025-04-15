import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import s from './BodyEditor.module.css';
import ReactCodeMirror from '@uiw/react-codemirror';
import { clouds } from 'thememirror';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { setBody } from '@/shared/store/reducers/restClientSlice';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { BodyTypeInput } from '@/features/restClient/ui/tabs/bodyEditor/bodyTypeInput/BodyTypeInput';
import { Extension } from '@codemirror/state';
import { WandSparkles } from 'lucide-react';
import {
  selectBody,
  selectIsJsonMode,
} from '@/shared/store/selectors/restClientSelectors';
import { getBodyEditorExtensions } from '@/shared/utils/getBodyEditorExtensions';
import { getBeautifiedJson } from '@/shared/utils/getBeautifiedJson';

export const BodyEditor = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const dispatch = useAppDispatch();

  const body = useAppSelector(selectBody);
  const isJsonMode = useAppSelector(selectIsJsonMode);
  const variables = useAppSelector((store) => store.variablesReducer.variables);

  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [value, setValue] = useState(body);

  useEffect(() => {
    setExtensions(getBodyEditorExtensions(isJsonMode, variables));
  }, [variables, isJsonMode, value]);

  const handleBlur = () => {
    dispatch(setBody(value));
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleBeautify = useCallback(async () => {
    if (!isJsonMode || !value) return;

    try {
      JSON.parse(value);

      const beautified = await getBeautifiedJson(value);
      handleChange(beautified);
      dispatch(setBody(beautified));
    } catch (error) {
      toast.error(t.prettyError);
    }
  }, [isJsonMode, dispatch, t, value, handleChange]);

  return (
    <div className={s.container}>
      <div className={s.settings}>
        <BodyTypeInput />

        {isJsonMode && (
          <button
            onClick={handleBeautify}
            className={s.beautifyButton}
            aria-label={t.beautify}
          >
            <WandSparkles size={20} />
          </button>
        )}
      </div>

      <ReactCodeMirror
        value={value}
        onChange={handleChange}
        editable={true}
        extensions={extensions}
        className={s.editor}
        onBlur={handleBlur}
        theme={clouds}
        basicSetup={{
          highlightActiveLine: false,
        }}
      />
    </div>
  );
};
