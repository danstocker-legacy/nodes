import {Listener} from "./Listener";

describe("Listener", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Listener(() => null);
      expect(node.i.$).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.$).toBeDefined();
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
      node.send(node.i.$, 5, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Listener(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, 5, "1");
        expect(node.re.$.send)
        .toHaveBeenCalledWith(5, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.$, 5, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
