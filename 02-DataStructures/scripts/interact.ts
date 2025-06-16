import "dotenv/config";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/DataStructures.sol/DataStructures.json";

// ✅ Environment variables
const contractAddress = process.env.CONTRACT_ADDRESS! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem public client...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  // ───────────────────────────────────────────────
  // 📚 STRUCTS
  // ───────────────────────────────────────────────
  const book1 = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "book1",
  });

  // ───────────────────────────────────────────────
  // 🧭 ENUMS
  // ───────────────────────────────────────────────
  const userStatus = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "userStatus",
  });

  const itemStatus = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "itemStatus",
  });

  const paymentStatus = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "paymentStatus",
  });

  const currentState = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "currentState",
  });

  // ───────────────────────────────────────────────
  // 📦 FIXED ARRAYS
  // ───────────────────────────────────────────────
  const fixedArray0 = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "fixedArray",
    args: [0],
  });

  const fixedUintList3 = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "fixedUintList",
    args: [3],
  });

  // ───────────────────────────────────────────────
  // 🔑 MAPPINGS (solo lectura de ejemplo)
  // ───────────────────────────────────────────────
  const userScore = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "addressToNumber",
    args: [contractAddress],
  });

  // ───────────────────────────────────────────────
  // ✅ Display Results
  // ───────────────────────────────────────────────
  console.log("📚 Struct - Book1:", book1);
  console.log("🧭 Enum - userStatus:", userStatus);
  console.log("🧭 Enum - itemStatus:", itemStatus);
  console.log("🧭 Enum - paymentStatus:", paymentStatus);
  console.log("🧭 Enum - currentState:", currentState);
  console.log("📦 Array - fixedArray[0]:", fixedArray0);
  console.log("📦 Array - fixedUintList[3]:", fixedUintList3);
  console.log("🔑 Mapping - addressToNumber[this]:", userScore);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});
