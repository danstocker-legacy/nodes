import {JsonStringifier} from "./JsonStringifier";

describe("JsonStringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stringifier: JsonStringifier<object> = new JsonStringifier();
      expect(stringifier.in.$.node).toBe(stringifier);
      expect(stringifier.out).toBeDefined();
    });
  });

  describe("#send()", function () {
    let stringifier: JsonStringifier<object>;

    describe("when pretty is false", function () {
      beforeEach(function () {
        stringifier = new JsonStringifier();
      });

      it("should send stringified value to out port", function () {
        spyOn(stringifier.out.$, "send");
        stringifier.send(new Map([[stringifier.in.$, {foo: "bar"}]]));
        expect(stringifier.out.$.send)
        .toHaveBeenCalledWith("{\"foo\":\"bar\"}", undefined);
      });
    });

    describe("when pretty is true", function () {
      beforeEach(function () {
        stringifier = new JsonStringifier(true);
      });

      it("should send pretty stringified value to out port", function () {
        spyOn(stringifier.out.$, "send");
        stringifier.send(new Map([[stringifier.in.$, {foo: "bar"}]]));
        expect(stringifier.out.$.send)
        .toHaveBeenCalledWith("{\n  \"foo\": \"bar\"\n}", undefined);
      });
    });
  });
});
