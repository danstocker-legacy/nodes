import * as net from "net";
import {Remote} from "./Remote";
import {Server} from "./Server";

describe("Server", function () {
  let onConnection: (socket: any) => void;
  let onServerError: (err: Error) => void;
  const server = {
    listen: () => null,
    on: (event, cb) => {
      switch (event) {
        case "connection":
          onConnection = cb;
          break;
        case "error":
          onServerError = cb;
          break;
      }
    }
  };
  let onData: (buffer: any) => void;
  let onSocketClose: () => void;
  let onSocketError: (err: Error) => void;
  const socket = {
    on: (event, cb) => {
      switch (event) {
        case "data":
          onData = cb;
          break;
        case "close":
          onSocketClose = cb;
          break;
        case "error":
          onSocketError = cb;
          break;
      }
    },
    remoteAddress: "192.168.0.101",
    remotePort: 8889
  };

  beforeEach(function () {
    Server.clear();
    Remote.clear();
    spyOn(net, "Server").and.returnValue(server);
  });

  describe(".instance()", function () {
    it("should cache instances by port", function () {
      const node = Server.instance("localhost", 8888);
      expect(Server.instance("localhost", 8888)).toBe(node);
      expect(Server.instance("localhost", 8889)).not.toBe(node);
    });
  });

  describe(".clear()", function () {
    it("should clear instance cache", function () {
      const node = Server.instance("localhost", 8888);
      Server.clear();
      expect(Server.instance("localhost", 8888)).not.toBe(node);
    });
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = Server.instance("localhost", 8888);
      expect(node.o.st_conc).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });

    it("should start listening", function () {
      spyOn(server, "listen");
      const node = Server.instance("localhost", 8888);
      expect(server.listen).toHaveBeenCalledWith(8888, "localhost");
    });
  });

  describe("on connection", function () {
    let node: Server;

    beforeEach(function () {
      node = Server.instance("localhost", 8888);
    });

    it("should send number of connections", function () {
      spyOn(node.o.st_conc, "send");
      onConnection(socket);
      expect(node.o.st_conc.send).toHaveBeenCalledWith(1);
    });
  });

  describe("on server error", function () {
    let node: Server;

    beforeEach(function () {
      node = Server.instance("localhost", 8888);
    });

    it("should send parsed & unwrapped data to remote", function () {
      const error = new Error("foo");
      spyOn(node.o.ev_err, "send");
      onServerError(error);
      expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
    });
  });

  describe("on socket close", function () {
    let node: Server;

    beforeEach(function () {
      node = Server.instance("localhost", 8888);
      onConnection(socket);
    });

    it("should send number of connections", function () {
      spyOn(node.o.st_conc, "send");
      onSocketClose();
      expect(node.o.st_conc.send).toHaveBeenCalledWith(0);
    });
  });

  describe("on data", function () {
    let node: Server;
    let remote: Remote;

    beforeEach(function () {
      node = Server.instance("localhost", 8888);
      remote = Remote.instance("192.168.0.101", 8889, "localhost", 8888);
      onConnection(socket);
    });

    it("should send parsed data to Remote node", function () {
      spyOn(remote.o.$, "send");
      onData(`{"tag":1,"value":"foo"}`);
      expect(remote.o.$.send).toHaveBeenCalledWith("foo", 1);
    });
  });
});
