import {ComparerJ} from "./ComparerJ";

describe("ComparerJ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new ComparerJ<number>(() => null);
      expect(node.i.d_a).toBeDefined();
      expect(node.i.d_b).toBeDefined();
      expect(node.b.d_a).toBeDefined();
      expect(node.b.d_b).toBeDefined();
      expect(node.o.d_eq).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("on input", function () {
    let node: ComparerJ<number>;

    beforeEach(function () {
      node = new ComparerJ((a, b) => a === b);
    });

    it("should send result of equality callback", function () {
      spyOn(node.o.d_eq, "send");
      node.i.d_a.send(1, "1");
      node.i.d_b.send(2, "1");
      expect(node.o.d_eq.send).toHaveBeenCalledWith(false, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new ComparerJ(() => {
          throw new Error();
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.b.d_a, "send");
        spyOn(node.b.d_b, "send");
        node.i.d_a.send(1, "1");
        node.i.d_b.send(2, "1");
        expect(node.b.d_a.send).toHaveBeenCalledWith(1, "1");
        expect(node.b.d_b.send).toHaveBeenCalledWith(2, "1");
      });

      it("should emit error", function () {
        spyOn(node.o.ev_err, "send");
        node.i.d_a.send(1, "1");
        node.i.d_b.send(2, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
