import { useState, useEffect } from "react";
import { getBossContract } from "../lib/web3";
import "./BossList.css";

interface Boss {
    id: number;
    name: string;
    creator: string;
    votes: number;
    bossLevel: number;
    exists: boolean;
}

interface BossResponse {
    _id: string;
    _name: string;
    _creator: string;
    _votes: string;
    _bossLevel: string;
    _exists: boolean;
}

export default function BossList() {
    const [bosses, setBosses] = useState<Boss[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBosses() {
            try {
                setLoading(true);
                setError(null);
                const contract = await getBossContract();
                
                // For now, we'll fetch bosses with IDs 0-9
                // In a real implementation, you might want to track the last created boss ID
                const bossesArray: Boss[] = [];
                for (let i = 0; i < 10; i++) {
                    try {
                        const boss = await contract.methods.bossInfo(i).call() as BossResponse;
                        if (boss._exists) {
                            bossesArray.push({
                                id: Number(boss._id),
                                name: boss._name,
                                creator: boss._creator,
                                votes: Number(boss._votes),
                                bossLevel: Number(boss._bossLevel),
                                exists: boss._exists
                            });
                        }
                    } catch (err) {
                        // Skip if boss doesn't exist
                        continue;
                    }
                }
                setBosses(bossesArray);
            } catch (err: any) {
                console.error("Error fetching bosses:", err);
                setError(err.message || "Failed to load bosses. Please make sure you're connected to Moonbase Alpha network.");
            } finally {
                setLoading(false);
            }
        }

        fetchBosses();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading bosses...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <p className="mt-2 text-sm">Please make sure you're connected to Moonbase Alpha network in MetaMask.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {bosses.map((boss) => (
                <div key={boss.id} className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{boss.name}</h3>
                    <div className="space-y-2">
                        <p><span className="font-semibold">ID:</span> {boss.id}</p>
                        <p><span className="font-semibold">Creator:</span> {boss.creator}</p>
                        <p><span className="font-semibold">Votes:</span> {boss.votes}</p>
                        <p><span className="font-semibold">Level:</span> {boss.bossLevel}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}