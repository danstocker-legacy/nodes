export interface IError<R extends string> {
  type: R;
  reason: any;
}
