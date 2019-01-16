import {connect} from "../node";
import {joiner$, TJoiner} from "./joiner$";

describe("joiner$", function () {
  describe("on input", function () {
    let node: TJoiner<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = joiner$(["foo", "bar"]);
    });

    describe("before first full set", function () {
      it("should not emit all", function () {
        const spy = jasmine.createSpy();
        connect(node.o.all, spy);
        node.i.foo(5, "1");
        node.i.bar(3, "2");
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("on full set", function () {
      beforeEach(function () {
        node.i.foo(5, "1");
        node.i.bar(3, "2");
      });

      it("should emit all", function () {
        const spy = jasmine.createSpy();
        connect(node.o.all, spy);
        node.i.foo(4, "2");
        expect(spy).toHaveBeenCalledWith({foo: 4, bar: 3}, "2");
      });
    });
  });
});
