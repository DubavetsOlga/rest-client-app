import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VariablesState {
  variables: Variable[];
}

export interface Variable {
  id: string;
  key: string;
  value: string;
}

const initialState: VariablesState = {
  variables: [],
};

export const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    setVariables(state, action: PayloadAction<Variable[]>) {
      state.variables = action.payload;
    },
    createVariable(state, action: PayloadAction<Variable>) {
      state.variables.push(action.payload);
    },
    removeVariable(state, action: PayloadAction<string>) {
      state.variables = state.variables.filter(
        (variable) => variable.id !== action.payload
      );
    },
    editVariable(state, action: PayloadAction<Variable>) {
      const index = state.variables.findIndex(
        (variable) => variable.id === action.payload.id
      );
      state.variables.splice(index, 1, action.payload);
    },
  },
});

export const { setVariables, createVariable, removeVariable, editVariable } =
  variablesSlice.actions;

export default variablesSlice.reducer;
