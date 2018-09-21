import {Noop} from "../forwarders/index";
import {SuperNode} from "./SuperNode";

describe("SuperNode", function () {
  describe("constructor", function () {
    it("should set ports", function () {
      const node1 = new Noop<number>();
      const node2 = new Noop<number>();
      const superNode = new SuperNode({
        $: node1.in.$
      }, {
        $: node2.out.$
      });
      expect(superNode.in).toEqual({
        $: node1.in.$
      });
      expect(superNode.out).toEqual({
        $: node2.out.$
      });
    });
  });

  describe("#send()", function () {
    let superNode: SuperNode;

    beforeEach(function () {
      superNode = new SuperNode({}, {});
    });

    it("should throw", function () {
      expect(function () {
        superNode.send(new Map());
      }).toThrow();
    });
  });
});
