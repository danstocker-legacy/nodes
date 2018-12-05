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

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Listener(() => {
          throw error;
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.in.$, 5, "1");
        expect(node.re.$.send)
        .toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
