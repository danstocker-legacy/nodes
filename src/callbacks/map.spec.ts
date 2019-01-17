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
});
