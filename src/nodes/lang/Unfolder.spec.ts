import {Unfolder} from "./Unfolder";

describe("Unfolder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Unfolder(() => null);
      expect(node.i.d_fold).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.d_fold).toBeDefined();
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
      const spy = spyOn(node.o.d_val, "send");
      node.send(node.i.d_fold, [1, 2, 3], "1");
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
        spyOn(node.re.d_fold, "send");
        node.send(node.i.d_fold, [1, 2, 3], "1");
        expect(node.re.d_fold.send).toHaveBeenCalledWith([1, 2, 3], "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.d_fold, [1, 2, 3], "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
