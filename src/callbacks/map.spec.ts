import * as map from "./map";

describe("map", () => {
  describe("createConstant", () => {
    it("should return specified value", () => {
      expect(map.createConstant(5)(null)).toBe(5);
    });
  });

  describe("createSplit", () => {
    it("should return split string", () => {
      expect(map.createSplit(",")("foo,bar,baz"))
      .toEqual(["foo", "bar", "baz"]);
    });
  });

  describe("createPluck", () => {
    it("should return specified property", () => {
      expect(map.createPluck("foo")({foo: 5, bar: true})).toBe(5);
    });
  });

  describe("createMpluck()", () => {
    let mpluck: (value: {}) => any;

    beforeEach(() => {
      mpluck = map.createMpluck(["foo", "bar"]);
    });

    it("should pluck multiple values", () => {
      expect(mpluck({bar: 1, foo: "hello", baz: null})).toEqual(["hello", 1]);
    });
  });

  describe("createJoin()", () => {
    let join: (value: Array<any>) => string;

    beforeEach(() => {
      join = map.createJoin(";");
    });

    it("should join input array", () => {
      expect(join(["foo", 5, true])).toBe("foo;5;true");
    });
  });

  describe("createAppend()", () => {
    let append: (value: string) => string;

    beforeEach(() => {
      append = map.createAppend("_");
    });

    it("should append to input string", () => {
      expect(append("foo")).toBe("foo_");
    });
  });

  describe("createPrepend()", () => {
    let prepend: (value: string) => string;

    beforeEach(() => {
      prepend = map.createPrepend("_");
    });

    it("should prepend to input string", () => {
      expect(prepend("foo")).toBe("_foo");
    });
  });

  describe("createRound()", () => {
    describe("when precision is specified", () => {
      let round: (next: number) => number;

      beforeEach(() => {
        round = map.createRound(2);
      });

      it("should return value rounded to precision", () => {
        expect(round(5)).toBe(5);
        expect(round(5.11)).toBe(5.11);
        expect(round(5.111)).toBe(5.11);
        expect(round(5.115)).toBe(5.12);
      });
    });

    describe("when precision is not specified", () => {
      let round: (next: number) => number;

      beforeEach(() => {
        round = map.createRound();
      });

      it("should return value rounded to whole", () => {
        expect(round(5)).toBe(5);
        expect(round(5.1)).toBe(5);
        expect(round(5.5)).toBe(6);
      });
    });
  });
});
