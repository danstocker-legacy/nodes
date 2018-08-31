import {JsonStringifier} from "./JsonStringifier";

describe("JsonStringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stringifier: JsonStringifier<Object> = new JsonStringifier();
      expect(stringifier.ports.in.node).toBe(stringifier);
      expect(stringifier.ports.out.node).toBe(stringifier);
    });
  });

  describe("#in()", function () {
    let stringifier: JsonStringifier<Object>;

    describe("when pretty is false", function () {
      beforeEach(function () {
        stringifier = new JsonStringifier();
      });

      it("should send stringified value to out port", function () {
        spyOn(stringifier.ports.out, "out");
        stringifier.in(stringifier.ports.in, {foo: "bar"});
        expect(stringifier.ports.out.out).toHaveBeenCalledWith("{\"foo\":\"bar\"}");
      });
    });

    describe("when pretty is true", function () {
      beforeEach(function () {
        stringifier = new JsonStringifier(true);
      });

      it("should send pretty stringified value to out port", function () {
        spyOn(stringifier.ports.out, "out");
        stringifier.in(stringifier.ports.in, {foo: "bar"});
        expect(stringifier.ports.out.out)
        .toHaveBeenCalledWith("{\n  \"foo\": \"bar\"\n}");
      });
    });
  });
});
