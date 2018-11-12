import {Tracker} from "./Tracker";

// tslint:disable
describe("Tracker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Tracker(["foo", "bar"]);
      expect(node.in.foo).toBeDefined();
      expect(node.in.bar).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tracker<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = new Tracker(["foo", "bar"]);
    });

    it("should forward all cached inputs", function () {
      spyOn(node.out.$, "send");
      node.send(node.in.foo, 2, "2");
      expect(node.out.$.send).toHaveBeenCalledWith({foo: 2}, "2");
    });
  });
});
