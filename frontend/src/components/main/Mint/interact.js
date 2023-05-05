import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [message, setMessage] = useState("No connection to the network.");
const [newMessage, setNewMessage] = useState("");

useEffect(async () => {
    const message = await loadCurrentMessage();
    setMessage(message);
    addSmartContractListener();

    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status); 

    addWalletListener(); 
}, []);

function addSmartContractListener() {
    helloWorldContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        setMessage(data.returnValues[1]);
        setNewMessage("");
        setStatus("🎉 Your message has been updated!");
      }
    });
  }

 function addWalletListener() { //TODO: implement

 }

 const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };  

  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
};

 //export const helloWorldContract;

export const loadCurrentMessage = async () => {

};

export const connectWallet = async () => {

};

const getCurrentWalletConnected = async () => { 

};


export const updateMessage = async (address, message) => {
    if (!window.ethereum || address === null) {
      return {
        status:
          "💡 Connect your Metamask wallet to update the message on the blockchain.",
      };
    }
  
    if (message.trim() === "") {
      return {
        status: "❌ Your message cannot be an empty string.",
      };
    }
  };

  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: helloWorldContract.methods.update(message).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
          ✅{" "}
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};