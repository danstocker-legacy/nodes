import {merge} from "./utils";

describe("merge()", function () {
  it("should merge second argument to first", function () {
    expect(merge({foo: 1}, {bar: 2, baz: 3})).toEqual({
      bar: 2,
      baz: 3,
      foo: 1
    });
  });

  it("should not overwrite properties", function () {
    expect(merge({foo: 1, baz: 2}, {bar: 2, baz: 3}))
    .toEqual({
      bar: 2,
      baz: 2,
      foo: 1
    });
  });
});
