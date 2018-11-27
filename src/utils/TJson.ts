import {IJsonArray} from "./IJsonArray";
import {IJsonObject} from "./IJsonObject";

/**
 * Data structure that conforms to the JSON standard.
 */
export type TJson =
  string |
  number |
  boolean |
  null |
  IJsonArray |
  IJsonObject;
