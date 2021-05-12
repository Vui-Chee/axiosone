import { AxiosRequestConfig, AxiosResponse, AxiosStatic } from "axios";

export interface AxiosoneConfig {
  config: AxiosRequestConfig;
  createConfigs?: (...args: any[]) => AxiosRequestConfig | AxiosRequestConfig[];
}

export type AxiosoneModule = Record<string, AxiosoneConfig>;

/**
 * Type constructor to build a single query function type from parameters
 * of `createConfigs`.
 */
export type AxiosoneQueryFunction<
  CreateConfigs extends (...args: any[]) => any = () => any
> = <T>(...args: Parameters<CreateConfigs>) => Promise<AxiosResponse<T>>;

/**
 * Declare new query functions using the following:
 *
 * ```
 * declare module "axiosone" {
 *   interface AxiosoneInstance {
 *     login: <T>(
 *       ...args: Parameters<typeof config.login.createConfigs>
 *     ) => Promise<AxiosResponse<T>>;
 *   }
 * }
 * ```
 */
export interface AxiosoneInstance {
  axios: AxiosStatic;
  extendGlobalConfig: (config: AxiosRequestConfig) => void;
  bindConfig: (queryConfigs: AxiosoneModule) => void;
}

declare const axiosone: AxiosoneInstance;

export default axiosone;
