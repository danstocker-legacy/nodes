import {connect} from "../../node";
import {Demuxer$, TDemuxer} from "./TDemuxer";

describe("Demuxer$()", () => {
  describe("on input (d_mux)", () => {
    let node: TDemuxer<{ foo: number, bar: number }>;

    beforeEach(() => {
      node = Demuxer$(["foo", "bar"]);
    });

    it("should emit on specified port", () => {
      const spy = jasmine.createSpy();
      connect(node.o.bar, spy);
      node.i.d_mux({field: "bar", value: 5}, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
