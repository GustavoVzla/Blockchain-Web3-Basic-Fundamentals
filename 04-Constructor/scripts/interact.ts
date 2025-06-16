import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Load the three ABIs
import { abi as basicAbi } from "../../../artifacts/contracts/Construnctor.sol/BasicConstructor.json";
import { abi as ownerAbi } from "../../../artifacts/contracts/Construnctor.sol/OwnerConstructor.json";
import { abi as immutableAbi } from "../../../artifacts/contracts/Construnctor.sol/ImmutableConstructor.json";

const contractAddresses = {
  basic: process.env.BASIC_CONSTRUCTOR_ADDRESS! as `0x${string}`,
  owner: process.env.OWNER_CONSTRUCTOR_ADDRESS! as `0x${string}`,
  immutable: process.env.IMMUTABLE_CONSTRUCTOR_ADDRESS! as `0x${string}`,
};

const privateKey = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Hardhat...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  const walletClient = createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: hardhat,
    transport: http(),
  });

  console.log("\n🔎 Reading from BasicConstructor...");
  const name = await publicClient.readContract({
    address: contractAddresses.basic,
    abi: basicAbi,
    functionName: "name",
  });
  console.log("🧱 Name stored:", name);

  console.log("\n🔎 Reading from OwnerConstructor...");
  const isOwner = await publicClient.readContract({
    address: contractAddresses.owner,
    abi: ownerAbi,
    functionName: "isOwner",
  });
  console.log("👤 Are you the owner?", isOwner);

  console.log("\n🔎 Reading from ImmutableConstructor...");
  const creator = await publicClient.readContract({
    address: contractAddresses.immutable,
    abi: immutableAbi,
    functionName: "creator",
  });
  const value = await publicClient.readContract({
    address: contractAddresses.immutable,
    abi: immutableAbi,
    functionName: "initialValue",
  });
  console.log("🛠️ Creator:", creator);
  console.log("🛠️ Initial Value:", value);
};

main().catch((err) => {
  console.error("❌ Error running script:", err);
  process.exit(1);
});
