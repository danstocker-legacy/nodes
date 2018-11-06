import {Tracker} from "./Tracker";

// tslint:disable
describe("Tracker", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Tracker(["foo", "bar"]);
      expect(node.in.foo).toBeDefined();
      expect(node.in.bar).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tracker;

    beforeEach(function () {
      node = new Tracker(["foo", "bar"]);
    });

    describe("before first full set", function () {
      it("should not forward input set", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.foo, 1, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on first full set", function () {
      beforeEach(function () {
        node.send(node.in.foo, 1, "1");
      });

      it("should forward full set", function () {
        const spy = spyOn(node.out.$, "send");
        node.send(node.in.bar, 10, "1");
        const args = spy.calls.allArgs();
        expect(args).toEqual([
          [{foo: 1, bar: 10}, "1"]
        ]);
      });

      describe("when ports have multiple inputs", function () {
        beforeEach(function () {
          node.send(node.in.foo, 2, "2");
        });

        it("should release all full sets", function () {
          const spy = spyOn(node.out.$, "send");
          node.send(node.in.bar, 10, "1");
          const args = spy.calls.allArgs();
          expect(args).toEqual([
            [{foo: 1, bar: 10}, "1"],
            [{foo: 2, bar: 10}, "2"]
          ]);
        });
      });
    });

    describe("after first full set", function () {
      beforeEach(function () {
        node.send(node.in.foo, 1, "1");
        node.send(node.in.bar, 10, "1");
      });

      it("should forward all cached inputs", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.foo, 2, "2");
        expect(node.out.$.send).toHaveBeenCalledWith({foo: 2, bar: 10}, "2");
      });
    });
  });
});
