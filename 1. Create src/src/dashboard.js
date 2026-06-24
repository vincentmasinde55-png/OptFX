// src/dashboard.js

import React, { useEffect, useState } from "react";
import {
  connectWebSocket,
  subscribeTicks,
  getSocket,
} from "./websocket";

function Dashboard() {
  const [connection, setConnection] = useState("Disconnected");
  const [loginStatus, setLoginStatus] = useState("Not Logged In");
  const [balance, setBalance] = useState("--");
  const [symbol, setSymbol] = useState("R_100");
  const [tick, setTick] = useState("--");

  useEffect(() => {
    async function init() {
      try {
        await connectWebSocket();

        setConnection("Connected");

        subscribeTicks(symbol, (data) => {
          setTick(data.quote);
          setSymbol(data.symbol);
        });

        const socket = getSocket();

        socket.addEventListener("message", (event) => {
          const response = JSON.parse(event.data);

          if (response.authorize) {
            setLoginStatus(
              response.authorize.loginid || "Logged In"
            );
          }

          if (response.balance) {
            setBalance(
              `${response.balance.currency} ${response.balance.balance}`
            );
          }
        });
      } catch (err) {
        console.error(err);
        setConnection("Connection Failed");
      }
    }

    init();
  }, []);

  return (
    <div className="dashboard">
      <h2>Trading Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Connection</h3>
          <p>{connection}</p>
        </div>

        <div className="dashboard-card">
          <h3>Login Status</h3>
          <p>{loginStatus}</p>
        </div>

        <div className="dashboard-card">
          <h3>Account Balance</h3>
          <p>{balance}</p>
        </div>

        <div className="dashboard-card">
          <h3>Current Symbol</h3>
          <p>{symbol}</p>
        </div>

        <div className="dashboard-card">
          <h3>Live Tick Price</h3>
          <p>{tick}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
