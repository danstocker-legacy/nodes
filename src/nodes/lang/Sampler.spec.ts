import {Sampler} from "./Sampler";

describe("Sampler", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Sampler();
      expect(node.i.$).toBeDefined();
      expect(node.i.tag).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Sampler<number>;

    beforeEach(function () {
      node = new Sampler();
    });

    describe("on receiving value", function () {
      it("should not send to output", function () {
        spyOn(node.out.$, "send");
        node.send(node.i.$, 5);
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on receiving tag", function () {
      beforeEach(function () {
        node.send(node.i.$, 5);
      });

      it("should release buffered value with tag", function () {
        spyOn(node.out.$, "send");
        node.send(node.i.tag, null, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
