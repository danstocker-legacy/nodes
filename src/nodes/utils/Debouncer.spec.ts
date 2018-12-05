import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Debouncer(0);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
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
        node.send(node.i.$, 5, "1");
      });

      it("should send false with previous tag", function () {
        jasmine.clock().tick(499);
        spyOn(node.o.$, "send");
        node.send(node.i.$, 5, "2");
        expect(node.o.$.send).toHaveBeenCalledWith(false, "1");
      });
    });

    describe("on timer expiry", function () {
      beforeEach(function () {
        node.send(node.i.$, 5, "1");
      });

      it("should send true with last tag", function () {
        spyOn(node.o.$, "send");
        jasmine.clock().tick(500);
        expect(node.o.$.send).toHaveBeenCalledWith(true, "1");
      });
    });
  });
});
