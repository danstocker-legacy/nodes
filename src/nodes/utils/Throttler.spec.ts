import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Throttler();
      expect(node.i.ev_sig).toBeDefined();
      expect(node.i.ev_tick).toBeDefined();
      expect(node.o.ev_thro).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Throttler;

    beforeEach(function () {
      node = new Throttler();
    });

    describe("on first input", function () {
      it("should not send anything", function () {
        spyOn(node.o.ev_thro, "send");
        node.send(node.i.ev_sig, 5, "1");
        expect(node.o.ev_thro.send).not.toHaveBeenCalled();
      });
    });

    describe("on subsequent input", function () {
      beforeEach(function () {
        node.send(node.i.ev_sig, 5, "1");
      });

      it("should send false with previous tag", function () {
        spyOn(node.o.ev_thro, "send");
        node.send(node.i.ev_sig, 10, "2");
        expect(node.o.ev_thro.send).toHaveBeenCalledWith(false, "1");
      });
    });

    describe("on tick", function () {
      beforeEach(function () {
        node.send(node.i.ev_sig, 5, "1");
      });

      it("should send true with previous tag", function () {
        spyOn(node.o.ev_thro, "send");
        node.send(node.i.ev_tick, true);
        expect(node.o.ev_thro.send).toHaveBeenCalledWith(true, "1");
      });
    });
  });
});
