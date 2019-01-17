import {connect} from "../node";
import {delayer$, TDelayer} from "./delayer$";

describe("delayer$", () => {
  describe("on input (d_val)", () => {
    let node: TDelayer<number>;

    beforeEach(function () {
      node = delayer$(500);
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("before delay", () => {
      it("should not forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        jasmine.clock().tick(499);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("on delay", () => {
      it("should forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        jasmine.clock().tick(500);
        expect(spy).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
