import { useEffect, useMemo, useState } from 'react';
import s from './CodeGenerator.module.css';
import ReactCodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { clouds } from 'thememirror';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { setCodeType } from '@/shared/store/reducers/restClientSlice';
import { CodeLanguages, CodeLanguageType } from '@/shared/models/codeLanguages';
import {
  languageExtensions,
  createPostmanRequest,
  generateCode,
} from '@/shared/utils/codeGeneratorUtils';

const EDITOR_EXTENSIONS = [
  EditorView.lineWrapping,
  EditorView.theme({
    '.cm-content': { fontFamily: 'monospace' },
  }),
];

const EDITOR_SETUP = {
  lineNumbers: true,
  highlightActiveLineGutter: false,
  foldGutter: false,
  highlightActiveLine: false,
};

export const CodeGenerator = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const dispatch = useAppDispatch();

  const { url, method, body, headers, codeType } = useAppSelector(
    (store) => store.restClientReducer
  );
  const variables = useAppSelector((store) => store.variablesReducer.variables);

  const [generatedCode, setGeneratedCode] = useState<string>('');

  const request = useMemo(
    () => createPostmanRequest(method, url, body, headers, variables),
    [method, url, body, headers, variables]
  );

  useEffect(() => {
    const updateGeneratedCode = async () => {
      const code = await generateCode(request, codeType, t.codeError);
      setGeneratedCode(code);
    };
    updateGeneratedCode();
  }, [request, codeType, t.codeError]);

  const handleLanguageChange = (value: CodeLanguageType) => {
    dispatch(setCodeType(value));
  };

  return (
    <div className={s.container}>
      <select
        value={codeType}
        onChange={(e) =>
          handleLanguageChange(e.target.value as CodeLanguageType)
        }
        className={s.select}
        disabled={!url}
      >
        {Object.entries(CodeLanguages).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <div className={s.code}>
        <ReactCodeMirror
          value={url ? generatedCode : t.codeError}
          editable={false}
          extensions={[...languageExtensions[codeType], ...EDITOR_EXTENSIONS]}
          theme={clouds}
          basicSetup={EDITOR_SETUP}
        />
      </div>
    </div>
  );
};
