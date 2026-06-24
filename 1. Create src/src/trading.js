// src/trading.js

import React, { useState } from "react";
import { getSocket } from "./websocket";

function Trading() {
  const [stake, setStake] = useState(1);
  const [contractType, setContractType] = useState("DIGITODD");
  const [symbol] = useState("R_100");

  const [proposalId, setProposalId] = useState(null);
  const [proposalPrice, setProposalPrice] = useState("--");
  const [status, setStatus] = useState("");

  const requestProposal = () => {
    const socket = getSocket();

    if (!socket) {
      setStatus("WebSocket not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        proposal: 1,
        amount: Number(stake),
        basis: "stake",
        contract_type: contractType,
        currency: "USD",
        duration: 1,
        duration_unit: "t",
        symbol: symbol,
      })
    );

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.proposal) {
        setProposalPrice(data.proposal.display_value);
        setProposalId(data.proposal.id);
        setStatus("Proposal received");
      }
    };

    socket.addEventListener("message", handleMessage, { once: true });
  };

  const buyContract = () => {
    const socket = getSocket();

    if (!proposalId) {
      setStatus("Request proposal first");
      return;
    }

    socket.send(
      JSON.stringify({
        buy: proposalId,
        price: Number(stake),
      })
    );

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.buy) {
        setStatus(
          `Contract Purchased: ${data.buy.contract_id}`
        );
      }

      if (data.error) {
        setStatus(data.error.message);
      }
    };

    socket.addEventListener("message", handleMessage, {
      once: true,
    });
  };

  return (
    <div className="trading-panel">
      <h2>Trade Synthetic Indices</h2>

      <div className="trade-form">
        <label>Stake</label>
        <input
          type="number"
          value={stake}
          min="0.35"
          step="0.01"
          onChange={(e) => setStake(e.target.value)}
        />

        <label>Contract Type</label>
        <select
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
        >
          <option value="DIGITODD">Odd</option>
          <option value="DIGITEVEN">Even</option>
          <option value="DIGITOVER">Over</option>
          <option value="DIGITUNDER">Under</option>
        </select>

        <label>Symbol</label>
        <input
          value={symbol}
          disabled
        />

        <div className="proposal-box">
          Proposal Price: {proposalPrice}
        </div>

        <button
          className="btn-secondary"
          onClick={requestProposal}
        >
          Get Proposal
        </button>

        <button
          className="btn-primary"
          onClick={buyContract}
        >
          Buy Contract
        </button>

        <p>{status}</p>
      </div>
    </div>
  );
}

export default Trading;
