export type Reducer<Item, Result> = (result: Result, next: Item, i: string, inputs: Object) => Result;
