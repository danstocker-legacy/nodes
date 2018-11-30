import {TOutBundle} from "../port";
import {IStateful} from "./IStateful";
import {MStateful} from "./MStateful";

describe("MStateful", function () {
  class TestStateful implements IStateful {
    public readonly state: TOutBundle<{
      foo: number,
      bar: boolean
    }>;

    constructor() {
      MStateful.init.call(this, ["foo", "bar"]);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestStateful();
      expect(node.state.foo).toBeDefined();
      expect(node.state.bar).toBeDefined();
    });
  });
});
