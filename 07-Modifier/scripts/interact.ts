import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/Modifier.sol/Modifier.json";

const contractAddress = process.env.CONTRACT_ADDRESS_MODIFIER! as `0x${string}`;
const privateKey = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem client...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });

  // 📖 Reading initial state
  const initialNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getNumber",
  });

  const isReady = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "isReady",
  });

  console.log("🔢 Initial number:", initialNumber);
  console.log("✅ Contract ready?:", isReady);

  // 🔒 Testing validNumber modifier
  console.log("\n🔒 Testing validNumber modifier...");
  const txSetNumber = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "setNumber",
    args: [42n],
  });

  await publicClient.waitForTransactionReceipt({ hash: txSetNumber });

  const newNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getNumber",
  });

  console.log("✅ Number saved with modifier:", newNumber);

  // 🔑 Activating contract (owner only)
  console.log("\n🔑 Activating contract (onlyOwner modifier)...");
  const txMakeReady = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "makeReady",
    args: [],
  });

  await publicClient.waitForTransactionReceipt({ hash: txMakeReady });

  const nowReady = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "isReady",
  });

  console.log("✅ Contract activated. Ready?:", nowReady);

  // 🎛️ Testing multiple modifiers
  console.log("\n🎛️ Testing multiple modifiers (onlyOwner + whenReady + validNumber)...");
  const txMultiple = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "setNumberWhenReady",
    args: [25n],
  });

  await publicClient.waitForTransactionReceipt({ hash: txMultiple });

  const finalNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getNumber",
  });

  console.log("✅ Function with multiple modifiers executed. Final number:", finalNumber);

  console.log("\n🎉 All modifiers working correctly!");
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});