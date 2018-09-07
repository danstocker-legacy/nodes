import {InPort} from "../node/InPort";
import {Inputs} from "../node/Inputs";
import {InputSyncerNode} from "./InputSyncerNode";

describe("InputSyncerNode", function () {
  const process = jasmine.createSpy();

  class MyNode extends InputSyncerNode {
    public ports: {
      a: InPort<number>,
      b: InPort<number>
    };

    constructor() {
      super();
      this.ports = {
        a: new InPort(this),
        b: new InPort(this)
      };
    }

    public process(inputs: Inputs, tag?: string): void {
      process(inputs, tag);
    }
  }

  describe("#send()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
    });

    it("should invoke #process() with next full set of inputs", function () {
      process.calls.reset();
      node.send(new Map([[node.ports.a, 5]]), "1");
      expect(process).not.toHaveBeenCalled();

      process.calls.reset();
      node.send(new Map([[node.ports.b, 4]]), "2");
      expect(process).not.toHaveBeenCalled();

      process.calls.reset();
      node.send(new Map([[node.ports.a, 3]]), "2");
      expect(process).toHaveBeenCalledWith(
        new Map([[node.ports.a, 3], [node.ports.b, 4]]), "2");

      process.calls.reset();
      node.send(new Map([[node.ports.b, 2]]), "1");
      expect(process).toHaveBeenCalledWith(
        new Map([[node.ports.a, 5], [node.ports.b, 2]]), "1");
    });
  });
});
