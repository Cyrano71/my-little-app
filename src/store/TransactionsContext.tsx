"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { contractABI, contractAddress } from "../libs/contracts/constants";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { AppContextType } from "./contextTypes";
import fetchJson from "@/utils/fetchJson";

let eth: any;

if (typeof window !== "undefined") {
  eth = (window as any).ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

//https://blog.logrocket.com/how-to-use-react-context-typescript/
export const TransactionContext = React.createContext<AppContextType>({
  handleChange: (e: React.FormEvent<HTMLInputElement>, name: string) => {},
  connectWallet: (metamask?: any) => {},
  currentAccount: "",
  setFormData: (addressTo: string, amount: string) => {},
  formData: {
    addressTo: "",
    amount: "",
  },
  sendTransaction: (metamask?: any, connectedAccount?: string) => {},
  isLoading: false,
});

interface Props {
  children: ReactNode;
}

const TransactionProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });

  /**
   * Trigger loading modal
   */
  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`);
    } else {
      router.push(`/`);
    }
  }, [isLoading]);

  /**
   * Create user profile in Sanity
   */
  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const userDoc = {
        _type: "users",
        _id: currentAccount,
        userName: "Unnamed",
        address: currentAccount,
      };

      const respone = await fetchJson("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDoc: userDoc,
        }),
      });
    })();
  }, [currentAccount]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.currentTarget.value,
    }));
  };

  const formDataHandler = (addressTo: string, amount: string) => {
    setFormData((prevState) => ({ addressTo: addressTo, amount: amount }));
  };

  /**
   * Checks if MetaMask is installed and an account is connected
   * @param {*} metamask Injected MetaMask code from the browser
   * @returns
   */
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install metamask ");

      const accounts = await (window as any).ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]!);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  /**
   * Prompts user to connect their MetaMask wallet
   * @param {*} metamask Injected MetaMask code from the browser
   */
  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install metamask ");

      console.log("connectWallet");
      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]!);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  /**
   * Saves transaction to Sanity DB
   * @param {string} txHash Transaction hash
   * @param {number} amount Amount of ETH that was sent
   * @param {string} fromAddress Sender address
   * @param {string} toAddress Recipient address
   * @returns null
   */
  const saveTransaction = async (
    txHash: string,
    amount: string,
    fromAddress: string = currentAccount,
    toAddress: string
  ) => {
    const txDoc = {
      _type: "transactions",
      id: txHash,
      fromAddress: fromAddress,
      toAddress: toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash: txHash,
      amount: parseFloat(amount),
    };

    console.log(txDoc);

    const respone = await fetchJson("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txDoc: txDoc,
        currentAccount: currentAccount,
        txHash: txHash,
      }),
    });

    return;
  };

  /**
   * Executes a transaction
   * @param {*} metamask Injected MetaMask code from the browser
   * @param {string} currentAccount Current user's address
   */
  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    console.log("send transaction");
    try {
      if (!metamask) return alert("Please install metamask ");
      const { addressTo, amount } = formData;
      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      await metamask.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: "0x7EF40", // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        "TRANSFER"
      );

      setIsLoading(true);

      await transactionHash.wait();

      await saveTransaction(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData: formDataHandler,
        handleChange,
        sendTransaction,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
