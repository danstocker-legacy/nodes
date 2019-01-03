import {Merger} from "./Merger";

// tslint:disable
describe("Merger", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Merger<{ d_foo: number, d_bar: boolean }>(["d_foo", "d_bar"]);
      expect(node.i.d_foo).toBeDefined();
      expect(node.i.d_bar).toBeDefined();
      expect(node.o.o).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Merger<{ d_foo: number, d_bar: boolean }>;

    beforeEach(function () {
      node = new Merger(["d_foo", "d_bar"]);
    });

    it("should forward all cached inputs", function () {
      spyOn(node.o.o, "send");
      node.send(node.i.d_foo, 2, "2");
      expect(node.o.o.send).toHaveBeenCalledWith({d_foo: 2}, "2");
    });
  });
});
