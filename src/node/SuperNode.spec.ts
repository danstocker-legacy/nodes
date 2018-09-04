import {Ports} from "./Ports";
import {SuperNode} from "./SuperNode";

describe("SuperNode", function () {
  describe("constructor", function () {
    it("should set ports", function () {
      const ports: Ports = {};
      const superNode: SuperNode = new SuperNode(ports);
      expect(superNode.ports).toBe(ports);
    });
  });

  describe("#send()", function () {
    let superNode: SuperNode;

    beforeEach(function () {
      superNode = new SuperNode({});
    });

    it("should throw", function () {
      expect(function () {
        superNode.send();
      }).toThrow();
    });
  });
});
