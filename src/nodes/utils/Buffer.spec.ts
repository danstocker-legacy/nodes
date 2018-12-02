import {Buffer} from "./Buffer";

describe("Buffer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Buffer();
      expect(node.in.$).toBeDefined();
      expect(node.in.paused).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Buffer<number>;

    beforeEach(function () {
      node = new Buffer();
    });

    describe("when buffer is paused", function () {
      it("should should not send output", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when buffer is not paused", function () {
      beforeEach(function () {
        node.send(node.in.paused, false);
      });

      it("should forward input", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("on un-pausing buffer", function () {
      beforeEach(function () {
        node.send(node.in.$, 5, "1");
        node.send(node.in.$, 3, "2");
        node.send(node.in.$, 6, "3");
      });

      it("should send buffered inputs to output", function () {
        const spy = spyOn(node.out.$, "send");
        node.send(node.in.paused, false);
        expect(spy.calls.allArgs()).toEqual([
          [5, "1"],
          [3, "2"],
          [6, "3"]
        ]);
      });
    });
  });
});
