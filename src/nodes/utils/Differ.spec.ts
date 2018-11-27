import {Differ} from "./Differ";

describe("Differ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Differ("() => null");
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Differ<number>;

    beforeEach(function () {
      node = new Differ("(a, b) => a === b");
    });

    describe("on first input", function () {
      it("should send undefined", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(undefined, "1");
      });
    });

    describe("for subsequent inputs", function () {
      beforeEach(function () {
        node.send(node.in.$, 5, "1");
      });

      it("should send equality with previous", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5, "2");
        expect(node.out.$.send).toHaveBeenCalledWith(false, "2");
      });
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Differ(`() => {
          throw error;
        }`);
        node.send(node.in.$, 5, "1");
      });

      it("should bounce inputs", function () {
        spyOn(node.bounced.$, "send");
        node.send(node.in.$, 5, "2");
        expect(node.bounced.$.send).toHaveBeenCalledWith(5, "2");
      });
    });
  });
});
