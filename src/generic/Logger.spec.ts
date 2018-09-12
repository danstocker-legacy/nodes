import {Logger} from "./Logger";

describe("Logger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const logger: Logger = new Logger();
      expect(logger.in.$.node).toBe(logger);
    });
  });

  describe("#send()", function () {
    let logger: Logger;

    beforeEach(function () {
      logger = new Logger();
    });

    it("should pass value to console.log", function () {
      spyOn(console, "log");
      logger.send(new Map([[logger.in.$, 5]]));
      // tslint:disable:no-console
      expect(console.log).toHaveBeenCalledWith(5);
    });
  });
});
