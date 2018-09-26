import {InPort} from "./InPort";
import {Node} from "./Node";
import {OutPort} from "./OutPort";
import Spy = jasmine.Spy;

describe("Node", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      // tslint:disable:no-empty
      const node = new Node(() => {
      }, 2, 3);
      expect(node.in).toEqual({
        1: new InPort(node),
        2: new InPort(node)
      });
      expect(node.out).toEqual({
        1: new OutPort(node),
        2: new OutPort(node),
        3: new OutPort(node)
      });
    });

    describe("when omitting counts", function () {
      it("should add 1 port each", function () {
        const node = new Node(() => {
        });
        expect(node.in).toEqual({
          1: new InPort(node)
        });
        expect(node.out).toEqual({
          1: new OutPort(node)
        });
      });
    });
  });

  describe("#send()", function () {
    let node: Node;
    let cb: Spy;

    beforeEach(function () {
      cb = jasmine.createSpy();
      node = new Node(cb);
    });

    it("should forward #process() to callback", function () {
      node.send(new Map([[node.in[1], "foo"]]), "1");
      expect(cb).toHaveBeenCalledWith({1: "foo"}, "1");
    });
  });
});
