import {connect} from "../node";
import {TUnfolder, unfolder$} from "./unfolder$";

describe("unfolder$", function () {
  describe("on d_fold", function () {
    let node: TUnfolder<Array<number>, number>;

    beforeEach(function () {
      node = unfolder$(function* (value) {
        value = value.slice();
        while (value.length > 0) {
          yield value.shift();
        }
      });
    });

    it("should emit d_val", function () {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.d_fold([1, 2, 3], "1");
      expect(spy.calls.allArgs()).toEqual([
        [1, "1"],
        [2, "1"],
        [3, "1"]
      ]);
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = unfolder$(function* () {
          throw new Error();
        });
      });

      it("should bounce d_fold", function () {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_fold, spy);
        node.i.d_fold([1, 2, 3], "1");
        expect(spy).toHaveBeenCalledWith([1, 2, 3], "1");
      });

      it("should emit ev_err", function () {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_fold([1, 2, 3], "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
