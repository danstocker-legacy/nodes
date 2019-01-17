import {connect} from "../node";
import {merger$, TMerger} from "./merger$";

describe("merger$", function () {
  describe("on input", function () {
    let node: TMerger<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = merger$(["foo", "bar"]);
    });

    it("should emit on all", function () {
      const spy = jasmine.createSpy();
      connect(node.o.all, spy);
      node.i.foo(5, "1");
      node.i.bar(3, "2");
      expect(spy.calls.allArgs()).toEqual([
        [{foo: 5}, "1"],
        [{foo: 5, bar: 3}, "2"]
      ]);
    });
  });
});
