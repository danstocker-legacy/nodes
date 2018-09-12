import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {Node} from "./Node";

describe("Node", function () {
  const process = jasmine.createSpy();

  class MyNode extends Node {
    public readonly in: {
      foo: InPort<number>
    };

    constructor() {
      super();
      this.openInPort("foo", new InPort(this));
    }

    protected process(inputs: Inputs, tag?: string): void {
      process(inputs, tag);
    }
  }

  describe("constructor", function () {
    it("should initialize in & out properties", function () {
      const node = new MyNode();
      expect(node.in).toBeDefined();
      expect(node.out).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
    });

    it("should pass inputs directly to #process", function () {
      process.calls.reset();
      const inputs: Inputs = new Map();
      node.send(inputs, "foo");
      expect(process).toHaveBeenCalledWith(inputs, "foo");
    });
  });
});
