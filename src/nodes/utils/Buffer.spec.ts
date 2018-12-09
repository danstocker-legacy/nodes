import {Buffer} from "./Buffer";

describe("Buffer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Buffer();
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_open).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.st_size).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Buffer<number>;

    beforeEach(function () {
      node = new Buffer();
    });

    describe("when buffer is open", function () {
      beforeEach(function () {
        node.send(node.i.st_open, true);
      });

      it("should forward input", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when buffer is not open", function () {
      it("should should not send output", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });

      it("should emit buffer size on `st_size`", function () {
        spyOn(node.o.st_size, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.st_size.send).toHaveBeenCalledWith(1);
      });
    });

    describe("on opening buffer", function () {
      beforeEach(function () {
        node.send(node.i.d_val, 5, "1");
        node.send(node.i.d_val, 3, "2");
        node.send(node.i.d_val, 6, "3");
      });

      it("should send buffered inputs to output", function () {
        const spy = spyOn(node.o.d_val, "send");
        node.send(node.i.st_open, true);
        expect(spy.calls.allArgs()).toEqual([
          [5, "1"],
          [3, "2"],
          [6, "3"]
        ]);
      });

      it("should emit buffer size on `st_size`", function () {
        spyOn(node.o.st_size, "send");
        node.send(node.i.st_open, true);
        expect(node.o.st_size.send).toHaveBeenCalledWith(0);
      });
    });
  });
});
