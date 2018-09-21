import {InPort, OutPort} from "../node";
import {Sequencer} from "./Sequencer";

describe("Sequencer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Sequencer(3);
      expect(node.in).toEqual({
        ref: new InPort(node),
        1: new InPort(node),
        2: new InPort(node),
        3: new InPort(node)
      });
      expect(node.out).toEqual({
        1: new OutPort(node),
        2: new OutPort(node),
        3: new OutPort(node)
      });
    });

    describe("on missing argument", function () {
      it("should default to 1", function () {
        const node = new Sequencer();
        expect(node.in).toEqual({
          ref: new InPort(node),
          1: new InPort(node)
        });
        expect(node.out).toEqual({
          1: new OutPort(node)
        });
      });
    });
  });

  describe("#send()", function () {
    let node: Sequencer;

    beforeEach(function () {
      node = new Sequencer(2);
    });

    describe("on passing input matching next tag", function () {
      beforeEach(function () {
        node.in.ref.send(null, "1");
        node.in.ref.send(null, "2");
        node.in[1].send("foo", "2");
        node.in[2].send("bar", "1");
      });

      it("should forward inputs for all matching tags", function () {
        const spy = spyOn(node.out[1], "send");
        node.in[1].send("baz", "1");
        const args = spy.calls.allArgs();
        expect(args.length).toBe(2);
        expect(args[0]).toEqual(["baz", "1"]);
        expect(args[1]).toEqual(["foo", "2"]);
      });
    });
  });
});
