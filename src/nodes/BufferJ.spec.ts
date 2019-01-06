import {BufferJ} from "./BufferJ";

describe("BufferJ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new BufferJ<number>();
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_open).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.st_size).toBeDefined();
    });
  });

  describe("on input", function () {
    let node: BufferJ<number>;

    beforeEach(function () {
      node = new BufferJ();
    });

    describe("on opening buffer", function () {
      beforeEach(function () {
        node.i.d_val.send(5, "1");
        node.i.st_open.send(false, "1");
        node.i.d_val.send(3, "2");
        node.i.st_open.send(false, "2");
      });

      it("should emit buffered inputs plus new input on `o.d_val`", function () {
        const spy = spyOn(node.o.d_val, "send");
        node.i.d_val.send(6, "3");
        node.i.st_open.send(true, "3");
        expect(spy.calls.allArgs()).toEqual([
          [5, "1"],
          [3, "2"],
          [6, "3"]
        ]);
      });
    });

    describe("when buffer is open", function () {
      it("should forward input", function () {
        spyOn(node.o.d_val, "send");
        node.i.d_val.send(5, "1");
        node.i.st_open.send(true, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "1");
      });

      it("should emit buffer size", function () {
        spyOn(node.o.st_size, "send");
        node.i.d_val.send(5, "1");
        node.i.st_open.send(true, "1");
        expect(node.o.st_size.send).toHaveBeenCalledWith(0, "1");
      });
    });

    describe("when buffer is closed", function () {
      it("should not forward input", function () {
        spyOn(node.o.d_val, "send");
        node.i.d_val.send(5, "1");
        node.i.st_open.send(false, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });

      it("should emit buffer size", function () {
        spyOn(node.o.st_size, "send");
        node.i.d_val.send(5, "1");
        node.i.st_open.send(false, "1");
        expect(node.o.st_size.send).toHaveBeenCalledWith(1, "1");
      });
    });
  });
});
