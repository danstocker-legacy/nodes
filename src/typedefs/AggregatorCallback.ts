export type AggregatorCallback<I, R> = (result: R, next: I, i: string, nodes: Object) => R;
