import {connect} from "../node";
import {gate$, TGate} from "./gate$";

describe("gate$", function () {
  describe("on d_val", function () {
    let node: TGate<number>;

    beforeEach(function () {
      node = gate$();
    });

    describe("when open", function () {
      beforeEach(function () {
        node.i.st_open(true);
      });

      it("should forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when closed", function () {
      beforeEach(function () {
        node.i.st_open(false);
      });

      it("should not forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
