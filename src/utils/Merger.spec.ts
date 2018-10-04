import {sum} from "../functional";
import {InPort, OutPort} from "../node";
import {Merger} from "./Merger";

describe("Merger", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Merger<number>(3);
      expect(node.in).toEqual({
        0: new InPort(node),
        1: new InPort(node),
        2: new InPort(node)
      });
      expect(node.out).toEqual({
        $: new OutPort(node)
      });
    });

    describe("when count is omitted", function () {
      it("should open 2 input ports", function () {
        const node = new Merger<number>();
        expect(node.in).toEqual({
          0: new InPort(node),
          1: new InPort(node)
        });
      });
    });
  });

  describe("#send()", function () {
    let node: Merger<number>;

    describe("when callback & initial are specified", function () {
      beforeEach(function () {
        node = new Merger(2, sum, 0);
      });

      it("should send merged inputs", function () {
        spyOn(node.out.$, "send");
        node.in[0].send(1, "1");
        node.in[1].send(2, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(3, "1");
      });
    });

    describe("when callback & initial are not specified", function () {
      beforeEach(function () {
        node = new Merger();
      });

      it("should send inputs in array", function () {
        spyOn(node.out.$, "send");
        node.in[0].send(1, "1");
        node.in[1].send(2, "1");
        expect(node.out.$.send).toHaveBeenCalledWith([1, 2], "1");
      });
    });
  });
});
