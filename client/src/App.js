import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []); // Request account access

          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );

          setContract(contract);
          setProvider(provider);

          // Handle account change
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          // Handle chain change
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error loading provider:", error);
        }
      } else {
        console.error("MetaMask is not installed!");
      }
    };

    loadProvider();
  }, []);
  return (
    <>
      <div
        className="min-h-screen  py-12 px-4 relative overflow-hidden h-full w-full bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 border border-gray-100
"
      >
        {/* Background circles for visual effect */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
        <div className="absolute top-80 right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative">
          {!modalOpen && (
            <button
              className="share absolute right-4 top-4 px-6 py-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg border border-white border-opacity-20 text-white hover:bg-opacity-20 transition duration-300"
              onClick={() => setModalOpen(true)}
            >
              Share
            </button>
          )}
          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
          )}

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl border border-white border-opacity-20 p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-center text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              Decentralized Data Transfer
            </h1>

            <div className="mb-8 text-center">
              <p className="text-white text-opacity-90 bg-black bg-opacity-20 backdrop-blur-lg rounded-lg px-4 py-2 inline-block">
                Account:{" "}
                <span className="font-mono">
                  {account ? account : "Not connected"}
                </span>
              </p>
            </div>
            <div className="space-y-8">
              <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10">
                <FileUpload
                  account={account}
                  provider={provider}
                  contract={contract}
                />
              </div>

              <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10">
                <Display contract={contract} account={account} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
