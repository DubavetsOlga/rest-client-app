import { Variable } from '@/shared/models/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type VariablesState = {
  variables: Variable[];
  isStored: boolean;
};

const initialState: VariablesState = {
  variables: [],
  isStored: false,
};

export const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    setVariables(state, action: PayloadAction<Variable[]>) {
      state.variables = action.payload;
      state.isStored = true;
    },
    createVariable(state, action: PayloadAction<Variable>) {
      const index = state.variables.findIndex(
        (variable) => variable.key === action.payload.key
      );
      if (index !== -1) {
        state.variables.splice(index, 1, action.payload);
      } else {
        state.variables.push(action.payload);
      }
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
      const sameKeyIndex = state.variables.findIndex(
        (variable) => variable.key === action.payload.key
      );

      if (action.payload.key.length && action.payload.value.length) {
        if (sameKeyIndex !== -1 && index !== sameKeyIndex) {
          state.variables.splice(index, 1);
          state.variables.splice(sameKeyIndex, 1, action.payload);
        } else {
          state.variables.splice(index, 1, action.payload);
        }
      }
    },
    clearVariables(state) {
      state.variables = [];
      state.isStored = false;
    },
  },
});

export const {
  setVariables,
  createVariable,
  removeVariable,
  editVariable,
  clearVariables,
} = variablesSlice.actions;

export default variablesSlice.reducer;
