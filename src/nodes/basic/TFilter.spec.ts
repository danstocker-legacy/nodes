import {connect} from "../../node";
import {Filter$, TFilter} from "./TFilter";

describe("Filter$", () => {
  describe("on input (d_val)", () => {
    let node: TFilter<number>;

    beforeEach(() => {
      node = Filter$((value) => value > 5);
    });

    describe("when value satisfies callback", () => {
      it("should forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when value doesn't satisfies callback", () => {
      it("should not forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("when callback throws", () => {
      beforeEach(() => {
        node = Filter$(() => {
          throw new Error();
        });
      });

      it("should bounce d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith(6, "1");
      });

      it("should emit on ev_err", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
