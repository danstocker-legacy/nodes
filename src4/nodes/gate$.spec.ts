import {connect} from "../node";
import {gate$, TGate} from "./gate$";

describe("gate$", function () {
  describe("on all", function () {
    let node: TGate<number>;

    beforeEach(function () {
      node = gate$();
    });

    describe("when st_open is true", function () {
      it("should forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.all({d_val: 5, st_open: true}, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when st_open is false", function () {
      it("should not forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.all({d_val: 5, st_open: false}, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

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
