import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Throttler();
      expect(node.in.tag).toBeDefined();
      expect(node.in.tick).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Throttler;

    beforeEach(function () {
      node = new Throttler();
    });

    describe("on first input", function () {
      it("should not send anything", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.tag, 5, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on subsequent input", function () {
      beforeEach(function () {
        node.send(node.in.tag, 5, "1");
      });

      it("should send false with previous tag", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.tag, 10, "2");
        expect(node.out.$.send).toHaveBeenCalledWith(false, "1");
      });
    });

    describe("on tick", function () {
      beforeEach(function () {
        node.send(node.in.tag, 5, "1");
      });

      it("should send true with previous tag", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.tick, true);
        expect(node.out.$.send).toHaveBeenCalledWith(true, "1");
      });
    });
  });
});
