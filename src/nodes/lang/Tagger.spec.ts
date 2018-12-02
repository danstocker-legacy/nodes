import {Tagger} from "./Tagger";

describe("Tagger", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Tagger();
      expect(node.in.$).toBeDefined();
      expect(node.in.tag).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tagger<number>;

    beforeEach(function () {
      node = new Tagger();
    });

    describe("on receiving value", function () {
      it("should not send to output", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5);
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on receiving tag", function () {
      beforeEach(function () {
        node.send(node.in.$, 5);
      });

      it("should release buffered value with tag", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.tag, null, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
