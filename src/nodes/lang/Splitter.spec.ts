import {Splitter} from "./Splitter";

describe("Splitter", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Splitter<{ foo: number, bar: boolean }>(["foo", "bar"]);
      expect(node.i.mul).toBeDefined();
      expect(node.o.foo).toBeDefined();
      expect(node.o.bar).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Splitter<{ foo: number, bar: boolean }>;

    beforeEach(function () {
      node = new Splitter(["foo", "bar"]);
    });

    it("should send split input to output ports", function () {
      spyOn(node.o.foo, "send");
      spyOn(node.o.bar, "send");
      node.send(node.i.mul, {foo: 5, bar: true}, "1");
      expect(node.o.foo.send).toHaveBeenCalledWith(5, "1");
      expect(node.o.bar.send).toHaveBeenCalledWith(true, "1");
    });
  });
});
