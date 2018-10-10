import {hash} from "./mapperCallbacks";

describe("hash()", function () {
  it("should convert array to hash", function () {
    const result = [[1, 2, 3]].map(hash(["foo", "bar", "baz"]));
    expect(result).toEqual([{
      bar: 2,
      baz: 3,
      foo: 1
    }]);
  });
});
