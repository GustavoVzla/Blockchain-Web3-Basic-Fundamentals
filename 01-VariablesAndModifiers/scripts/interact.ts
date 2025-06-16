import "dotenv/config";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/VariablesAndModifiers.sol/VariablesAndModifiers.json";

const contractAddress = process.env.CONTRACT_ADDRESS! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem public client...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const results = await Promise.all([
    // 🧱 Integers
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "positiveNumber",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "maxUint8",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "negativeNumber",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "publicUint",
    }),

    // 📜 Strings & Bytes
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "greeting",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "fixedBytes",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "dynamicBytes",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "singleByte",
    }),

    // ✅ Booleans
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "isActive",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "flagA",
    }),
    // publicClient.readContract({
    //   address: contractAddress,
    //   abi,
    //   functionName: "flagB",
    // }),

    // 🧑‍💻 Addresses
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "owner",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "developer",
    }),

    // 🔐 Visibility
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "visibleToAll",
    }),

    // 🔑 Hashing
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "hashKeccak",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "hashSha256",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "hashRipemd",
    }),
  ]);

  const [
    positiveNumber,
    maxUint8,
    negativeNumber,
    publicUint,
    greeting,
    fixedBytes,
    dynamicBytes,
    singleByte,
    isActive,
    flagA,
    // flagB,
    owner,
    developer,
    visibleToAll,
    hashKeccak,
    hashSha256,
    hashRipemd,
  ] = results;

  console.log("🧱 positiveNumber:", positiveNumber);
  console.log("🧱 maxUint8:", maxUint8);
  console.log("🧱 negativeNumber:", negativeNumber);
  console.log("🧱 publicUint:", publicUint);
  console.log("📜 greeting:", greeting);
  console.log("📦 fixedBytes:", fixedBytes);
  console.log("📦 dynamicBytes:", dynamicBytes);
  console.log("📦 singleByte:", singleByte);
  console.log("✅ isActive:", isActive);
  console.log("✅ flagA:", flagA);
  // console.log("✅ flagB:", flagB);
  console.log("🧑‍💻 owner:", owner);
  console.log("🧑‍💻 developer:", developer);
  console.log("🔐 visibleToAll:", visibleToAll);
  console.log("🔐 hashKeccak:", hashKeccak);
  console.log("🔐 hashSha256:", hashSha256);
  console.log("🔐 hashRipemd:", hashRipemd);
};

main().catch((err) => {
  console.error("❌ Script error:", err);
  process.exit(1);
});
