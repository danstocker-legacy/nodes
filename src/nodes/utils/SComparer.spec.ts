import {SComparer} from "./SComparer";

describe("SComparer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new SComparer(() => true);
      expect(node.i.i).toBeDefined();
      expect(node.o.b_i).toBeDefined();
      expect(node.o.d_eq).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: SComparer<number>;

    beforeEach(function () {
      node = new SComparer((a, b) => a === b);
    });

    it("should send result of equality callback", function () {
      spyOn(node.o.d_eq, "send");
      node.send(node.i.i, {d_a: 5, d_b: 5}, "1");
      expect(node.o.d_eq.send).toHaveBeenCalledWith(true, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new SComparer(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.o.b_i, "send");
        node.send(node.i.i, {d_a: 5, d_b: 5}, "1");
        expect(node.o.b_i.send)
        .toHaveBeenCalledWith({d_a: 5, d_b: 5}, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.i, {d_a: 5, d_b: 5}, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
