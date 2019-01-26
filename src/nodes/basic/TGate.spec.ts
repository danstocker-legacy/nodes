import {connect} from "../../node";
import {Gate$, TGate} from "./TGate";

describe("Gate$()", () => {
  describe("on input (all)", () => {
    let node: TGate<number>;

    beforeEach(() => {
      node = Gate$();
    });

    describe("when st_open is true", () => {
      it("should forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.all({d_val: 5, st_open: true}, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when st_open is false", () => {
      it("should not forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.all({d_val: 5, st_open: false}, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (d_val)", () => {
    describe("when open", () => {
      let node: TGate<number>;

      beforeEach(() => {
        node = Gate$(true);
      });

      it("should forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when closed", () => {
      let node: TGate<number>;

      beforeEach(() => {
        node = Gate$(false);
      });

      it("should not forward d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
