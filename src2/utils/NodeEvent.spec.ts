import {Noop} from "../lang";
import {NodeEvent} from "./NodeEvent";

describe("NodeEvent", function () {
  describe("constructor", function () {
    it("should set type", function () {
      const node = new Noop();
      const event = new NodeEvent("foo", node, "bar");
      expect(event.type).toBe("foo");
    });

    it("should set node", function () {
      const node = new Noop();
      const event = new NodeEvent("foo", node, "bar");
      expect(event.node).toBe(node);
    });

    it("should set type", function () {
      const node = new Noop();
      const event = new NodeEvent("foo", node, "bar");
      expect(event.payload).toBe("bar");
    });
  });
});
