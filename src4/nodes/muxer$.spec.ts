import {connect} from "../node";
import {muxer$, TMuxer} from "./muxer$";

describe("muxer$", () => {
  describe("on input", () => {
    let node: TMuxer<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = muxer$(["foo", "bar"]);
    });

    it("should emit on d_mux", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_mux, spy);
      node.i.bar(5, "1");
      expect(spy).toHaveBeenCalledWith({field: "bar", value: 5}, "1");
    });
  });
});
