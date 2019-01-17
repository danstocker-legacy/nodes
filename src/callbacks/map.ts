import {TMapperCallback} from "../nodes/basic/mapper$";

export function constant$(value: any): TMapperCallback<any, any> {
  return () => value;
}

export function split$(delimiter: string): TMapperCallback<string, Array<string>> {
  return (next: string) => next.split(delimiter);
}

export function pluck$<T>(property: string): TMapperCallback<T, T[keyof T]> {
  return (value: T) => value[property];
}
