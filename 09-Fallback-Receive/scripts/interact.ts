import "dotenv/config";
import { createPublicClient, createWalletClient, http, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/FallbackReceive.sol/FallbackReceive.json";

const contractAddress = process.env.CONTRACT_ADDRESS! as `0x${string}`;
const privateKey = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem client for FallbackReceive...");

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

  console.log("\n📊 === INITIAL CONTRACT STATE ===");

  // 🔍 Read initial state
  const initialBalance = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractBalance",
  }) as bigint;

  const [receiveCount, etherFromReceive] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getReceiveStats",
  }) as [bigint, bigint];

  const [fallbackCount, etherFromFallback] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getFallbackStats",
  }) as [bigint, bigint];

  const [lastSender, lastData] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getLastInteraction",
  }) as [string, string];

  const isDataEmpty = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "isLastDataEmpty",
  }) as boolean;

  console.log("💰 Initial contract balance:", formatEther(initialBalance), "ETH");
  console.log("📥 receive() executed:", receiveCount.toString(), "times");
  console.log("💎 Ether from receive():", formatEther(etherFromReceive), "ETH");
  console.log("🔄 fallback() executed:", fallbackCount.toString(), "times");
  console.log("💎 Ether from fallback():", formatEther(etherFromFallback), "ETH");
  console.log("👤 Last sender:", lastSender);
  console.log("📄 Last data empty:", isDataEmpty);

  console.log("\n💰 === TESTING RECEIVE() FUNCTION ===");

  // 💰 Send Ether WITHOUT data to trigger receive()
  const txReceive = await walletClient.sendTransaction({
    to: contractAddress,
    value: BigInt(1e15), // 0.001 ETH
    data: "0x", // No data
  });

  await publicClient.waitForTransactionReceipt({ hash: txReceive });
  console.log("✅ Ether sent without data (receive triggered)");

  // 📊 Check statistics after receive()
  const [newReceiveCount, newEtherFromReceive] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getReceiveStats",
  }) as [bigint, bigint];

  console.log("📥 receive() now executed:", newReceiveCount.toString(), "times");
  console.log("💎 Total Ether from receive():", formatEther(newEtherFromReceive), "ETH");

  console.log("\n🔄 === TESTING FALLBACK() FUNCTION ===");

  // 🔄 Send transaction WITH data to trigger fallback()
  const txFallback = await walletClient.sendTransaction({
    to: contractAddress,
    value: BigInt(5e14), // 0.0005 ETH
    data: "0x12345678", // Arbitrary data
  });

  await publicClient.waitForTransactionReceipt({ hash: txFallback });
  console.log("✅ Transaction sent with data (fallback triggered)");

  // 📊 Check statistics after fallback()
  const [newFallbackCount, newEtherFromFallback] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getFallbackStats",
  }) as [bigint, bigint];

  console.log("🔄 fallback() now executed:", newFallbackCount.toString(), "times");
  console.log("💎 Total Ether from fallback():", formatEther(newEtherFromFallback), "ETH");

  console.log("\n🧪 === TESTING NON-EXISTENT FUNCTION ===");

  // 🧪 Try to call non-existent function (will trigger fallback)
  try {
    const txNonExistent = await walletClient.sendTransaction({
      to: contractAddress,
      value: BigInt(2e14), // 0.0002 ETH
      data: "0xabcdef00", // Non-existent function selector
    });

    await publicClient.waitForTransactionReceipt({ hash: txNonExistent });
    console.log("✅ Non-existent function called (fallback triggered)");
  } catch (error) {
    console.log("⚠️ Expected error when calling non-existent function:", error);
  }

  console.log("\n📊 === FINAL CONTRACT STATE ===");

  // 📊 Final state
  const finalBalance = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractBalance",
  }) as bigint;

  const [finalReceiveCount, finalEtherFromReceive] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getReceiveStats",
  }) as [bigint, bigint];

  const [finalFallbackCount, finalEtherFromFallback] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getFallbackStats",
  }) as [bigint, bigint];

  const [finalLastSender, finalLastData] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getLastInteraction",
  }) as [string, string];

  const finalIsDataEmpty = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "isLastDataEmpty",
  }) as boolean;

  console.log("💰 Final contract balance:", formatEther(finalBalance), "ETH");
  console.log("📥 Total receive() executed:", finalReceiveCount.toString(), "times");
  console.log("💎 Total Ether from receive():", formatEther(finalEtherFromReceive), "ETH");
  console.log("🔄 Total fallback() executed:", finalFallbackCount.toString(), "times");
  console.log("💎 Total Ether from fallback():", formatEther(finalEtherFromFallback), "ETH");
  console.log("👤 Last sender:", finalLastSender);
  console.log("📄 Last data empty:", finalIsDataEmpty);
  console.log("📄 Last data (hex):", finalLastData);

  console.log("\n🧹 === CLEANING STATISTICS (OPTIONAL) ===");

  // 🧹 Optional: Reset statistics for testing
  const txReset = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "resetStats",
  });

  await publicClient.waitForTransactionReceipt({ hash: txReset });
  console.log("✅ Statistics reset");

  // Verify reset
  const [resetReceiveCount, resetEtherFromReceive] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getReceiveStats",
  }) as [bigint, bigint];

  console.log("📊 After reset - receive():", resetReceiveCount.toString(), "times");
  console.log("💎 After reset - Ether from receive():", formatEther(resetEtherFromReceive), "ETH");
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});