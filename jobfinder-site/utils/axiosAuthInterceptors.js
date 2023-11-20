import { http } from "../services/http";

export function intercept(jwt) {
  http.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bea ${jwt}`;
    return config;
  });
}
