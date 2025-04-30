import { useEffect, useState } from "react";
import useBossContract from "../hooks/useBossContract";
import Web3 from "web3";

interface BossTuple {
    0: number;
    1: string;
    2: string;
    3: number;
    4: number;
    5: boolean;
}

export default function BossList() {
    const contract = useBossContract();
    const [boss, setBoss] = useState<BossTuple | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const result = (await contract.methods
                    .bossInfo(0)
                    .call()) as unknown as BossTuple;
                setBoss(result);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, [contract])

    if (!boss) return <p>Loading...</p>;

    return (
        <pre>
            {JSON.stringify(
                {
                    id: boss[0],
                    name: boss[1],
                    creator: boss[2],
                    votes: boss[3],
                    level: boss[4],
                    exists: boss[5],
                },
                null,
                2
            )}
        </pre>
    )
}