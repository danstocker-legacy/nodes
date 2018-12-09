import {Folder} from "./Folder";

describe("Folder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Folder(() => null);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Folder<number, number>;

    beforeEach(function () {
      node = new Folder((curr, next) => curr + next, 1);
    });

    describe("before first truthy signal", function () {
      it("should apply callback to initial value", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.$, {ev_res: false, $: 5}, "1");
        expect(node.o.$.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when ev_res is falsy", function () {
      beforeEach(function () {
        node.send(node.i.$, {ev_res: false, $: 2}, "1");
        node.send(node.i.$, {ev_res: false, $: 3}, "2");
      });

      it("should apply callback to last reduced value", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.$, {ev_res: false, $: 5}, "3");
        expect(node.o.$.send).toHaveBeenCalledWith(11, "3");
      });
    });

    describe("when ev_res is truthy", function () {
      beforeEach(function () {
        node.send(node.i.$, {ev_res: false, $: 2}, "1");
        node.send(node.i.$, {ev_res: false, $: 3}, "2");
      });

      it("should reset reduced value", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.$, {ev_res: true, $: 5}, "1");
        expect(node.o.$.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Folder(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, {ev_res: false, $: 5}, "1");
        expect(node.re.$.send).toHaveBeenCalledWith({
          $: 5,
          ev_res: false
        }, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.$, {ev_res: false, $: 5}, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
