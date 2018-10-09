import {InPort, OutPort} from "../node";
import {Selector} from "./Selector";

describe("Selector", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Selector();
      expect(node.in.$).toBeDefined();
      expect(node.in.ref).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Selector<number>;

    beforeEach(function () {
      node = new Selector();
    });

    describe("when ref is truthy", function () {
      it("should forward value", function () {
        spyOn(node.out.$, "send");
        node.in.$.send(2, "1");
        node.in.ref.send(true, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when ref is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.out.$, "send");
        node.in.$.send(2, "1");
        node.in.ref.send(false, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });
  });
});
