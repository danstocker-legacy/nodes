import {Switch} from "./Switch";

describe("Switch", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Switch<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.in.$).toBeDefined();
      expect(node.in.case).toBeDefined();
      expect(node.out.foo).toBeDefined();
      expect(node.out.bar).toBeDefined();
      expect(node.out.baz).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Switch<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new Switch(["foo", "bar", "baz"]);
    });

    it("should forward to specified output", function () {
      spyOn(node.out.foo, "send");
      spyOn(node.out.bar, "send");
      spyOn(node.out.baz, "send");
      node.in.case.send("bar", "1");
      node.in.$.send(5, "1");
      expect(node.out.foo.send).not.toHaveBeenCalled();
      expect(node.out.bar.send).toHaveBeenCalledWith(5, "1");
      expect(node.out.baz.send).not.toHaveBeenCalled();
    });
  });
});
