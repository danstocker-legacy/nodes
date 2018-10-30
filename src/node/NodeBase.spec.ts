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
    it("should initialize id property", function () {
      const node = new MyNode();
      expect(new MyNode().id).toBe(String(1 + parseInt(node.id, 10)));
    });

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
    });

    describe("when port is permanent", function () {
      beforeEach(function () {
        node.openInPort("foo", new InPort(node, true));
        const node2 = new MyNode();
        node2.openOutPort("foo", new OutPort(node2));
        node.in.foo.connect(node2.out.foo);
      });

      it("should throw", function () {
        expect(function () {
          node.closeInPort("foo");
        }).toThrow();
      });
    });

    describe("when port is not permanent", function () {
      beforeEach(function () {
        node.openInPort("foo", new InPort(node));
      });

      describe("when port is connected", function () {
        let inPort: InPort<number>;

        beforeEach(function () {
          const node2 = new MyNode();
          node2.openOutPort("foo", new OutPort(node2));
          inPort = node.in.foo;
          inPort.connect(node2.out.foo);
        });

        it("should disconnect first", function () {
          spyOn(inPort, "disconnect");
          node.closeInPort("foo");
          expect(inPort.disconnect).toHaveBeenCalledWith();
        });
      });
    });
  });

  describe("#closeOutPort()", function () {
    let node: MyNode;

    beforeEach(function () {
      node = new MyNode();
    });

    describe("when port is permanent", function () {
      beforeEach(function () {
        node.openOutPort("foo", new OutPort(node, true));
        const node2 = new MyNode();
        node2.openInPort("foo", new InPort(node2));
        node.out.foo.connect(node2.in.foo);
      });

      it("should throw", function () {
        expect(function () {
          node.closeOutPort("foo");
        }).toThrow();
      });
    });

    describe("when port is not permanent", function () {
      beforeEach(function () {
        node.openOutPort("foo", new OutPort(node));
      });

      describe("when port is connected", function () {
        let outPort: OutPort<number>;

        beforeEach(function () {
          const node2 = new MyNode();
          node2.openInPort("foo", new InPort(node2));
          outPort = node.out.foo;
          outPort.connect(node2.in.foo);
        });

        it("should disconnect first", function () {
          spyOn(outPort, "disconnect");
          node.closeOutPort("foo");
          expect(outPort.disconnect).toHaveBeenCalledWith();
        });
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
