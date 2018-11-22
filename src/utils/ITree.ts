export interface ITree<V> {
  [key: string]: V | ITree<V>;
}
