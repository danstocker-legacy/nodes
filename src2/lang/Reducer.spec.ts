import {Reducer} from "./Reducer";

describe("Reducer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Reducer(() => null);
      expect(node.in.$).toBeDefined();
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Reducer<number, number>;

    beforeEach(function () {
      node = new Reducer((curr, next) => curr + next, 1);
    });

    describe("before first truthy signal", function () {
      it("should apply callback to initial value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {res: false, val: 5}, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when res is falsy", function () {
      beforeEach(function () {
        node.send(node.in.$, {res: false, val: 2}, "1");
        node.send(node.in.$, {res: false, val: 3}, "2");
      });

      it("should apply callback to last reduced value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {res: false, val: 5}, "3");
        expect(node.out.$.send).toHaveBeenCalledWith(11, "3");
      });
    });

    describe("when res is truthy", function () {
      beforeEach(function () {
        node.send(node.in.$, {res: false, val: 2}, "1");
        node.send(node.in.$, {res: false, val: 3}, "2");
      });

      it("should reset reduced value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {res: true, val: 5}, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(6, "1");
      });
    });
  });
});
