import {connect} from "../../node";
import {Noop$, TNoop} from "./TNoop";

describe("Noop$", () => {
  describe("on input (d_val)", () => {
    let node: TNoop<number>;

    beforeEach(() => {
      node = Noop$();
    });

    it("should forward d_val", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.d_val(5, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
