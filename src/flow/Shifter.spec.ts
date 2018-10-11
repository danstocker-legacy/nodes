import {Shifter} from "./Shifter";

describe("Shifter", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Shifter(0);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Shifter<number>;

    beforeEach(function () {
      node = new Shifter(0);
    });

    it("should output previous input", function () {
      spyOn(node.out.$, "send");
      node.send(new Map([[node.in.$, 1]]), "1");
      expect(node.out.$.send).toHaveBeenCalledWith(0, "1");
    });

    it("should store previous value", function () {
      node.send(new Map([[node.in.$, 1]]), "1");
      spyOn(node.out.$, "send");
      node.send(new Map([[node.in.$, 2]]), "2");
      expect(node.out.$.send).toHaveBeenCalledWith(1, "2");
    });
  });
});
