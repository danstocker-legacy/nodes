import {Listener} from "./Listener";

describe("Listener", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Listener(() => null);
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Listener;
    let spy: jasmine.Spy;

    beforeEach(function () {
      spy = jasmine.createSpy();
      node = new Listener(spy);
    });

    it("should", function () {
      node.send(node.in.$, 5, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
