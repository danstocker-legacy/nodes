import {Unfolder} from "./Unfolder";

describe("Unfolder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Unfolder(() => null);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
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
      const spy = spyOn(node.out.$, "send");
      node.send(node.in.$, [1, 2, 3], "1");
      expect(spy.calls.allArgs()).toEqual([
        [1, "1"],
        [2, "1"],
        [3, "1"]
      ]);
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Unfolder(function* () {
          throw error;
        });
      });

      it("should send error", function () {
        spyOn(node.svc.err, "send");
        node.send(node.in.$, [1, 2, 3], "1");
        expect(node.svc.err.send).toHaveBeenCalledWith({
          payload: {
            err: error,
            node
          },
          type: "CALLBACK_ERROR"
        }, "1");
      });
    });
  });
});
