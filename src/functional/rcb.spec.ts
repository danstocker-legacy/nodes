import {rcb} from "./rcb";

describe("push()", function () {
  it("should push items into array", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(rcb.push, [])).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("unshift()", function () {
  it("should unshift items into array", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(rcb.unshift, [])).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("concat()", function () {
  it("should concat items into array", function () {
    const input = [[1, 2], [3, 4], [5]];
    expect(input.reduce(rcb.concat, [])).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("last()", function () {
  it("should return last item", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(rcb.last)).toEqual(5);
  });
});

describe("join()", function () {
  it("should return joined string", function () {
    const input = ["1", "2", "3", "4", "5"];
    expect(input.reduce(rcb.join, "")).toEqual("12345");
  });
});

describe("sum()", function () {
  it("should return joined string", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(rcb.sum, 0)).toEqual(15);
  });
});

describe("min()", function () {
  it("should return minimum item", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(rcb.min, Infinity)).toEqual(1);
  });
});

describe("max()", function () {
  it("should return maximum item", function () {
    const input = [1, 2, 3, 4, 5];
    expect(input.reduce(rcb.max, -Infinity)).toEqual(5);
  });
});

describe("merge()", function () {
  it("should return merged object", function () {
    const input = [{foo: 1}, {bar: 2}, {baz: 3}];
    expect(input.reduce(rcb.merge, {})).toEqual({
      bar: 2,
      baz: 3,
      foo: 1
    });
  });
});
