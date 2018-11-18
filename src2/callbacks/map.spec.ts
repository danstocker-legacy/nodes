import {map} from "./map";

describe("map", function () {
  describe("identity", function () {
    it("should return input", function () {
      expect(map.identity(5)).toBe(5);
      expect(map.identity(true)).toBe(true);
      expect(map.identity("foo")).toBe("foo");
    });
  });

  describe("constant$", function () {
    it("should return specified value", function () {
      expect(map.constant$(5)(null)).toBe(5);
    });
  });
});
