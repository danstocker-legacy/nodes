import {connect} from "../node";
import {folder$, TFolder} from "./folder$";

describe("folder$", function () {
  describe("on input (all)", function () {
    let node: TFolder<number, number>;

    beforeEach(function () {
      node = folder$((curr, next) => curr + next, 0);
    });

    describe("when ev_res is true", function () {
      beforeEach(function () {
        node.i.all({d_val: 5, ev_res: false}, "1");
        node.i.all({d_val: 3, ev_res: false}, "2");
      });

      it("should emit on d_fold", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_fold, spy);
        node.i.all({d_val: 4, ev_res: true}, "3");
        expect(spy).toHaveBeenCalledWith(12, "3");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = folder$(() => {
          throw new Error();
        });
      });

      it("should bounce d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.all({d_val: 5, ev_res: true}, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });

      it("should emit on ev_err", function () {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.all({d_val: 5, ev_res: true}, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });

  describe("on input (d_val)", function () {
    let node: TFolder<number, number>;

    beforeEach(function () {
      node = folder$((curr, next) => curr + next, 0);
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = folder$(() => {
          throw new Error();
        });
      });

      it("should bounce d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });

      it("should emit on ev_err", function () {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_val(5, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });

  describe("on input (ev_res)", function () {
    let node: TFolder<number, number>;

    beforeEach(function () {
      node = folder$((curr, next) => curr + next, 0);
    });

    describe("when truthy", function () {
      beforeEach(function () {
        node.i.ev_res(false, "1");
        node.i.d_val(5, "2");
        node.i.d_val(3, "3");
      });

      it("should emit on d_fold", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_fold, spy);
        node.i.ev_res(true, "4");
        expect(spy).toHaveBeenCalledWith(8, "4");
      });
    });

    describe("when falsy", function () {
      beforeEach(function () {
        node.i.ev_res(false, "1");
        node.i.d_val(5, "2");
        node.i.d_val(3, "3");
      });

      it("should not emit on d_fold", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_fold, spy);
        node.i.ev_res(false, "4");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
