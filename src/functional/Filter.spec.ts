import {Noop} from "../general";
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

  describe("#in()", function () {
    let noop: Noop<number>;
    let filter: Filter<number>;

    beforeEach(function () {
      noop = new Noop();
    });

    it("should invoke callback", function () {
      const cb = jasmine.createSpy();
      filter = new Filter(cb);
      noop.ports.out.connect(filter.ports.in);
      noop.in(noop.ports.in, 5);
      expect(cb).toHaveBeenCalledWith(5, noop.ports.out, filter.ports.in);
    });

    it("should send value to output port", function () {
      filter = new Filter(next => next % 2 === 1);
      noop.ports.out.connect(filter.ports.in);
      spyOn(filter.ports.out, "out");
      noop.in(noop.ports.in, 5);
      expect(filter.ports.out.out).toHaveBeenCalledWith(5);
    });
  });
});