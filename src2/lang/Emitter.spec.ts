import {Emitter} from "./Emitter";

describe("Emitter", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Emitter(5);
      expect(node.in.tag).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Emitter<number>;

    beforeEach(function () {
      node = new Emitter(5);
    });

    it("should emit constant", function () {
      spyOn(node.out.$, "send");
      node.send(node.in.tag, null, "1");
      expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
