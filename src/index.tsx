import { serve } from "bun";
import index from "./index.html";
import { getWeb3 } from "./lib/web3";
import abi from "./abis/BossRegistry.json";
import { Web3 } from "web3";

// Load environment variables
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

console.log("RPC_URL", RPC_URL);

if (!SERVER_PRIVATE_KEY || !CONTRACT_ADDRESS || !RPC_URL) {
    throw new Error("Missing required environment variables. Please check your .env file");
}

// Create a server-side Web3 instance
const serverWeb3 = new Web3(RPC_URL);
const serverAccount = serverWeb3.eth.accounts.privateKeyToAccount(SERVER_PRIVATE_KEY);
serverWeb3.eth.accounts.wallet.add(serverAccount);

// Type definitions for contract responses
interface BossInfoResponse {
    0: string; // id
    1: string; // name
    2: string; // creator
    3: string; // votes
    4: string; // bossLevel
    5: boolean; // exists
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    // Boss Registry API endpoints
    "/api/boss/create": {
      async POST(req) {
        try {
          const { id, name } = await req.json();
          const contract = new serverWeb3.eth.Contract(abi as any, CONTRACT_ADDRESS);
          
          const result = await contract.methods
            .createBoss(id, name)
            .send({ from: serverAccount.address });

          return Response.json({
            success: true,
            transactionHash: result.transactionHash,
            message: "Boss created successfully"
          });
        } catch (error: any) {
          return Response.json({
            success: false,
            error: error.message
          }, { status: 400 });
        }
      }
    },

    "/api/boss/:id": {
      async GET(req) {
        try {
          const id = parseInt(req.params.id);
          const contract = new serverWeb3.eth.Contract(abi as any, CONTRACT_ADDRESS);
          
          const result = await contract.methods.bossInfo(id).call() as BossInfoResponse;
          
          return Response.json({
            success: true,
            boss: {
              id: parseInt(result[0]),
              name: result[1],
              creator: result[2],
              votes: parseInt(result[3]),
              bossLevel: parseInt(result[4]),
              exists: result[5]
            }
          });
        } catch (error: any) {
          return Response.json({
            success: false,
            error: error.message
          }, { status: 400 });
        }
      },

      async DELETE(req) {
        try {
          const id = parseInt(req.params.id);
          const contract = new serverWeb3.eth.Contract(abi as any, CONTRACT_ADDRESS);
          
          const result = await contract.methods
            .removeBoss(id)
            .send({ from: serverAccount.address });

          return Response.json({
            success: true,
            transactionHash: result.transactionHash,
            message: "Boss removed successfully"
          });
        } catch (error: any) {
          return Response.json({
            success: false,
            error: error.message
          }, { status: 400 });
        }
      }
    }
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
