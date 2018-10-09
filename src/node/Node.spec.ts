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
      expect(node.in[0]).toBeDefined();
      expect(node.in[1]).toBeDefined();
      expect(node.out[0]).toBeDefined();
      expect(node.out[1]).toBeDefined();
      expect(node.out[2]).toBeDefined();
    });

    describe("when omitting counts", function () {
      it("should add 1 port each", function () {
        const node = new Node(() => {
        });
        expect(node.in[0]).toBeDefined();
        expect(node.out[0]).toBeDefined();
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
      node.send(new Map([[node.in[0], "foo"]]), "1");
      expect(cb).toHaveBeenCalledWith({0: "foo"}, "1");
    });
  });
});
