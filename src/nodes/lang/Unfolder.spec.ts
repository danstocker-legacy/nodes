import {Unfolder} from "./Unfolder";

describe("Unfolder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Unfolder(() => null);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.re.$).toBeDefined();
      expect(node.e.err).toBeDefined();
    });
  });

  describe("#send()", function () {
    //tslint:disable
    let node: Unfolder<Array<number>, number>;

    beforeEach(function () {
      node = new Unfolder(function* (value) {
        value = value.slice();
        while (value.length > 0) {
          yield value.shift();
        }
      });
    });

    it("should send unfolded values", function () {
      const spy = spyOn(node.o.$, "send");
      node.send(node.i.$, [1, 2, 3], "1");
      expect(spy.calls.allArgs()).toEqual([
        [1, "1"],
        [2, "1"],
        [3, "1"]
      ]);
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Unfolder(function* () {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, [1, 2, 3], "1");
        expect(node.re.$.send).toHaveBeenCalledWith([1, 2, 3], "1");
      });

      it("should send error to output", function () {
        spyOn(node.e.err, "send");
        node.send(node.i.$, [1, 2, 3], "1");
        expect(node.e.err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
