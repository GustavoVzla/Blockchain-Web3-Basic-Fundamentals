import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../../../artifacts/contracts/02-StateVariblesVisibilityExample.sol/StateVariblesVisibilityExample.json";

const contractAddress = process.env.CONTRACT_ADDRESS_STATE_VARIABLES! as `0x${string}`;
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

  console.log("📍 Interacting with StateVariblesVisibilityExample...");

  // Read initial values
  const initialNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "storedNumber",
  });

  const initialName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "storedName",
  });

  const initialIsReady = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "isReady",
  });

  console.log("Initial values:");
  console.log("- storedNumber:", initialNumber);
  console.log("- storedName:", initialName);
  console.log("- isReady:", initialIsReady);

  // Set new values
  const { request: setNumberRequest } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "setPublicNumber",
    args: [42n],
    account,
  });

  await walletClient.writeContract(setNumberRequest);

  const { request: setNameRequest } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "setInternalName",
    args: ["Nuevo Nombre"],
    account,
  });

  await walletClient.writeContract(setNameRequest);

  const { request: toggleRequest } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "usePrivateToggle",
    account,
  });

  await walletClient.writeContract(toggleRequest);

  // Read updated values
  const updatedNumber = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "storedNumber",
  });

  const updatedName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "storedName",
  });

  const updatedIsReady = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "isReady",
  });

  console.log("\nUpdated values:");
  console.log("- storedNumber:", updatedNumber);
  console.log("- storedName:", updatedName);
  console.log("- isReady:", updatedIsReady);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});