import {Differ} from "./Differ";

describe("Differ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Differ(() => null);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Differ<number>;

    beforeEach(function () {
      node = new Differ((a, b) => a === b);
    });

    describe("on first input", function () {
      it("should send undefined", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.$, 5, "1");
        expect(node.o.$.send).toHaveBeenCalledWith(undefined, "1");
      });
    });

    describe("for subsequent inputs", function () {
      beforeEach(function () {
        node.send(node.i.$, 5, "1");
      });

      it("should send equality with previous", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.$, 5, "2");
        expect(node.o.$.send).toHaveBeenCalledWith(false, "2");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Differ(() => {
          throw new Error("foo");
        });
        node.send(node.i.$, 5, "1");
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, 5, "2");
        expect(node.re.$.send).toHaveBeenCalledWith(5, "2");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.$, 5, "2");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "2");
      });
    });
  });
});
