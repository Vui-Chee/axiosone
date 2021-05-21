import { Canceler } from "axios";

import axiosone, {
  AxiosoneInstance,
  AxiosoneModule,
  AxiosoneQueryFunction,
  AxiosRequestConfigOverride,
} from "../../";

export const axiosoneRef: AxiosoneInstance = axiosone;

export const axiosConfig: AxiosRequestConfigOverride = {
  method: "get", // NOTE this is a string instead of Method

  // Everything else AxiosRequestConfig has
  url: "/user",
  baseURL: "https://api.example.com/",
  transformRequest: (_data: any) => '{"foo":"bar"}',
  transformResponse: [(_data: any) => ({ baz: "qux" })],
  headers: { "X-FOO": "bar" },
  params: { id: 12345 },
  paramsSerializer: (_params: any) => "id=12345",
  data: { foo: "bar" },
  timeout: 10000,
  withCredentials: true,
  auth: {
    username: "janedoe",
    password: "s00pers3cret",
  },
  responseType: "json",
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  onUploadProgress: (_progressEvent: ProgressEvent) => {},
  onDownloadProgress: (_progressEvent: ProgressEvent) => {},
  maxContentLength: 2000,
  maxBodyLength: 2000,
  validateStatus: (status: number) => status >= 200 && status < 300,
  maxRedirects: 5,
  proxy: {
    host: "127.0.0.1",
    port: 9000,
  },
  cancelToken: new axiosone.axios.CancelToken((_cancel: Canceler) => {}),
};

// Test different config values
export const module: AxiosoneModule = {
  simpleConfig: {
    method: "get",
    url: "/example/post",
  },
  listConfig: [
    {
      method: "get",
      url: "/example/post",
    },
  ],
  functionReturnConfig: () => ({
    method: "get",
    url: "/example/post",
  }),
  functionReturnListConfig: () => [
    {
      method: "get",
      url: "/example/post",
    },
  ],
};

// Test function params are typed-check
export const functionModule = {
  testQuery: (name: string, value: number, data: { a: number; b: string }) => ({
    method: "get",
    url: "/example/post",
    data: {
      ...data,
      name,
      value,
    },
  }),
};

axiosone.bindConfig(functionModule);

// @ts-ignore
export const tmp = axiosone.testQuery;

// This tests whether function in axiosone instance has the
// signature AxiosoneQueryFunction<typeof functionModule.testQuery>.
export const queryFunction: AxiosoneQueryFunction<
  typeof functionModule.testQuery
> = tmp;
