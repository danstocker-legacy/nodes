import {connect} from "../node";
import {sampler$, TSampler} from "./sampler$";

describe("sampler$", () => {
  describe("on input (ev_smp)", () => {
    let node: TSampler<number>;

    beforeEach(function () {
      node = sampler$();
      node.i.d_val(5, "1");
    });

    it("should emit on d_val", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.ev_smp(null, "2");
      expect(spy).toHaveBeenCalledWith(5, "2");
    });
  });
});
