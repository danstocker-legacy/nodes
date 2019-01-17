import {connect} from "../node";
import {mapper$, TMapper} from "./mapper$";

describe("mapper$", function () {
  describe("on input (d_val)", function () {
    let node: TMapper<number, boolean>;

    beforeEach(function () {
      node = mapper$((value) => value > 5);
    });

    it("should emit on d_val", function () {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.d_val(6, "1");
      expect(spy).toHaveBeenCalledWith(true, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = mapper$(() => {
          throw new Error();
        });
      });

      it("should bounce d_val", function () {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith(6, "1");
      });

      it("should emit on error", function () {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
