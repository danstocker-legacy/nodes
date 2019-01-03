import {UComparer} from "./UComparer";

describe("UComparer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new UComparer(() => true);
      expect(node.i.i).toBeDefined();
      expect(node.b.i).toBeDefined();
      expect(node.o.d_eq).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: UComparer<number>;

    beforeEach(function () {
      node = new UComparer((a, b) => a === b);
    });

    it("should send result of equality callback", function () {
      spyOn(node.o.d_eq, "send");
      node.send(node.i.i, {d_a: 5, d_b: 5}, "1");
      expect(node.o.d_eq.send).toHaveBeenCalledWith(true, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new UComparer(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.b.i, "send");
        node.send(node.i.i, {d_a: 5, d_b: 5}, "1");
        expect(node.b.i.send)
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
