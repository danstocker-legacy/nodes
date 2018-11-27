import {Listener} from "./Listener";

describe("Listener", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Listener("() => null");
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Listener;

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Listener(`() => {
          throw error;
        }`);
      });

      it("should bounce inputs", function () {
        spyOn(node.bounced.$, "send");
        node.send(node.in.$, 5, "1");
        expect(node.bounced.$.send)
        .toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
