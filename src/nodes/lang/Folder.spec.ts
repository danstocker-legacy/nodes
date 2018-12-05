import {Folder} from "./Folder";

describe("Folder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Folder(() => null);
      expect(node.in.$).toBeDefined();
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Folder<number, number>;

    beforeEach(function () {
      node = new Folder((curr, next) => curr + next, 1);
    });

    describe("before first truthy signal", function () {
      it("should apply callback to initial value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {res: false, $: 5}, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when res is falsy", function () {
      beforeEach(function () {
        node.send(node.in.$, {res: false, $: 2}, "1");
        node.send(node.in.$, {res: false, $: 3}, "2");
      });

      it("should apply callback to last reduced value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {res: false, $: 5}, "3");
        expect(node.out.$.send).toHaveBeenCalledWith(11, "3");
      });
    });

    describe("when res is truthy", function () {
      beforeEach(function () {
        node.send(node.in.$, {res: false, $: 2}, "1");
        node.send(node.in.$, {res: false, $: 3}, "2");
      });

      it("should reset reduced value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {res: true, $: 5}, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Folder(() => {
          throw error;
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.in.$, {res: false, $: 5}, "1");
        expect(node.re.$.send).toHaveBeenCalledWith({
          $: 5,
          res: false
        }, "1");
      });
    });
  });
});
