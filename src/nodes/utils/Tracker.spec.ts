import {Tracker} from "./Tracker";

// tslint:disable
describe("Tracker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Tracker(["foo", "bar"]);
      expect(node.i.tag).toBeDefined();
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
      expect(node.o.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tracker<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = new Tracker(["foo", "bar"]);
    });

    describe("on receiving value input", function () {
      it("should not send to output", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.foo, 5);
        expect(node.o.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on receiving tag", function () {
      beforeEach(function () {
        node.send(node.i.foo, 2);
        node.send(node.i.bar, 4);
      });

      it("should send copy of lst input values to output", function () {
        spyOn(node.o.$, "send");
        node.send(node.i.tag, null, "1");
        expect(node.o.$.send).toHaveBeenCalledWith({
          bar: 4,
          foo: 2
        }, "1");
      });
    });
  });
});
