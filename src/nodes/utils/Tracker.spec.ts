import {Tracker} from "./Tracker";

// tslint:disable
describe("Tracker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Tracker<{ foo: number, bar: boolean }>(["foo", "bar"]);
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
      expect(node.o.tra).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tracker<{ foo: number, bar: boolean }>;

    beforeEach(function () {
      node = new Tracker(["foo", "bar"]);
    });

    it("should forward all cached inputs", function () {
      spyOn(node.o.tra, "send");
      node.send(node.i.foo, 2, "2");
      expect(node.o.tra.send).toHaveBeenCalledWith({foo: 2}, "2");
    });
  });
});
