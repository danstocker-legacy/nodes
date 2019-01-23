import {connect} from "../../node";
import {Mapper$, TMapper} from "./TMapper";

describe("Mapper$", () => {
  describe("on input (d_val)", () => {
    let node: TMapper<number, boolean>;

    beforeEach(() => {
      node = Mapper$((value) => value > 5);
    });

    it("should emit on d_val", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.d_val(6, "1");
      expect(spy).toHaveBeenCalledWith(true, "1");
    });

    describe("when callback throws", () => {
      beforeEach(() => {
        node = Mapper$(() => {
          throw new Error();
        });
      });

      it("should bounce d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith(6, "1");
      });

      it("should emit on error", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_val(6, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
