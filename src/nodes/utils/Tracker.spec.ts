import {Tracker} from "./Tracker";

// tslint:disable
describe("Tracker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Tracker(["foo", "bar"]);
      expect(node.in.tag).toBeDefined();
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

    describe("on receiving value input", function () {
      it("should not send to output", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.foo, 5);
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on receiving tag", function () {
      beforeEach(function () {
        node.send(node.in.foo, 2);
        node.send(node.in.bar, 4);
      });

      it("should send copy of lst input values to output", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.tag, null, "1");
        expect(node.out.$.send).toHaveBeenCalledWith({
          bar: 4,
          foo: 2
        }, "1");
      });
    });
  });
});
