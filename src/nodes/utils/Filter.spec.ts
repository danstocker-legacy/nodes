import {Filter} from "./Filter";

describe("Filter", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Filter(() => null);
      expect(node.i.$).toBeDefined();
      expect(node.out.$).toBeDefined();
      expect(node.re.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Filter<number>;

    beforeEach(function () {
      node = new Filter((a) => a % 2 === 1);
    });

    describe("when input satisfies callback", function () {
      it("should forward input", function () {
        spyOn(node.out.$, "send");
        node.send(node.i.$, 5, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when input doesn't satisfy callback", function () {
      it("should not forward input", function () {
        spyOn(node.out.$, "send");
        node.send(node.i.$, 4, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Filter(() => {
          throw new Error("foo");
        });
      });

      it("should bounce input", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, 5, "1");
        expect(node.re.$.send).toHaveBeenCalledWith(5, "1");
      });

      it("should send error to output", function () {
        spyOn(node.out.error, "send");
        node.send(node.i.$, 5, "1");
        expect(node.out.error.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
