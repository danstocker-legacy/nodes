import {Std$Err, TStdErr} from "./TStdErr";

describe("Std$Err", () => {
  it("should be singleton", () => {
    expect(Std$Err()).toBe(Std$Err());
  });

  describe("on input (d_val)", () => {
    let node: TStdErr;

    beforeEach(() => {
      node = Std$Err();
    });

    it("should write to stderr", () => {
      spyOn(process.stderr, "write");
      node.i.d_val("foo");
      expect(process.stderr.write).toHaveBeenCalledWith("foo");
    });
  });
});
