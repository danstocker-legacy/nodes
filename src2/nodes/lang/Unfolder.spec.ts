import {Unfolder} from "./Unfolder";

describe("Unfolder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Unfolder(() => null);
      expect(node.svc.evt).toBeDefined();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    //tslint:disable
    let node: Unfolder<Array<number>, number>;

    beforeEach(function () {
      node = new Unfolder((curr: Array<number>) => {
        return {
          curr,
          done: curr.length === 1,
          next: curr.shift()
        };
      });
    });

    it("should send unfolded values", function () {
      const spy = spyOn(node.out.$, "send");
      node.send(node.in.$, [1, 2, 3], "1");
      expect(spy.calls.allArgs()).toEqual([
        [{
          done: false,
          idx: 0,
          val: 1
        }, "1"],
        [{
          done: false,
          idx: 1,
          val: 2
        }, "1"],
        [{
          done: true,
          idx: 2,
          val: 3
        }, "1"]
      ]);
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Unfolder(() => {
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
