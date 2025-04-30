import { Web3 } from "web3";
import abi from "../abis/BossRegistry.json";

// Contract configuration
const CONTRACT_ADDRESS = "0x39d7BD34f96ac85B1800e949d2C600059744F822";
const MOONBASE_CHAIN_ID = 1287; // Moonbase Alpha chain ID
const RPC_URL = "https://rpc.api.moonbase.moonbeam.network";

export async function getWeb3(): Promise<Web3> {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
            const w = new Web3((window as any).ethereum);
            
            // Check if we're on the correct network
            const chainId = await w.eth.getChainId();
            // if (chainId.toString(16) !== MOONBASE_CHAIN_ID) {
            //     throw new Error("Please switch to Moonbase Alpha network in MetaMask");
            // }

            // Request account access
            await (window as any).ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected to MetaMask on Moonbase Alpha");
            return w;
        } catch (error: any) {
            console.error("Error connecting to MetaMask:", error);
            if (error.message.includes("Moonbase Alpha")) {
                throw error;
            }
            // Fallback to public RPC
            return new Web3(RPC_URL);
        }
    }
    // Server-side or no wallet available
    return new Web3(RPC_URL);
}

export async function getBossContract() {
    const web3 = await getWeb3();
    const contract = new web3.eth.Contract(abi as any, CONTRACT_ADDRESS);
    
    // Verify contract exists
    try {
        const code = await web3.eth.getCode(CONTRACT_ADDRESS);
        if (code === '0x') {
            throw new Error("Contract not found at the specified address");
        }
    } catch (error) {
        console.error("Error verifying contract:", error);
        throw error;
    }
    
    return contract;
}
