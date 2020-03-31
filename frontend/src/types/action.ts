export interface CustomAction<T = undefined> {
  type: string;
  payload: T;
}
