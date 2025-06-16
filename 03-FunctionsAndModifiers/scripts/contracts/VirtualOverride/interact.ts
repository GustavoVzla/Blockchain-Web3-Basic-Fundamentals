import "dotenv/config";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { abiVirtual } from "../../../artifacts/contracts/08-VirtualOverride.sol/VirtualInheritance.json";
import { abiChild } from "../../../artifacts/contracts/08-VirtualOverride.sol/ChildFunctions.json";

const virtualContractAddress = process.env.CONTRACT_ADDRESS_VIRTUAL! as `0x${string}`;
const childContractAddress = process.env.CONTRACT_ADDRESS_CHILD! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem public client...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  console.log("🔧 Interacting with VirtualInheritance and ChildFunctions...");

  // Call greet on base contract
  const baseGreeting = await publicClient.readContract({
    address: virtualContractAddress,
    abi: abiVirtual,
    functionName: "greet",
  });

  console.log("Base contract greeting:", baseGreeting);

  // Call greet on child contract
  const childGreeting = await publicClient.readContract({
    address: childContractAddress,
    abi: abiChild,
    functionName: "greet",
  });

  console.log("Child contract greeting:", childGreeting);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});