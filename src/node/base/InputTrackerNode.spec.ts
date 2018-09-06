import {InPort} from "../InPort";
import {Inputs} from "../Inputs";
import {OutPort} from "../OutPort";
import {InputTrackerNode} from "./InputTrackerNode";

describe("InputTrackerNode", function () {
  const process = jasmine.createSpy();

  class MyNode extends InputTrackerNode {
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

    it("should invoke #process() with last input values", function () {
      process.calls.reset();
      node.send(new Map([[node.ports.a, 5]]), "1");
      expect(process).toHaveBeenCalledWith(new Map([[node.ports.a, 5]]), "1");

      process.calls.reset();
      node.send(new Map([[node.ports.b, 4]]), "2");
      expect(process).toHaveBeenCalledWith(new Map([[node.ports.a, 5], [node.ports.b, 4]]), "2");

      process.calls.reset();
      node.send(new Map([[node.ports.a, 3]]), "3");
      expect(process).toHaveBeenCalledWith(new Map([[node.ports.a, 3], [node.ports.b, 4]]), "3");
    });
  });
});
