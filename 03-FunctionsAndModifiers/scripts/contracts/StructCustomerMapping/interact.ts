import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../../../artifacts/contracts/04-StructCustomerMapping.sol/StructCustomerMapping.json";

const contractAddress = process.env.CONTRACT_ADDRESS_STRUCT_CUSTOMER! as `0x${string}`;
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

  console.log("🧍‍♂️ Interacting with StructCustomerMapping...");

  // Save a new customer
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "saveCustomer",
    args: [1n, "John Doe", "john@example.com"],
    account,
  });

  await walletClient.writeContract(request);
  console.log("✅ Customer saved");

  // Get the customer data
  const customer = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getMyCustomer",
    account: account.address,
  });

  console.log("📋 Customer data:", {
    id: customer[0],
    name: customer[1],
    email: customer[2],
  });

  // Get customer directly from mapping
  const mappingCustomer = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "customers",
    args: [account.address],
  });

  console.log("📋 Customer from mapping:", {
    id: mappingCustomer[0],
    name: mappingCustomer[1],
    email: mappingCustomer[2],
  });
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});