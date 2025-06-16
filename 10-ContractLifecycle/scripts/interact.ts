import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/ContractLifecycle.sol/ContractLifecycle.json";

const contractAddress = process.env.CONTRACT_ADDRESS_CONTRACTLIFECYCLE! as `0x${string}`;
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
  const contractInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractInfo",
  });

  const owner = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "owner",
  });

  const totalBalance = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "totalBalance",
  });

  console.log("📋 Contract Info:", contractInfo);
  console.log("👤 Owner:", owner);
  console.log("💰 Total Balance:", totalBalance);

  // 👤 Testing user registration
  console.log("\n👤 Testing user registration...");
  const txRegister = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "registerUser",
    args: ["Alice"],
  });

  await publicClient.waitForTransactionReceipt({ hash: txRegister });

  const userInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getUserInfo",
    args: [account.address],
  });

  console.log("✅ User registered:", userInfo);

  // 💰 Testing deposit function
  console.log("\n💰 Testing deposit function...");
  const txDeposit = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "deposit",
    value: BigInt("1000000000000000000"), // 1 ETH
  });

  await publicClient.waitForTransactionReceipt({ hash: txDeposit });

  const updatedUserInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getUserInfo",
    args: [account.address],
  });

  const updatedTotalBalance = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "totalBalance",
  });

  console.log("✅ User info after deposit:", updatedUserInfo);
  console.log("💰 Updated total balance:", updatedTotalBalance);

  // 🔄 Testing status change (only owner)
  console.log("\n🔄 Testing status change (onlyOwner modifier)...");
  const txChangeStatus = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "changeStatus",
    args: [1], // Status.Active = 1
  });

  await publicClient.waitForTransactionReceipt({ hash: txChangeStatus });

  const contractStatus = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "contractStatus",
  });

  console.log("✅ Contract status changed to:", contractStatus);

  // 💸 Testing receive function
  console.log("\n💸 Testing receive function...");
  const txReceive = await walletClient.sendTransaction({
    to: contractAddress,
    value: BigInt("500000000000000000"), // 0.5 ETH
  });

  await publicClient.waitForTransactionReceipt({ hash: txReceive });

  const finalTotalBalance = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "totalBalance",
  });

  console.log("✅ Final total balance after receive:", finalTotalBalance);

  // 📊 Final contract state
  console.log("\n📊 Final contract state:");
  const finalContractInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractInfo",
  });

  const finalUserInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getUserInfo",
    args: [account.address],
  });

  console.log("📋 Final contract info:", finalContractInfo);
  console.log("👤 Final user info:", finalUserInfo);

  console.log("\n🎉 All ContractLifecycle functions working correctly!");
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});