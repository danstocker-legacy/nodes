import {UBuffer} from "./UBuffer";

describe("Buffer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new UBuffer();
      expect(node.i.i).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.st_size).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: UBuffer<number>;

    beforeEach(function () {
      node = new UBuffer();
    });

    describe("on opening buffer", function () {
      beforeEach(function () {
        node.send(node.i.i, {d_val: 5, st_open: false}, "1");
        node.send(node.i.i, {d_val: 3, st_open: false}, "2");
      });

      it("should emit buffered inputs plus new input on `o.d_val`", function () {
        const spy = spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 6, st_open: true}, "3");
        expect(spy.calls.allArgs()).toEqual([
          [5, "1"],
          [3, "2"],
          [6, "3"]
        ]);
      });

      it("should emit buffer size on `o.st_size`", function () {
        spyOn(node.o.st_size, "send");
        node.send(node.i.i, {d_val: 6, st_open: true}, "3");
        expect(node.o.st_size.send).toHaveBeenCalledWith(0, "3");
      });
    });

    describe("when buffer is open", function () {
      beforeEach(function () {
        node.send(node.i.i, {d_val: 5, st_open: true}, "1");
      });

      it("should forward input", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 5, st_open: true}, "2");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "2");
      });
    });

    describe("on closing buffer", function () {
      beforeEach(function () {
        node.send(node.i.i, {d_val: 5, st_open: true}, "1");
      });

      it("should not emit on `o.d_val`", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 5, st_open: false}, "2");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });

      it("should emit buffer size on `o.st_size`", function () {
        spyOn(node.o.st_size, "send");
        node.send(node.i.i, {d_val: 5, st_open: false}, "2");
        expect(node.o.st_size.send).toHaveBeenCalledWith(1, "2");
      });
    });

    describe("when buffer is closed", function () {
      it("should should not emit on `o.d_val`", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 5, st_open: false}, "2");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });

      it("should emit buffer size on `st_size`", function () {
        spyOn(node.o.st_size, "send");
        node.send(node.i.i, {d_val: 5, st_open: false}, "2");
        expect(node.o.st_size.send).toHaveBeenCalledWith(1, "2");
      });
    });
  });
});
