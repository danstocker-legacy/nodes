import {Comparer} from "./Comparer";

describe("Comparer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Comparer(() => true);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Comparer<number>;

    beforeEach(function () {
      node = new Comparer((a, b) => a === b);
    });

    it("should send result of equality callback", function () {
      spyOn(node.o.$, "send");
      node.send(node.i.$, {a: 5, b: 5}, "1");
      expect(node.o.$.send).toHaveBeenCalledWith(true, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Comparer(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, {a: 5, b: 5}, "1");
        expect(node.re.$.send)
        .toHaveBeenCalledWith({a: 5, b: 5}, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.$, {a: 5, b: 5}, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
