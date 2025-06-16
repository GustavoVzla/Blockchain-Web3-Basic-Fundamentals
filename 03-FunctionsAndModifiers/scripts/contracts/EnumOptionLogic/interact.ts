import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../../../artifacts/contracts/05-EnumOptionLogic.sol/EnumOptionLogic.json";

const contractAddress = process.env.CONTRACT_ADDRESS_ENUM_OPTION! as `0x${string}`;
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

  console.log("🎚️ Interacting with EnumOptionLogic...");

  // Get initial state
  const initialState = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "currentState",
  });

  console.log("Initial state:", initialState === 0n ? "ON" : "OFF");

  // Turn on
  if (initialState === 1n) {
    const { request: turnOnRequest } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName: "turnOn",
      account,
    });

    await walletClient.writeContract(turnOnRequest);
    console.log("✅ Turned ON");
  }

  // Get current state
  let currentState = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getCurrentState",
  });

  console.log("Current state:", currentState === 0n ? "ON" : "OFF");

  // Turn off
  const { request: turnOffRequest } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "turnOff",
    account,
  });

  await walletClient.writeContract(turnOffRequest);
  console.log("✅ Turned OFF");

  // Get final state
  const finalState = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "currentState",
  });

  console.log("Final state:", finalState === 0n ? "ON" : "OFF");
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});