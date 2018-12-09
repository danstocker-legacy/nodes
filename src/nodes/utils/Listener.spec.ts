import {Listener} from "./Listener";

describe("Listener", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Listener(() => null);
      expect(node.i.d_val).toBeDefined();
      expect(node.o.b_d_val).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
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
      node.send(node.i.d_val, 5, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Listener(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.o.b_d_val, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.b_d_val.send)
        .toHaveBeenCalledWith(5, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
