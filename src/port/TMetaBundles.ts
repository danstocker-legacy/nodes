import {TMetaPorts} from "./TMetaPorts";

export type TMetaBundles<T> = {
  [key in keyof T]: TMetaPorts
};
