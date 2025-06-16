import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../../../artifacts/contracts/07-SenderInteractions.sol/SenderInteractions.json";

const contractAddress = process.env.CONTRACT_ADDRESS_SENDER! as `0x${string}`;
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

  console.log("👤 Interacting with SenderInteractions...");

  // Get initial lastSender
  const initialLastSender = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "lastSender",
  });

  console.log("Initial lastSender:", initialLastSender);

  // Get whoAmI
  const whoAmI = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "whoAmI",
    account: account.address,
  });

  console.log("whoAmI():", whoAmI);
  console.log("My address:", account.address);

  // Update lastSender
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "updateLastSender",
    account,
  });

  await walletClient.writeContract(request);
  console.log("✅ Updated lastSender");

  // Get updated lastSender
  const updatedLastSender = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "lastSender",
  });

  console.log("Updated lastSender:", updatedLastSender);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});