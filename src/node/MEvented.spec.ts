import {TOutBundle} from "../port";
import {IEvented} from "./IEvented";
import {MEvented} from "./MEvented";

describe("MEvented", function () {
  class TestEvented implements IEvented {
    public readonly e: TOutBundle<{ foo: number, bar: boolean }>;

    constructor() {
      MEvented.init.call(this, ["foo", "bar"]);
    }
  }

  describe("init()", function () {
    it("should add si bundle", function () {
      const node = new TestEvented();
      expect(node.e).toBeDefined();
      expect(node.e.foo).toBeDefined();
      expect(node.e.bar).toBeDefined();
    });
  });
});
