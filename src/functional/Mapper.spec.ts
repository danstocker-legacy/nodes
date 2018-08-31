import {Noop} from "../general";
import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    const cb = (next: any) => !!next;

    it("should initialize ports", function () {
      const mapper: Mapper<any, any> = new Mapper(cb);
      expect(mapper.ports.in.node).toBe(mapper);
      expect(mapper.ports.out.node).toBe(mapper);
    });
  });

  describe("#in()", function () {
    let noop: Noop<number>;
    let mapper: Mapper<number, string>;

    beforeEach(function () {
      noop = new Noop();
    });

    it("should invoke callback", function () {
      const cb = jasmine.createSpy();
      mapper = new Mapper(cb);
      noop.ports.out.connect(mapper.ports.in);
      noop.in(noop.ports.in, 5);
      expect(cb).toHaveBeenCalledWith(5, noop.ports.out, mapper.ports.in);
    });

    it("should send value to output port", function () {
      mapper = new Mapper(next => "_" + next);
      noop.ports.out.connect(mapper.ports.in);
      spyOn(mapper.ports.out, "out");
      noop.in(noop.ports.in, 5);
      expect(mapper.ports.out.out).toHaveBeenCalledWith("_5");
    });
  });
});
