import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Debouncer(0);
      expect(node.i.ev_sig).toBeDefined();
      expect(node.o.ev_sig).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Debouncer<number>;

    beforeEach(function () {
      jasmine.clock().install();
      node = new Debouncer(500);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("on new input within delay", function () {
      beforeEach(function () {
        node.send(node.i.ev_sig, null, "1");
      });

      it("should not emit", function () {
        spyOn(node.o.ev_sig, "send");
        jasmine.clock().tick(499);
        node.send(node.i.ev_sig, null, "2");
        expect(node.o.ev_sig.send).not.toHaveBeenCalled();
      });
    });

    describe("on timer expiry", function () {
      beforeEach(function () {
        node.send(node.i.ev_sig, null, "2");
      });

      it("should emit", function () {
        spyOn(node.o.ev_sig, "send");
        jasmine.clock().tick(500);
        expect(node.o.ev_sig.send).toHaveBeenCalledWith(null, "2");
      });
    });
  });
});
