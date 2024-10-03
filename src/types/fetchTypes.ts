export type TRequest<T> = {
  url: string;
  payload?: T;
  requestName: string;
};
