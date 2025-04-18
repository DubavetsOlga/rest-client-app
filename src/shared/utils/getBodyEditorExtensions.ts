import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import {
  createVariableAutocomplete,
  createVariableHighlight,
} from '@/shared/utils/getVariableExtensions';

export const getBodyEditorExtensions = (
  isJson: boolean,
  variables: { key: string }[]
) => {
  return [
    isJson ? json() : [],
    EditorView.lineWrapping,
    createVariableHighlight(variables),
    createVariableAutocomplete(variables),
    EditorView.theme({
      '.cm-var-known, .cm-var-known span': {
        color: 'var(--color-success-500)!important',
      },
      '.cm-var-unknown, .cm-var-unknown span': {
        color: 'var(--color-error-500)!important',
      },
    }),
  ].filter(Boolean) as Extension[];
};
