import {connect} from "../../node";
import {Change$Detector, TChangeDetector} from "./TChangeDetector";

describe("Change$Detector()", () => {
  describe("when callback is specified", () => {
    let node: TChangeDetector<number>;

    beforeEach(() => {
      node = Change$Detector((a, b) => a % 2 === b % 2);
    });

    describe("on input (d_val)", () => {
      describe("when not equal to last value", () => {
        beforeEach(() => {
          node.i.d_val(5, "1");
        });

        it("should emit true", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_eq, spy);
          node.i.d_val(4, "2");
          expect(spy).toHaveBeenCalledWith(true, "2");
        });
      });

      describe("when equal to last value", () => {
        beforeEach(() => {
          node.i.d_val(5, "1");
        });

        it("should emit false", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_eq, spy);
          node.i.d_val(7, "2");
          expect(spy).toHaveBeenCalledWith(false, "2");
        });
      });

      describe("when callback throws", () => {
        beforeEach(() => {
          node = Change$Detector(() => {
            throw new Error();
          });
        });

        it("should bounce input", () => {
          const spy = jasmine.createSpy();
          connect(node.o.b_d_val, spy);
          node.i.d_val(4, "2");
          expect(spy).toHaveBeenCalledWith(4, "2");
        });

        it("should emit error", () => {
          const spy = jasmine.createSpy();
          connect(node.o.ev_err, spy);
          node.i.d_val(4, "2");
          expect(spy).toHaveBeenCalledWith("Error", "2");
        });
      });
    });
  });

  describe("when callback is not specified", () => {
    let node: TChangeDetector<number>;

    beforeEach(() => {
      node = Change$Detector();
    });

    describe("on input (d_val)", () => {
      describe("when different than last value", () => {
        beforeEach(() => {
          node.i.d_val(5, "1");
        });

        it("should emit true", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_eq, spy);
          node.i.d_val(4, "2");
          expect(spy).toHaveBeenCalledWith(true, "2");
        });
      });

      describe("when same as last value", () => {
        beforeEach(() => {
          node.i.d_val(5, "1");
        });

        it("should emit false", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_eq, spy);
          node.i.d_val(5, "2");
          expect(spy).toHaveBeenCalledWith(false, "2");
        });
      });
    });
  });
});
