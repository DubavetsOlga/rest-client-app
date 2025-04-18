import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HttpMethod, HttpMethodType } from '@/shared/models/httpMethod';
import {
  HeaderType,
  ResponseType,
  RestClientType,
} from '@/shared/models/types';
import { REST } from '@/shared/models/routes';
import { CodeLanguageType } from '@/shared/models/codeLanguages';

const initialState: RestClientType = {
  method: HttpMethod.GET,
  url: '',
  body: '',
  headers: [],
  response: { result: '', status: 0, headers: {} },
  isJsonMode: true,
  codeType: 'curl',
  link: REST,
};

const RestClientSlice = createSlice({
  name: 'restClient',
  initialState,
  reducers: {
    setMethod(state, { payload }: PayloadAction<HttpMethodType>) {
      state.method = payload;
    },
    setUrl(state, { payload }: PayloadAction<string>) {
      state.url = payload;
    },
    setBody(state, { payload }: PayloadAction<string>) {
      state.body = payload;
    },
    setHeaders(state, { payload }: PayloadAction<HeaderType[]>) {
      state.headers = payload;
    },
    addHeader(state, { payload }: PayloadAction<HeaderType>) {
      state.headers.push(payload);
    },
    updateHeader(state, { payload }: PayloadAction<HeaderType>) {
      const index = state.headers.findIndex((h) => h.id === payload.id);
      if (index !== -1) {
        state.headers[index] = payload;
      }
    },
    deleteHeader(state, { payload }: PayloadAction<string>) {
      state.headers = state.headers.filter((h) => h.id !== payload);
    },
    setIsJsonMode(state, { payload }: PayloadAction<boolean>) {
      state.isJsonMode = payload;
    },
    setCodeType(state, { payload }: PayloadAction<CodeLanguageType>) {
      state.codeType = payload;
    },
    setResponse(state, { payload }: PayloadAction<ResponseType>) {
      state.response = payload;
    },
    setLink(state, { payload }: PayloadAction<string>) {
      state.link = payload;
    },
    resetRestClient() {
      return initialState;
    },
  },
});

export const {
  setMethod,
  setUrl,
  setBody,
  setHeaders,
  addHeader,
  updateHeader,
  deleteHeader,
  setIsJsonMode,
  setResponse,
  resetRestClient,
  setCodeType,
  setLink,
} = RestClientSlice.actions;

export default RestClientSlice.reducer;
