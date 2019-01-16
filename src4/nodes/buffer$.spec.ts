import {connect} from "../node";
import {buffer$, TBuffer} from "./buffer$";

describe("buffer$", function () {
  describe("on all", function () {
    let node: TBuffer<number>;

    beforeEach(function () {
      node = buffer$();
    });

    describe("when st_open is false", function () {
      it("should emit st_size", function () {
        const spy = jasmine.createSpy();
        connect(node.o.st_size, spy);
        node.i.all({d_val: 5, st_open: false}, "1");
        expect(spy).toHaveBeenCalledWith(1, "1");
      });
    });

    describe("when st_open is true", function () {
      it("should forward d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.all({d_val: 5, st_open: true}, "1");
        expect(spy).toHaveBeenCalledWith(5, "1");
      });

      it("should emit st_size", function () {
        const spy = jasmine.createSpy();
        connect(node.o.st_size, spy);
        node.i.all({d_val: 5, st_open: true}, "1");
        expect(spy).toHaveBeenCalledWith(0, "1");
      });

      describe("but was false", function () {
        beforeEach(function () {
          node.i.all({d_val: 5, st_open: false}, "1");
          node.i.all({d_val: 3, st_open: false}, "2");
        });

        it("should flush contents and forward d_val", function () {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.all({d_val: 4, st_open: true}, "3");
          expect(spy.calls.allArgs()).toEqual([
            [5, "1"],
            [3, "2"],
            [4, "3"]
          ]);
        });

        it("should emit st_size", function () {
          const spy = jasmine.createSpy();
          connect(node.o.st_size, spy);
          node.i.all({d_val: 4, st_open: true}, "3");
          expect(spy).toHaveBeenCalledWith(0, "3");
        });
      });
    });
  });

  describe("on st_open", function () {
    let node: TBuffer<number>;

    beforeEach(function () {
      node = buffer$();
    });

    describe("when st_open is true", function () {
      describe("but was false", function () {
        beforeEach(function () {
          node.i.st_open(false, "1");
          node.i.d_val(5, "2");
          node.i.d_val(3, "3");
        });

        it("should flush contents", function () {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.st_open(true, "4");
          expect(spy.calls.allArgs()).toEqual([
            [5, "2"],
            [3, "3"]
          ]);
        });

        it("should emit st_size", function () {
          const spy = jasmine.createSpy();
          connect(node.o.st_size, spy);
          node.i.st_open(true, "4");
          expect(spy).toHaveBeenCalledWith(0, "4");
        });
      });
    });

    describe("when st_open is false", function () {
      beforeEach(function () {
        node.i.st_open(false, "1");
        node.i.d_val(5, "2");
        node.i.d_val(3, "3");
      });

      it("should emit st_size", function () {
        const spy = jasmine.createSpy();
        connect(node.o.st_size, spy);
        node.i.st_open(false, "4");
        expect(spy).toHaveBeenCalledWith(2, "4");
      });
    });
  });
});
