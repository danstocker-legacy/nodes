import {ChangeDetector} from "./ChangeDetector";

describe("ChangeDetector", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new ChangeDetector();
      expect(node.in.$).not.toBeUndefined();
      expect(node.out.$).not.toBeUndefined();
    });
  });

  describe("#send()", function () {
    let node: ChangeDetector<number>;

    beforeEach(function () {
      node = new ChangeDetector();
      node.in.$.send(1);
    });

    describe("when next value is the same", function () {
      it("should send 0", function () {
        spyOn(node.out.$, "send");
        node.in.$.send(1, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(0, "1");
      });
    });

    describe("when next value is different", function () {
      it("should send 1", function () {
        spyOn(node.out.$, "send");
        node.in.$.send(10, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(1, "1");
      });
    });
  });
});
