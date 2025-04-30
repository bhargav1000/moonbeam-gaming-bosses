import { useEffect, useState } from "react";
import { getBossContract } from "../lib/web3";
import { Contract } from "web3-eth-contract";
import abi from "../abis/BossRegistry.json";

export default function useBossContract() {
    const [contract, setContract] = useState<Contract<typeof abi> | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initContract() {
            try {
                console.log("Initializing contract...");
                const bossContract = await getBossContract();
                console.log("Contract initialized successfully:", bossContract);
                console.log("Contract address:", bossContract.options.address);
                console.log("Contract methods:", Object.keys(bossContract.methods));
                setContract(bossContract);
            } catch (err: any) {
                console.error("Error initializing contract:", err);
                console.error("Error details:", {
                    message: err.message,
                    code: err.code,
                    data: err.data
                });
                setError(err.message || "Failed to initialize contract");
            }
        }

        initContract();
    }, []);

    if (error) {
        console.error("Contract error:", error);
    }

    return contract;
}
