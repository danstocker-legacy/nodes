import {Noop} from "../generic";
import {Filter} from "./Filter";

describe("Filter", function () {
  describe("constructor", function () {
    const cb = (next: any) => !!next;

    it("should initialize ports", function () {
      const filter: Filter<any> = new Filter(cb);
      expect(filter.ports.in.node).toBe(filter);
      expect(filter.ports.out.node).toBe(filter);
    });
  });

  describe("#send()", function () {
    let noop: Noop<number>;
    let filter: Filter<number>;

    beforeEach(function () {
      noop = new Noop();
    });

    it("should invoke callback", function () {
      const cb = jasmine.createSpy();
      filter = new Filter(cb);
      noop.ports.out.connect(filter.ports.in);
      noop.send(5, noop.ports.in);
      expect(cb).toHaveBeenCalledWith(5, filter.ports.in, filter);
    });

    it("should send value to output port", function () {
      filter = new Filter((next) => next % 2 === 1);
      noop.ports.out.connect(filter.ports.in);
      spyOn(filter.ports.out, "send");
      noop.send(5, noop.ports.in);
      expect(filter.ports.out.send).toHaveBeenCalledWith(5);
    });
  });
});
