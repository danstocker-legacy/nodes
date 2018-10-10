import {mcb} from "./mcb";

describe("mcb", function () {
  describe("keys()", function () {
    it("should extract keys from object", function () {
      const result = mcb.keys({foo: "bar", baz: "quux"});
      expect(result.sort()).toEqual(["baz", "foo"]);
    });
  });

  describe("values()", function () {
    it("should extract values from object", function () {
      const result = mcb.values({foo: "bar", baz: "quux"});
      expect(result.sort()).toEqual(["bar", "quux"]);
    });
  });

  describe("addKeys$()", function () {
    it("should convert add keys to array", function () {
      const result = mcb.addKeys$(["foo", "bar", "baz"])([1, 2, 3]);
      expect(result).toEqual({
        bar: 2,
        baz: 3,
        foo: 1
      });
    });
  });

  describe("addValues$()", function () {
    it("should add values to keys", function () {
      const result = mcb.addValues$([1, 2, 3])(["foo", "bar", "baz"]);
      expect(result).toEqual({
        bar: 2,
        baz: 3,
        foo: 1
      });
    });
  });

  describe("stringify()", function () {
    it("should return input as string", function () {
      expect(mcb.stringify(1)).toBe("1");
      expect(mcb.stringify(null)).toBe("null");
      expect(mcb.stringify(true)).toBe("true");
      expect(mcb.stringify(undefined)).toBe("undefined");
      expect(mcb.stringify({})).toBe("[object Object]");
      expect(mcb.stringify({
        toString() {
          return "foo";
        }
      })).toBe("foo");
    });
  });

  describe("jsonStringify()", function () {
    it("should return input JSON as string", function () {
      expect(mcb.jsonStringify({
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

  describe("sort$()", function () {
    it("should return sorted array", function () {
      const result = mcb.sort$<{ [key: string]: number }>((a, b) =>
        a.foo > b.foo ? 1 :
          a.foo < b.foo ? -1 :
            a.foo === b.foo ? 0 :
              undefined)([{foo: 5}, {foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}]);
      expect(result).toEqual([
        {foo: 1},
        {foo: 2},
        {foo: 3},
        {foo: 4},
        {foo: 5}
      ]);
    });
  });
});
