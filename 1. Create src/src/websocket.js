// src/websocket.js

const DERIV_WS_URL = "wss://ws.derivws.com/websockets/v3?app_id=1089";

let socket = null;

/**
 * Connect to Deriv WebSocket
 */
export function connectWebSocket() {
  return new Promise((resolve, reject) => {
    try {
      socket = new WebSocket(DERIV_WS_URL);

      socket.onopen = () => {
        console.log("✅ Connected to Deriv WebSocket");
        resolve(socket);
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
        reject(error);
      };

      socket.onclose = () => {
        console.log("🔌 WebSocket Closed");
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Get socket instance
 */
export function getSocket() {
  return socket;
}

/**
 * Subscribe to live ticks
 * Example symbol:
 * R_10
 * R_25
 * R_50
 * R_75
 * R_100
 */
export function subscribeTicks(symbol = "R_100", callback) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket not connected");
    return;
  }

  socket.send(
    JSON.stringify({
      ticks: symbol,
      subscribe: 1,
    })
  );

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.tick) {
      callback({
        symbol: data.tick.symbol,
        quote: data.tick.quote,
        epoch: data.tick.epoch,
      });
    }
  };
}

/**
 * Authorize account using token
 */
export function authorize(token) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      authorize: token,
    })
  );
}

/**
 * Get account balance
 */
export function getBalance() {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      balance: 1,
      subscribe: 1,
    })
  );
}

/**
 * Buy contract
 */
export function buyContract(proposalId, amount) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      buy: proposalId,
      price: amount,
    })
  );
}

/**
 * Disconnect
 */
export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
