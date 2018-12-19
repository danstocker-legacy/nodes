import * as net from "net";
import {Server} from "./Server";

describe("Server", function () {
  let onListening: () => void;
  let onConnection: (socket: any) => void;
  let onServerClose: () => void;
  let onServerError: (err: Error) => void;
  const server = {
    listen: () => null,
    on: (event, cb) => {
      switch (event) {
        case "listening":
          onListening = cb;
          break;
        case "connection":
          onConnection = cb;
          break;
        case "close":
          onServerClose = cb;
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
      expect(node.b.d_mux).toBeDefined();
      expect(node.o.d_mux).toBeDefined();
      expect(node.o.st_connc).toBeDefined();
      expect(node.o.st_lis).toBeDefined();
      expect(node.o.ev_conn).toBeDefined();
      expect(node.o.ev_disc).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Server;

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
          port: "192.168.0.101:8889",
          val: "Hello World!"
        }, "1");
        expect(socket.write).toHaveBeenCalledWith("Hello World!");
      });

      describe("when not connected", function () {
        it("should not write to socket", function () {
          spyOn(socket, "write");
          node.send(node.i.d_mux, {
            port: "192.168.0.102:8889",
            val: "Hello World!"
          } as any, "1");
          expect(socket.write).not.toHaveBeenCalled();
        });

        it("should bounce input", function () {
          spyOn(node.b.d_mux, "send");
          node.send(node.i.d_mux, {
            port: "192.168.0.102:8889",
            val: "Hello World!"
          } as any, "1");
          expect(node.b.d_mux.send).toHaveBeenCalledWith({
            port: "192.168.0.102:8889",
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

  describe("on listening", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
    });

    it("should emit 'st_lis'", function () {
      spyOn(node.o.st_lis, "send");
      onListening();
      expect(node.o.st_lis.send).toHaveBeenCalledWith(true);
    });
  });

  describe("on connection", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
    });

    it("should emit connection info", function () {
      spyOn(node.o.ev_conn, "send");
      onConnection(socket);
      expect(node.o.ev_conn.send).toHaveBeenCalledWith({
        lhost: socket.localAddress,
        lport: socket.localPort,
        rhost: socket.remoteAddress,
        rport: socket.remotePort
      });
    });

    it("should emit number of connections", function () {
      spyOn(node.o.st_connc, "send");
      onConnection(socket);
      expect(node.o.st_connc.send).toHaveBeenCalledWith(1);
    });
  });

  describe("on server error", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
    });

    it("should emit stringified error", function () {
      const error = new Error("foo");
      spyOn(node.o.ev_err, "send");
      onServerError(error);
      expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
    });
  });

  describe("on server close", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
      onListening();
    });

    it("should emit 'st_lis'", function () {
      spyOn(node.o.st_lis, "send");
      onServerClose();
      expect(node.o.st_lis.send).toHaveBeenCalledWith(false);
    });
  });

  describe("on socket close", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
      onConnection(socket);
    });

    it("should emit connection info", function () {
      spyOn(node.o.ev_disc, "send");
      onSocketClose();
      expect(node.o.ev_disc.send).toHaveBeenCalledWith({
        lhost: socket.localAddress,
        lport: socket.localPort,
        rhost: socket.remoteAddress,
        rport: socket.remotePort
      });
    });

    it("should emit number of connections", function () {
      spyOn(node.o.st_connc, "send");
      onSocketClose();
      expect(node.o.st_connc.send).toHaveBeenCalledWith(0);
    });
  });

  describe("on data", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
      onConnection(socket);
    });

    it("should emit multiplexed data", function () {
      spyOn(node.o.d_mux, "send");
      onData("Hello World!");
      expect(node.o.d_mux.send).toHaveBeenCalledWith({
        port: "192.168.0.101:8889",
        val: "Hello World!"
      });
    });
  });

  describe("on socket error", function () {
    let node: Server;

    beforeEach(function () {
      node = new Server("localhost", 8888);
      onConnection(socket);
    });

    it("should emit stringified error", function () {
      spyOn(node.o.ev_err, "send");
      onSocketError(new Error("foo"));
      expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
    });
  });
});
