import {Filter} from "./Filter";

describe("Filter", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Filter(() => null);
      expect(node.i.d_val).toBeDefined();
      expect(node.b.d_val).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Filter<number>;

    beforeEach(function () {
      node = new Filter((a) => a % 2 === 1);
    });

    describe("when input satisfies callback", function () {
      it("should forward input", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when input doesn't satisfy callback", function () {
      it("should not forward input", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 4, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Filter(() => {
          throw new Error("foo");
        });
      });

      it("should bounce input", function () {
        spyOn(node.b.d_val, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.b.d_val.send).toHaveBeenCalledWith(5, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
