import {Noop} from "../forwarders";
import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    const cb = (next: any) => !!next;

    it("should initialize ports", function () {
      const node = new Mapper<any, any>(cb);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let mapper: Mapper<number, string>;

    it("should invoke callback", function () {
      const cb = jasmine.createSpy();
      mapper = new Mapper(cb);
      mapper.in.$.send(5, "1");
      expect(cb).toHaveBeenCalledWith(5, mapper.in.$, mapper);
    });

    it("should send value to output port", function () {
      mapper = new Mapper((next) => "_" + next);
      spyOn(mapper.out.$, "send");
      mapper.in.$.send(5, "1");
      expect(mapper.out.$.send).toHaveBeenCalledWith("_5", "1");
    });
  });
});
