import {Comparer} from "./Comparer";

describe("Comparer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Comparer(() => true);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Comparer<number>;

    beforeEach(function () {
      node = new Comparer((a, b) => a === b);
    });

    it("should send result of equality callback", function () {
      spyOn(node.out.$, "send");
      node.send(node.in.$, {a: 5, b: 5}, "1");
      expect(node.out.$.send).toHaveBeenCalledWith(true, "1");
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Comparer(() => {
          throw error;
        });
      });

      it("should bounce inputs");
    });
  });
});