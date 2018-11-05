interface IA {
  foo<T>(a: T): void;
}

interface IB<T> extends IA {
  foo<U>(a: U | T): void;
}
