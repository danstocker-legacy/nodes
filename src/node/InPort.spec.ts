import {INode} from "./INode";
import {InPort} from "./InPort";
import {Ports} from "./Ports";

class Node implements INode {
  public readonly ports: Ports;

  constructor() {
    this.ports = {};
  }

  /* tslint:disable:no-empty */
  public send(port: InPort<any>, value: string) {
  }
}

describe("InPort", function () {
  describe("constructor", function () {
    let node: INode;

    beforeEach(function () {
      node = new Node();
    });

    it("should set node property", function () {
      const port: InPort<number> = new InPort(node);
      expect(port.node).toBe(node);
    });
  });

  describe("#send()", function () {
    let node: INode;
    let port: InPort<number>;

    beforeEach(function () {
      node = new Node();
      port = new InPort(node);
    });

    it("should send value to node", function () {
      spyOn(node, "send");
      port.send(5);
      expect(node.send).toHaveBeenCalledWith(port, 5);
    });
  });
});
