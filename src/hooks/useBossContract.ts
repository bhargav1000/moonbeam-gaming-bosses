import { useMemo } from "react";
import { getBossContract } from "../lib/web3";

export default function useBossContract() {
    return useMemo(() => getBossContract(), []);
}
