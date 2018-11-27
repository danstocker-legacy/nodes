interface IJsonStringifiableArray extends Array<TJsonStringifiable> {
}

interface IJsonStringifiableObject {
  [key: string]: TJsonStringifiable;
}

/**
 * Data structure that can be safely JSON stringified.
 */
export type TJsonStringifiable =
  string |
  number |
  boolean |
  null |
  IJsonStringifiableArray |
  IJsonStringifiableObject;
