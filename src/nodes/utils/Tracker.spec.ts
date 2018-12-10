import {Tracker} from "./Tracker";

// tslint:disable
describe("Tracker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Tracker<{ d_foo: number, d_bar: boolean }>(["d_foo", "d_bar"]);
      expect(node.i.d_foo).toBeDefined();
      expect(node.i.d_bar).toBeDefined();
      expect(node.o.tra).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tracker<{ d_foo: number, d_bar: boolean }>;

    beforeEach(function () {
      node = new Tracker(["d_foo", "d_bar"]);
    });

    it("should forward all cached inputs", function () {
      spyOn(node.o.tra, "send");
      node.send(node.i.d_foo, 2, "2");
      expect(node.o.tra.send).toHaveBeenCalledWith({d_foo: 2}, "2");
    });
  });
});
