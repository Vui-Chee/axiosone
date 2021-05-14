import { AxiosRequestConfig, AxiosResponse, AxiosStatic } from "axios";

/**
 * Replaces method with string type otherwise, when assigning a string
 * causes error `cannot assign string to Method | undefined`.
 *
 * Check issue https://github.com/microsoft/TypeScript/issues/10570.
 */
export type AxiosRequestConfigOverride = Omit<AxiosRequestConfig, "method"> & {
  method?: string;
};

export type AxiosoneModule = Record<
  string,
  | AxiosRequestConfigOverride
  | ((...args: any[]) => AxiosRequestConfigOverride)
  | ((...args: any[]) => AxiosRequestConfigOverride[])
>;

/**
 * Type constructor to build a single query function type from parameters
 * of `createConfigs`.
 *
 * Declare new query functions using the following:
 * ```
 * declare module "axiosone" {
 *   interface AxiosoneInstance {
 *     queryName: AxiosoneQueryFunction<typeof (queryMethod)>;
 *   }
 * }
 * ```
 */
export type AxiosoneQueryFunction<
  K extends (...args: any[]) => any = () => []
> = <T>(...args: Parameters<K>) => Promise<AxiosResponse<T>>;

export interface AxiosoneInstance {
  axios: AxiosStatic;
  extendGlobalConfig: (config: AxiosRequestConfig) => void;
  bindConfig: (module: AxiosoneModule) => void;
}

declare const axiosone: AxiosoneInstance;

export default axiosone;
