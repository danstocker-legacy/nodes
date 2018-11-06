export type TMuxed<T> = {
  name: keyof T,
  value: T[keyof T],
  tag?: string
};
