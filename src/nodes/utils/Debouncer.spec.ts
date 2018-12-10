import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Debouncer(0);
      expect(node.i.d_sig).toBeDefined();
      expect(node.o.d_deb).toBeDefined();
      expect(node.o.ev_deb).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Debouncer;

    beforeEach(function () {
      jasmine.clock().install();
      node = new Debouncer(500);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("on new input within delay", function () {
      beforeEach(function () {
        node.send(node.i.d_sig, 5, "1");
      });

      it("should send false on `d_deb` with previous tag", function () {
        jasmine.clock().tick(499);
        spyOn(node.o.d_deb, "send");
        node.send(node.i.d_sig, 5, "2");
        expect(node.o.d_deb.send).toHaveBeenCalledWith(false, "1");
      });
    });

    describe("on timer expiry", function () {
      beforeEach(function () {
        node.send(node.i.d_sig, 5, "1");
      });

      it("should send true on `d_deb` with last tag", function () {
        spyOn(node.o.d_deb, "send");
        jasmine.clock().tick(500);
        expect(node.o.d_deb.send).toHaveBeenCalledWith(true, "1");
      });

      it("should emit null on `ev_deb` with last tag", function () {
        spyOn(node.o.ev_deb, "send");
        jasmine.clock().tick(500);
        expect(node.o.ev_deb.send).toHaveBeenCalledWith(null, "1");
      });
    });
  });
});
