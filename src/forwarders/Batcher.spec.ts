import {Batcher} from "./Batcher";

describe("Batcher", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Batcher<number> = new Batcher(3);
      expect(node.in.$.node).toBe(node);
      expect(node.out.$).toBeDefined();
    });

    it("should set length property", function () {
      const node: Batcher<number> = new Batcher(3);
      expect(node.length).toBe(3);
    });
  });

  describe("#send()", function () {
    let node: Batcher<number>;

    beforeEach(function () {
      node = new Batcher(3);
    });

    describe("when buffer is full", function () {
      it("should pass batch to output", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, 1]]));
        node.send(new Map([[node.in.$, 2]]));
        node.send(new Map([[node.in.$, 3]]));
        expect(node.out.$.send)
        .toHaveBeenCalledWith([1, 2, 3], undefined);
      });
    });
  });
});
