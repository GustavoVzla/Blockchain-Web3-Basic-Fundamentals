import "dotenv/config";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/PayableBasics.sol/PayableBasics.json";

const contractAddress = process.env
  .CONTRACT_ADDRESS_PAYABLEBASICS! as `0x${string}`;
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
  const initialBalance = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractBalance",
  })) as bigint;

  const initialTotalReceived = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getTotalReceived",
  })) as bigint;

  console.log(
    "💰 Initial contract balance:",
    formatEther(initialBalance),
    "ETH"
  );
  console.log(
    "📊 Initial total received:",
    formatEther(initialTotalReceived),
    "ETH"
  );

  // 💸 Sending Ether using sendEther()
  console.log("\n💸 Sending 0.5 ETH using sendEther()...");
  const txSendEther = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "sendEther",
    args: [],
    value: parseEther("0.5"),
  });

  await publicClient.waitForTransactionReceipt({ hash: txSendEther });
  console.log("✅ sendEther transaction completed:", txSendEther);

  // 📊 Checking state after sendEther
  const balanceAfterSend = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractBalance",
  })) as bigint;

  const totalAfterSend = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getTotalReceived",
  })) as bigint;

  console.log(
    "💰 Balance after sendEther:",
    formatEther(balanceAfterSend),
    "ETH"
  );
  console.log(
    "📊 Total received after sendEther:",
    formatEther(totalAfterSend),
    "ETH"
  );

  // 🎯 Sending Ether directly (will trigger receive())
  console.log("\n🎯 Sending 0.3 ETH directly (will trigger receive())...");
  const txDirectSend = await walletClient.sendTransaction({
    to: contractAddress,
    value: parseEther("0.3"),
  });

  await publicClient.waitForTransactionReceipt({ hash: txDirectSend });
  console.log("✅ Direct send transaction completed:", txDirectSend);

  // 📊 Checking state after receive
  const balanceAfterReceive = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractBalance",
  })) as bigint;

  const totalAfterReceive = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getTotalReceived",
  })) as bigint;

  console.log(
    "💰 Balance after receive:",
    formatEther(balanceAfterReceive),
    "ETH"
  );
  console.log(
    "📊 Total received after receive:",
    formatEther(totalAfterReceive),
    "ETH"
  );

  // 🔄 Multiple small sends
  console.log("\n🔄 Sending multiple small amounts...");

  for (let i = 1; i <= 3; i++) {
    console.log(`   Sending 0.${i} ETH...`);
    const txMultiple = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "sendEther",
      args: [],
      value: parseEther(`0.${i}`),
    });

    await publicClient.waitForTransactionReceipt({ hash: txMultiple });
    console.log(`   ✅ Transaction 0.${i} ETH completed`);
  }

  // 📊 Final state
  const finalBalance = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getContractBalance",
  })) as bigint;

  const finalTotalReceived = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getTotalReceived",
  })) as bigint;

  console.log("\n📊 === FINAL STATE ===");
  console.log(
    "💰 Final contract balance:",
    formatEther(finalBalance),
    "ETH"
  );
  console.log(
    "📈 Final total received:",
    formatEther(finalTotalReceived),
    "ETH"
  );

  // ✅ Consistency check
  if (finalBalance === finalTotalReceived) {
    console.log("✅ Perfect! Balance and total received match");
  } else {
    console.log("⚠️  Difference detected between balance and total received");
  }

  // ❌ Testing edge case: sending 0 ETH
  console.log("\n❌ Testing 0 ETH send (should fail)...");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "sendEther",
      args: [],
      value: parseEther("0"),
    });
    console.log("❌ ERROR: Transaction should have failed");
  } catch (error: any) {
    console.log(
      "✅ Correct: Transaction rejected -",
      error.shortMessage || "Must send some Ether"
    );
  }

  console.log("\n🎉 PayableBasics interaction completed successfully!");
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});
