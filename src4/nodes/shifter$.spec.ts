import {connect} from "../node";
import {shifter$, TShifter} from "./shifter$";

describe("shifter$", function () {
  describe("on d_val", function () {
    let node: TShifter<number>;

    beforeEach(function () {
      node = shifter$();
      node.i.d_val(5, "1");
    });

    it("should emit last input on d_val", function () {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.d_val(3, "2");
      expect(spy).toHaveBeenCalledWith(5, "2");
    });
  });
});
