import {reduce} from "../functional";
import {Merger} from "./Merger";

describe("Merger", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Merger<number>(3);
      expect(node.in[0]).toBeDefined();
      expect(node.in[1]).toBeDefined();
      expect(node.in[2]).toBeDefined();
      expect(node.out.$).toBeDefined();
    });

    describe("when count is omitted", function () {
      it("should open 2 input ports", function () {
        const node = new Merger<number>();
        expect(node.in[0]).toBeDefined();
        expect(node.in[1]).toBeDefined();
      });
    });
  });

  describe("#send()", function () {
    let node: Merger<number>;

    describe("when callback & initial are specified", function () {
      beforeEach(function () {
        node = new Merger(2, reduce.sum, 0);
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
