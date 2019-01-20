import * as map from "./map";

describe("map", function () {
  describe("constant$", function () {
    it("should return specified value", function () {
      expect(map.constant$(5)(null)).toBe(5);
    });
  });

  describe("split$", function () {
    it("should return split string", function () {
      expect(map.split$(",")("foo,bar,baz"))
      .toEqual(["foo", "bar", "baz"]);
    });
  });

  describe("pluck$", function () {
    it("should return specified property", function () {
      expect(map.pluck$("foo")({foo: 5, bar: true})).toBe(5);
    });
  });

  describe("mpluck$()", () => {
    let mpluck: (value: {}) => any;

    beforeEach(() => {
      mpluck = map.mpluck$(["foo", "bar"]);
    });

    it("should pluck multiple values", () => {
      expect(mpluck({bar: 1, foo: "hello", baz: null})).toEqual(["hello", 1]);
    });
  });

  describe("join$()", () => {
    let join: (value: Array<any>) => string;

    beforeEach(() => {
      join = map.join$(";");
    });

    it("should join input array", () => {
      expect(join(["foo", 5, true])).toBe("foo;5;true");
    });
  });

  describe("append$()", () => {
    let append: (value: string) => string;

    beforeEach(() => {
      append = map.append$("_");
    });

    it("should append to input string", () => {
      expect(append("foo")).toBe("foo_");
    });
  });

  describe("prepend$()", () => {
    let prepend: (value: string) => string;

    beforeEach(() => {
      prepend = map.prepend$("_");
    });

    it("should prepend to input string", () => {
      expect(prepend("foo")).toBe("_foo");
    });
  });
});
