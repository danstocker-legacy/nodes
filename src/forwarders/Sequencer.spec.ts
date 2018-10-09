import {InPort, OutPort} from "../node";
import {Sequencer} from "./Sequencer";

describe("Sequencer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Sequencer(3);
      expect(node.in.ref).toBeDefined();
      expect(node.in[0]).toBeDefined();
      expect(node.in[1]).toBeDefined();
      expect(node.in[2]).toBeDefined();
      expect(node.out[0]).toBeDefined();
      expect(node.out[1]).toBeDefined();
      expect(node.out[2]).toBeDefined();
    });

    describe("on missing argument", function () {
      it("should default to 1", function () {
        const node = new Sequencer();
        expect(node.in.ref).toBeDefined();
        expect(node.in[0]).toBeDefined();
        expect(node.out[0]).toBeDefined();
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
        node.in[0].send("foo", "2");
        node.in[1].send("bar", "1");
      });

      it("should forward inputs for all matching tags", function () {
        const spy = spyOn(node.out[0], "send");
        node.in[0].send("baz", "1");
        const args = spy.calls.allArgs();
        expect(args.length).toBe(2);
        expect(args[0]).toEqual(["baz", "1"]);
        expect(args[1]).toEqual(["foo", "2"]);
      });
    });
  });
});
