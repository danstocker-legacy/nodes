import {stdErr$, TStdErr} from "./stdErr$";

describe("stdErr$", () => {
  it("should be singleton", function () {
    expect(stdErr$()).toBe(stdErr$());
  });

  describe("on input (d_val)", () => {
    let node: TStdErr;

    beforeEach(() => {
      node = stdErr$();
    });

    it("should write to stderr", () => {
      spyOn(process.stderr, "write");
      node.i.d_val("foo");
      expect(process.stderr.write).toHaveBeenCalledWith("foo");
    });
  });
});
