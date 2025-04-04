const WebSocket = require("ws");

let ws; // Declare the WebSocket variable
async function initializeWebSocket() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(
      "wss://alai-standalone-backend.getalai.com/ws/create-and-stream-slide-variants"
    );

    ws.on("open", () => {
      console.log("WebSocket connection opened");
      resolve();
    });

    ws.on("message", (data) => {
        console.log("Received message:", data);
        // handleWebSocketMessage(data);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
}

function handleWebSocketMessage(data) {
    try {
        console.log(data)
    } catch (error) {
        console.error("Error parsing message:", error);
    }
}

async function closeWebSocket(data) {
    try {
        if (ws && ws.readyState === WebSocket.OPEN) {
            await ws.close();
        }
    } catch (error) {
        console.error("Error closing WebSocket:", error);
    }
}

module.exports ={
    initializeWebSocket,closeWebSocket
}