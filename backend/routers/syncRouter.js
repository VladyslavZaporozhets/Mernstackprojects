import Router from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

const contractABI = require("contract-abi.json");
const contractAddress = "0x6f3f635A9762B47954229Ea479b4541eAF402A6A";


export const helloWorldContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

export const loadCurrentMessage = async () => { 
    const message = await helloWorldContract.methods.message().call(); 
    return message;
};

const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
};