import {connect} from "../node";
import {noop$, TNoop} from "./noop$";

describe("noop$", function () {
  describe("on d_val", function () {
    let node: TNoop<number>;

    beforeEach(function () {
      node = noop$();
    });

    it("should forward d_val", function () {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.d_val(5, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
