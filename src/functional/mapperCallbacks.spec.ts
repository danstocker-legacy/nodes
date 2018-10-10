import {hash, jsonStringify, stringify} from "./mapperCallbacks";

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

describe("stringify()", function () {
  it("should return input as string", function () {
    expect(stringify(1)).toBe("1");
    expect(stringify(null)).toBe("null");
    expect(stringify(true)).toBe("true");
    expect(stringify(undefined)).toBe("undefined");
    expect(stringify({})).toBe("[object Object]");
    expect(stringify({
      toString() {
        return "foo";
      }
    })).toBe("foo");
  });
});

describe("jsonStringify()", function () {
  it("should return input JSON as string", function () {
    expect(jsonStringify({
      1: "foo",
      2: 1,
      3: true,
      4: null,
      5: [1, 2],
      6: {
        foo: 1
      },
      7: undefined
    })).toBe(`{"1":"foo","2":1,"3":true,"4":null,"5":[1,2],"6":{"foo":1}}`);
  });
});
