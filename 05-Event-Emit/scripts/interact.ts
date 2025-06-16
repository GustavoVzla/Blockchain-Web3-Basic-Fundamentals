import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Load the EventEmitter contract ABI
import { abi as eventEmitterAbi } from "../../../artifacts/contracts/EventEmitter.sol/EventEmitter.json";

// Deployed contract address (the one you got when deploying)
const CONTRACT_ADDRESS = process.env.EVENT_EMITTER_ADDRESS! as `0x${string}`;
const PRIVATE_KEY = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

// Creamos una cuenta desde la clave privada
const account = privateKeyToAccount(PRIVATE_KEY);

// Cliente público para leer datos
const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// Cliente de billetera para enviar transacciones
const walletClient = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
});

console.log("🚀 Interacting with contract at:", CONTRACT_ADDRESS);

async function main() {
  // 🔍 Read the currently stored value
  const storedValue = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: eventEmitterAbi,
    functionName: "getStoredValue",
  });
  console.log("\n🔢 Stored value is:", (storedValue as bigint).toString());

  // 💸 Realizar un depósito y emitir evento `Deposit`
  const depositTxHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: eventEmitterAbi,
    functionName: "deposit",
    value: 1000000000000000000n, // 1 ETH en wei
  });

  console.log("\n💸 Deposit transaction hash:", depositTxHash);
  const depositReceipt = await publicClient.waitForTransactionReceipt({
    hash: depositTxHash,
  });
  console.log("✅ Deposit confirmed in block:", depositReceipt.blockNumber);

  // 🔄 Actualizar el valor y emitir evento `ValueUpdated`
  const newValue = 42;
  const updateTxHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: eventEmitterAbi,
    functionName: "updateValue",
    args: [newValue],
  });

  console.log("\n🔄 Update value transaction hash:", updateTxHash);
  const updateReceipt = await publicClient.waitForTransactionReceipt({
    hash: updateTxHash,
  });
  console.log("✅ Value updated in block:", updateReceipt.blockNumber);

  // 👤 Registrar usuario y emitir evento `UserRegistered`
  const registerTxHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: eventEmitterAbi,
    functionName: "registerUser",
    args: ["Gustavo"],
  });

  console.log("\n👤 Register user transaction hash:", registerTxHash);
  const registerReceipt = await publicClient.waitForTransactionReceipt({
    hash: registerTxHash,
  });
  console.log("✅ User registered in block:", registerReceipt.blockNumber);

  // 🔚 End of script
  console.log("\n🏁 Script completed successfully!");
}

main().catch((err) => {
  console.error("❌ Error during interaction:", err);
});
