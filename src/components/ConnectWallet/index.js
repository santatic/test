import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import detectEthereumProvider from "@metamask/detect-provider";

const ConnectWallet = (props) => {
  const { handleConnect, isConnected } = props;
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          handleConnect(true);
        }
      }
    };
    checkMetaMaskConnection();
  }, [handleConnect]);

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      handleConnect(true);
    } else {
      alert("MetaMask not found. Please install MetaMask.");
    }
  };


  return (
    <Button
      className={isConnected ? "btn btn-success" : "btn btn-danger"}
      onClick={connectMetaMask}
    >
      <h3>{isConnected ? `Connected: ${account}` : "Connect Wallet"}</h3>
    </Button>
  );
};

export default ConnectWallet;



