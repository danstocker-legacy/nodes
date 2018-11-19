import {fold} from "./fold";

describe("fold", function () {
  describe("push()", function () {
    it("should push items into array", function () {
      const input = [1, 2, 3, 4, 5];
      expect(input.reduce(fold.push, [])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("unshift()", function () {
    it("should unshift items into array", function () {
      const input = [1, 2, 3, 4, 5];
      expect(input.reduce(fold.unshift, [])).toEqual([5, 4, 3, 2, 1]);
    });
  });

  describe("concat()", function () {
    it("should concat items into array", function () {
      const input = [[1, 2], [3, 4], [5]];
      expect(input.reduce(fold.concat, [])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("last()", function () {
    it("should return last item", function () {
      const input = [1, 2, 3, 4, 5];
      expect(input.reduce(fold.last)).toEqual(5);
    });
  });

  describe("join()", function () {
    it("should return joined string", function () {
      const input = ["1", "2", "3", "4", "5"];
      expect(input.reduce(fold.join, "")).toEqual("12345");
    });
  });

  describe("sum()", function () {
    it("should return joined string", function () {
      const input = [1, 2, 3, 4, 5];
      expect(input.reduce(fold.sum, 0)).toEqual(15);
    });
  });

  describe("min()", function () {
    it("should return minimum item", function () {
      const input = [1, 2, 3, 4, 5];
      expect(input.reduce(fold.min, Infinity)).toEqual(1);
    });
  });

  describe("max()", function () {
    it("should return maximum item", function () {
      const input = [1, 2, 3, 4, 5];
      expect(input.reduce(fold.max, -Infinity)).toEqual(5);
    });
  });
});
