import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Noop();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Noop<number>;

    beforeEach(function () {
      node = new Noop();
    });

    describe("when ending to send port", function () {
      it("should send value to out port", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, 5]]));
        expect(node.out.$.send).toHaveBeenCalledWith(5, undefined);
      });
    });
  });
});
