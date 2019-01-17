import {connect} from "../node";
import {muxer$, TMuxer} from "./muxer$";

describe("muxer$", function () {
  describe("on input", function () {
    let node: TMuxer<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = muxer$(["foo", "bar"]);
    });

    it("should emit on d_mux", function () {
      const spy = jasmine.createSpy();
      connect(node.o.d_mux, spy);
      node.i.bar(5, "1");
      expect(spy).toHaveBeenCalledWith({field: "bar", value: 5}, "1");
    });
  });
});
