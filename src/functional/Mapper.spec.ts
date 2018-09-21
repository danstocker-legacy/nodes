import {Noop} from "../forwarders";
import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    const cb = (next: any) => !!next;

    it("should initialize ports", function () {
      const node = new Mapper<any, any>(cb);
      expect(node.in.$.node).toBe(node);
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let noop: Noop<number>;
    let mapper: Mapper<number, string>;

    beforeEach(function () {
      noop = new Noop();
    });

    it("should invoke callback", function () {
      const cb = jasmine.createSpy();
      mapper = new Mapper(cb);
      noop.out.$.connect(mapper.in.$);
      noop.send(new Map([[noop.in.$, 5]]));
      expect(cb).toHaveBeenCalledWith(5, mapper.in.$, mapper);
    });

    it("should send value to output port", function () {
      mapper = new Mapper((next) => "_" + next);
      noop.out.$.connect(mapper.in.$);
      spyOn(mapper.out.$, "send");
      noop.send(new Map([[noop.in.$, 5]]));
      expect(mapper.out.$.send).toHaveBeenCalledWith("_5", undefined);
    });
  });
});
