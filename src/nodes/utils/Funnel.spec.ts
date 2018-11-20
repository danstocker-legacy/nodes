import {Funnel} from "./Funnel";

describe("Funnel", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Funnel<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.in.foo).toBeDefined();
      expect(node.in.bar).toBeDefined();
      expect(node.in.baz).toBeDefined();
      expect(node.out.val).toBeDefined();
      expect(node.out.case).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Funnel<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new Funnel(["foo", "bar", "baz"]);
    });

    it("should forward to specified output", function () {
      spyOn(node.out.val, "send");
      spyOn(node.out.case, "send");
      node.in.foo.send(5, "1");
      expect(node.out.val.send).toHaveBeenCalledWith(5, "1");
      expect(node.out.case.send).toHaveBeenCalledWith("foo", "1");
    });
  });
});
