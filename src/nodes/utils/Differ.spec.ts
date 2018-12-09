import {Differ} from "./Differ";

describe("Differ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Differ(() => null);
      expect(node.i.d_val).toBeDefined();
      expect(node.o.b_d_val).toBeDefined();
      expect(node.o.d_diff).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Differ<number>;

    beforeEach(function () {
      node = new Differ((a, b) => a === b);
    });

    describe("on first input", function () {
      it("should send undefined", function () {
        spyOn(node.o.d_diff, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.d_diff.send).toHaveBeenCalledWith(undefined, "1");
      });
    });

    describe("for subsequent inputs", function () {
      beforeEach(function () {
        node.send(node.i.d_val, 5, "1");
      });

      it("should send equality with previous", function () {
        spyOn(node.o.d_diff, "send");
        node.send(node.i.d_val, 5, "2");
        expect(node.o.d_diff.send).toHaveBeenCalledWith(false, "2");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Differ(() => {
          throw new Error("foo");
        });
        node.send(node.i.d_val, 5, "1");
      });

      it("should bounce inputs", function () {
        spyOn(node.o.b_d_val, "send");
        node.send(node.i.d_val, 5, "2");
        expect(node.o.b_d_val.send).toHaveBeenCalledWith(5, "2");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.d_val, 5, "2");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "2");
      });
    });
  });
});
