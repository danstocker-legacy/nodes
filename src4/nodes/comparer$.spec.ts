import {connect} from "../node";
import {comparer$, TComparer} from "./comparer$";

describe("comparer$", function () {
  describe("with callback", function () {
    describe("on d_vals", function () {
      let node: TComparer<number>;

      beforeEach(function () {
        node = comparer$((a, b) => a === b);
      });

      it("should emit d_eq", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_eq, spy);
        node.i.d_vals({a: 5, b: 5}, "1");
        expect(spy).toHaveBeenCalledWith(true, "1");
      });

      describe("when callback throws", function () {
        beforeEach(function () {
          node = comparer$(() => {
            throw new Error();
          });
        });

        it("should bounce d_vals", function () {
          const spy = jasmine.createSpy();
          connect(node.o.b_d_vals, spy);
          node.i.d_vals({a: 5, b: 5}, "1");
          expect(spy).toHaveBeenCalledWith({a: 5, b: 5}, "1");
        });

        it("should emit ev_err", function () {
          const spy = jasmine.createSpy();
          connect(node.o.ev_err, spy);
          node.i.d_vals({a: 5, b: 5}, "1");
          expect(spy).toHaveBeenCalledWith("Error", "1");
        });
      });
    });
  });

  describe("without callback", function () {
    describe("on d_vals", function () {
      let node: TComparer<number>;

      beforeEach(function () {
        node = comparer$();
      });

      it("should emit d_eq", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_eq, spy);
        node.i.d_vals({a: 5, b: 5}, "1");
        expect(spy).toHaveBeenCalledWith(true, "1");
      });
    });
  });
});
