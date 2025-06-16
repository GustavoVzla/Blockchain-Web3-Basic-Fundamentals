import "dotenv/config";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/03-ViewPureExamples.sol/ViewPureExamples.json";

const contractAddress = process.env.CONTRACT_ADDRESS_VIEW_PURE! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem public client...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  console.log("🔍 Calling ViewPureExamples...");

  const name = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getName",
  });

  const number = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getNumber",
  });

  const storedNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "storedNumber",
  });

  const readNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "readNumber",
  });

  console.log("👤 getName():", name);
  console.log("🔢 getNumber():", number);
  console.log("📊 storedNumber:", storedNumber);
  console.log("📖 readNumber():", readNumber);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});