import {Batcher} from "./Batcher";

describe("Batcher", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const batcher: Batcher<number> = new Batcher(3);
      expect(batcher.ports.in.node).toBe(batcher);
      expect(batcher.ports.out.node).toBe(batcher);
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
        spyOn(batcher.ports.out, "send");
        batcher.send(1, batcher.ports.in);
        batcher.send(2, batcher.ports.in);
        batcher.send(3, batcher.ports.in);
        expect(batcher.ports.out.send)
        .toHaveBeenCalledWith([1, 2, 3], undefined);
      });
    });
  });
});
