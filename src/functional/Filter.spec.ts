import {Noop} from "../forwarders";
import {Filter} from "./Filter";

describe("Filter", function () {
  describe("constructor", function () {
    const cb = (next: any) => !!next;

    it("should initialize ports", function () {
      const node = new Filter<any>(cb);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let filter: Filter<number>;

    it("should invoke callback", function () {
      const cb = jasmine.createSpy();
      filter = new Filter(cb);
      filter.in.$.send(5, "1");
      expect(cb).toHaveBeenCalledWith(5, filter.in.$, filter);
    });

    it("should send value to output port", function () {
      filter = new Filter((next) => next % 2 === 1);
      spyOn(filter.out.$, "send");
      filter.in.$.send(5, "1");
      expect(filter.out.$.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
