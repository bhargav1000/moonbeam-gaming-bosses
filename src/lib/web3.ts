import { Web3 } from "web3";
import abi from "../abis/BossRegistry.json";

const CONTRACT_ADDRESS = "0x39d7BD34f96ac85B1800e949d2C600059744F822";

export function getWeb3(): Web3 {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        const w = new Web3((window as any).ethereum);
        // ask for accounts if not already connected
        (window as any).ethereum.request({ method: "eth_requestAccounts" });
        return w;
    }
    // Server-side or no wallet available
    return new Web3("https://rpc.api.moonbase.moonbeam.network");
}

export function getBossContract() {
    const web3 = getWeb3();
    return new web3.eth.Contract(abi as any, CONTRACT_ADDRESS);
}
