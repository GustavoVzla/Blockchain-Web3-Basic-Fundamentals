import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../../../artifacts/contracts/06-DataLocation.sol/DataLocation.json";

const contractAddress = process.env.CONTRACT_ADDRESS_DATA_LOCATION! as `0x${string}`;
const privateKey = process.env.PRIVATE_KEY! as `0x${string}`;
const account = privateKeyToAccount(privateKey);

const main = async () => {
  console.log("🚀 Connecting to Viem clients...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });

  console.log("🧠 Interacting with DataLocation...");

  // Call getGreeting
  const greeting = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getGreeting",
    args: ["Hello, World!"],
  });

  console.log("👋 getGreeting(\"Hello, World!\"):", greeting);

  // Get initial array length
  const initialLength = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getArrayLength",
  });

  console.log("📏 Initial array length:", initialLength);

  // Modify storage array
  const { request: modifyRequest } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "modifyStorageArray",
    account,
  });

  await walletClient.writeContract(modifyRequest);
  console.log("✅ Modified storage array");

  // Get updated array length
  const updatedLength = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getArrayLength",
  });

  console.log("📏 Updated array length:", updatedLength);

  // Get array element
  if (updatedLength > 0) {
    const element = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "storageArray",
      args: [0n],
    });

    console.log("📝 Array element at index 0:", element);
  }

  // Clear storage array
  const { request: clearRequest } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "clearStorageArray",
    account,
  });

  await walletClient.writeContract(clearRequest);
  console.log("🧹 Cleared storage array");

  // Get final array length
  const finalLength = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getArrayLength",
  });

  console.log("📏 Final array length:", finalLength);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});