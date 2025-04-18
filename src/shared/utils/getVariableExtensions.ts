import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { Decoration, EditorView } from '@codemirror/view';

export const createVariableAutocomplete = (variables: { key: string }[]) =>
  autocompletion({
    override: [
      (ctx: CompletionContext) => {
        const word = ctx.matchBefore(/{{\w*$/);
        if (!word) return null;

        return {
          from: word.from + 2,
          options: variables.map((v) => ({
            label: v.key,
            type: 'variable',
            apply: `${v.key}`,
          })),
        };
      },
    ],
  });

export const createVariableHighlight = (variables: { key: string }[]) =>
  EditorView.decorations.compute(['doc'], (state) => {
    const regex = /{{(.*?)}}/g;
    const decorations = [];
    const doc = state.doc.toString();

    let match;
    while ((match = regex.exec(doc)) !== null) {
      const from = match.index!;
      const to = from + match[0].length;
      const varName = match[1];
      const known = variables.some((v) => v.key === varName);

      decorations.push(
        Decoration.mark({
          class: known ? 'cm-var-known' : 'cm-var-unknown',
        }).range(from, to)
      );
    }

    return Decoration.set(decorations);
  });
