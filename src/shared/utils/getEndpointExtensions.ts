import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { Variable } from '../models/types';
import {
  createVariableAutocomplete,
  createVariableHighlight,
} from '@/shared/utils/getVariableExtensions';

const createPreventEnterExtension = () =>
  keymap.of([
    {
      key: 'Enter',
      run: () => true,
      preventDefault: true,
    },
  ]);

const createRemoveNewlineBehavior = () =>
  EditorState.transactionFilter.of((tr) => {
    if (tr.newDoc.lines > tr.startState.doc.lines) {
      return [];
    }
    return tr;
  });

const createEnforceHorizontalScroll = () => [
  EditorView.theme({
    '.cm-content': {
      whiteSpace: 'pre',
      overflowX: 'auto',
      minWidth: '100%',
    },
    '.cm-line': {
      display: 'inline-block',
      padding: '0 !important',
    },
    '.cm-scroller': {
      overflowX: 'auto',
      overflowY: 'hidden',
    },
  }),
  EditorView.updateListener.of((update) => {
    if (update.docChanged || update.selectionSet) {
      const cursorPos = update.state.selection.main.head;
      const safePos =
        cursorPos <= update.state.doc.length
          ? cursorPos
          : update.state.doc.length;

      update.view.dispatch({
        effects: EditorView.scrollIntoView(safePos, {
          x: 'start',
          y: 'nearest',
        }),
      });
    }
  }),
];

export const getEndpointExtensions = (variables: Variable[]) => {
  return [
    createPreventEnterExtension(),
    createRemoveNewlineBehavior(),
    createVariableAutocomplete(variables),
    createVariableHighlight(variables),
    createEnforceHorizontalScroll(),
    EditorView.theme({
      '&': { height: '1.5rem' },
      '.cm-content': {
        whiteSpace: 'pre',
        overflowX: 'auto',
        minWidth: '100%',
        display: 'inline-block',
        padding: '0',
      },
      '.cm-line': { padding: '0 !important' },
      '.cm-scroller': {
        overflow: 'hidden!important',
        fontFamily: 'inherit',
      },
      '.cm-var-known, .cm-var-known span': {
        color: 'var(--color-success-500)',
      },
      '.cm-var-unknown, .cm-var-unknown span': {
        color: 'var(--color-error-500)',
      },
    }),
  ];
};
