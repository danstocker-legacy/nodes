import {Batcher} from "./Batcher";

describe("Batcher", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const batcher: Batcher<number> = new Batcher(3);
      expect(batcher.in.$.node).toBe(batcher);
      expect(batcher.out.$).toBeDefined();
    });

    it("should set length property", function () {
      const batcher: Batcher<number> = new Batcher(3);
      expect(batcher.length).toBe(3);
    });
  });

  describe("#send()", function () {
    let batcher: Batcher<number>;

    beforeEach(function () {
      batcher = new Batcher(3);
    });

    describe("when buffer is full", function () {
      it("should pass batch to output", function () {
        spyOn(batcher.out.$, "send");
        batcher.send(new Map([[batcher.in.$, 1]]));
        batcher.send(new Map([[batcher.in.$, 2]]));
        batcher.send(new Map([[batcher.in.$, 3]]));
        expect(batcher.out.$.send)
        .toHaveBeenCalledWith([1, 2, 3], undefined);
      });
    });
  });
});
