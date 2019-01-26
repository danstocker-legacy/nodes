import {connect} from "../../node";
import {Merger$, TMerger} from "./TMerger";

describe("Merger$()", () => {
  describe("on input", () => {
    let node: TMerger<{ foo: number, bar: number }>;

    beforeEach(() => {
      node = Merger$(["foo", "bar"]);
    });

    it("should emit on all", () => {
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
