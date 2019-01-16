import {connect} from "../node";
import {filter$, TFilter} from "./filter$";

describe("filter$", function () {
  describe("on d_val", function () {
    let node: TFilter<number>;

    beforeEach(function () {
      node = filter$((value) => value > 5);
    });

    describe("when value satisfies callback", function () {
      it("should forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when value doesn't satisfies callback", function () {
      it("should not forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = filter$(() => {
          throw new Error();
        });
      });

      it("should bounce d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith(6, "1");
      });

      it("should emit error", function () {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
