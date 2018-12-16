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
    localAddress: "localhost",
    localPort: 8888,
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
    remotePort: 8889,
    write: () => null
  };

  beforeEach(function () {
    spyOn(net, "Server").and.returnValue(server);
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Server("localhost", 8888);
      expect(node.i.d_mux).toBeDefined();
      expect(node.i.st_lis).toBeDefined();
      expect(node.o.d_mux).toBeDefined();
      expect(node.o.st_connc).toBeDefined();
      expect(node.o.st_lis).toBeDefined();
      expect(node.o.b_d_mux).toBeDefined();
      expect(node.o.ev_conn).toBeDefined();
      expect(node.o.ev_disc).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Server<"192.168.0.101:8889">;

    beforeEach(function () {
      node = new Server("localhost", 8888);
    });

    describe("when sending to 'd_mux'", function () {
      beforeEach(function () {
        onConnection(socket);
      });

      it("should write to socket", function () {
        spyOn(socket, "write");
        node.send(node.i.d_mux, {
          name: "192.168.0.101:8889",
          val: "Hello World!"
        }, "1");
        expect(socket.write).toHaveBeenCalledWith("Hello World!");
      });

      describe("when not connected", function () {
        it("should not write to socket", function () {
          spyOn(socket, "write");
          node.send(node.i.d_mux, {
            name: "192.168.0.102:8889",
            val: "Hello World!"
          } as any, "1");
          expect(socket.write).not.toHaveBeenCalled();
        });

        it("should bounce input", function () {
          spyOn(node.o.b_d_mux, "send");
          node.send(node.i.d_mux, {
            name: "192.168.0.102:8889",
            val: "Hello World!"
          } as any, "1");
          expect(node.o.b_d_mux.send).toHaveBeenCalledWith({
            name: "192.168.0.102:8889",
            val: "Hello World!"
          }, "1");
        });
      });
    });

    describe("when sending to 'st_lis'", function () {
      it("should start listening", function () {
        spyOn(server, "listen");
        node.send(node.i.st_lis, true, "1");
        expect(server.listen).toHaveBeenCalledWith(8888, "localhost");
      });
    });
  });

  xdescribe("on connection", function () {
    let node: Server<"192.168.0.101:8889">;

    beforeEach(function () {
      node = new Server("localhost", 8888);
    });

    it("should send number of connections", function () {
      spyOn(node.o.st_connc, "send");
      onConnection(socket);
      expect(node.o.st_connc.send).toHaveBeenCalledWith(1);
    });
  });

  xdescribe("on server error", function () {
    let node: Server<"192.168.0.101:8889">;

    beforeEach(function () {
      node = new Server("localhost", 8888);
    });

    it("should send parsed & unwrapped data to remote", function () {
      const error = new Error("foo");
      spyOn(node.o.ev_err, "send");
      onServerError(error);
      expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
    });
  });

  xdescribe("on socket close", function () {
    let node: Server<"192.168.0.101:8889">;

    beforeEach(function () {
      node = new Server("localhost", 8888);
      onConnection(socket);
    });

    it("should send number of connections", function () {
      spyOn(node.o.st_connc, "send");
      onSocketClose();
      expect(node.o.st_connc.send).toHaveBeenCalledWith(0);
    });
  });

  xdescribe("on data", function () {
    let node: Server<"192.168.0.101:8889">;
    let remote: Remote;

    beforeEach(function () {
      node = new Server("localhost", 8888);
      remote = Remote.instance("192.168.0.101", 8889, "localhost", 8888);
      onConnection(socket);
    });

    it("should send parsed data to Remote node", function () {
      spyOn(remote.o.d_wrap, "send");
      onData(`{"tag":1,"value":"foo"}`);
      expect(remote.o.d_wrap.send).toHaveBeenCalledWith("foo", 1);
    });
  });
});
