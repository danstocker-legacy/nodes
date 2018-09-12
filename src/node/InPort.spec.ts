import {INode} from "./INode";
import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {Node} from "./Node";
import {Ports} from "./Ports";

class MyNode extends Node {
  public readonly ports: Ports;

  constructor() {
    super();
  }

  // tslint:disable:no-empty
  protected process(inputs: Inputs) {
  }
}

describe("InPort", function () {
  describe("constructor", function () {
    let node: INode;

    beforeEach(function () {
      node = new MyNode();
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
      node = new MyNode();
      port = new InPort(node);
    });

    it("should send value to node", function () {
      spyOn(node, "send");
      port.send(5, "100");
      expect(node.send).toHaveBeenCalledWith(new Map([[port, 5]]), "100");
    });
  });
});
