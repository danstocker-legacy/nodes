import {Gate} from "./Gate";

describe("Gate", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Gate();
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_open).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.b.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Gate<number>;

    beforeEach(function () {
      node = new Gate();
    });

    describe("when sending to 'd_val'", function () {
      describe("when gate is open", function () {
        beforeEach(function () {
          node.send(node.i.st_open, true, "1");
        });

        it("should forward value", function () {
          spyOn(node.o.d_val, "send");
          node.send(node.i.d_val, 2, "2");
          expect(node.o.d_val.send).toHaveBeenCalledWith(2, "2");
        });
      });

      describe("when gate is closed", function () {
        beforeEach(function () {
          node.send(node.i.st_open, false, "1");
        });

        it("should not forward value", function () {
          spyOn(node.o.d_val, "send");
          node.send(node.i.d_val, 2, "2");
          expect(node.o.d_val.send).not.toHaveBeenCalled();
        });

        it("should bounce input", function () {
          spyOn(node.b.d_val, "send");
          node.send(node.i.d_val, 2, "2");
          expect(node.b.d_val.send).toHaveBeenCalledWith(2, "2");
        });
      });
    });
  });
});
