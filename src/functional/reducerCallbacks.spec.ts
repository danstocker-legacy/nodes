import {concat, join, last, push, sum, unshift} from "./reducerCallbacks";

describe("push()", function () {
  it("should push items into array", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(push, [])).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("unshift()", function () {
  it("should unshift items into array", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(unshift, [])).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("concat()", function () {
  it("should concat items into array", function () {
    const input = [[1, 2], [3, 4], [5]];
    expect(input.reduce(concat, [])).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("last()", function () {
  it("should return last item", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(last)).toEqual(5);
  });
});

describe("join()", function () {
  it("should return joined string", function () {
    const input = ["1", "2", "3", "4", "5"];
    expect(input.reduce(join, "")).toEqual("12345");
  });
});

describe("sum()", function () {
  it("should return joined string", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(sum, 0)).toEqual(15);
  });
});
