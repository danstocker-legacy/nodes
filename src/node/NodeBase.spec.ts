import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {NodeBase} from "./NodeBase";
import {OutPort} from "./OutPort";

describe("NodeBase", function () {
  const process = jasmine.createSpy();

  class MyNode extends NodeBase {
    public readonly in: {
      foo: InPort<number>
    };
    public readonly out: {
      foo: OutPort<number>
    };

    constructor() {
      super();
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

  describe("#openInPort()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
    });

    describe("when already open", function () {
      beforeEach(function () {
        node.openInPort("foo", new InPort(node));
      });

      it("should throw", function () {
        expect(function () {
          node.openInPort("foo", new InPort(node));
        }).toThrow();
      });
    });
  });

  describe("#openOutPort()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
    });

    describe("when already open", function () {
      beforeEach(function () {
        node.openOutPort("foo", new OutPort(node));
      });

      it("should throw", function () {
        expect(function () {
          node.openOutPort("foo", new OutPort(node));
        }).toThrow();
      });
    });
  });

  describe("#closeInPort()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
      node.openInPort("foo", new InPort(node));
    });

    describe("when port is connected", function () {
      let inPort: InPort<number>;
      let outPort: OutPort<number>;

      beforeEach(function () {
        const node2 = new MyNode();
        node2.openOutPort("foo", new OutPort(node2));
        inPort = node.in.foo;
        outPort = node2.out.foo;
        inPort.connect(outPort);
      });

      it("should disconnect first", function () {
        spyOn(inPort, "disconnect");
        node.closeInPort("foo");
        expect(inPort.disconnect).toHaveBeenCalledWith();
      });
    });
  });

  describe("#closeOutPort()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
      node.openOutPort("foo", new OutPort(node));
    });

    describe("when port is connected", function () {
      let inPort: InPort<number>;
      let outPort: OutPort<number>;

      beforeEach(function () {
        const node2 = new MyNode();
        node2.openInPort("foo", new InPort(node2));
        inPort = node2.in.foo;
        outPort = node.out.foo;
        outPort.connect(inPort);
      });

      it("should disconnect first", function () {
        spyOn(outPort, "disconnect");
        node.closeOutPort("foo");
        expect(outPort.disconnect).toHaveBeenCalledWith();
      });
    });
  });

  describe("#send()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
      node.openInPort("foo", new InPort(node));
    });

    it("should pass inputs directly to #process", function () {
      process.calls.reset();
      const inputs: Inputs = new Map();
      node.send(inputs, "foo");
      expect(process).toHaveBeenCalledWith(inputs, "foo");
    });
  });
});
