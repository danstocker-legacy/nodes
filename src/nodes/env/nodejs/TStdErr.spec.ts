import {StdErr$, TStdErr} from "./TStdErr";

describe("StdErr$", () => {
  it("should be singleton", () => {
    expect(StdErr$()).toBe(StdErr$());
  });

  describe("on input (d_val)", () => {
    let node: TStdErr;

    beforeEach(() => {
      node = StdErr$();
    });

    it("should write to stderr", () => {
      spyOn(process.stderr, "write");
      node.i.d_val("foo");
      expect(process.stderr.write).toHaveBeenCalledWith("foo");
    });
  });
});
