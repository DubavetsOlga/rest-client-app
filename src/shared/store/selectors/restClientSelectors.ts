import { RootState } from '@/shared/store/store';

export const selectUrl = (state: RootState) => state.restClientReducer.url;
export const selectMethod = (state: RootState) =>
  state.restClientReducer.method;
export const selectBody = (state: RootState) => state.restClientReducer.body;
export const selectHeaders = (state: RootState) =>
  state.restClientReducer.headers;
export const selectCodeType = (state: RootState) =>
  state.restClientReducer.codeType;
export const selectIsJsonMode = (state: RootState) =>
  state.restClientReducer.isJsonMode;
export const selectResponse = (state: RootState) =>
  state.restClientReducer.response;
