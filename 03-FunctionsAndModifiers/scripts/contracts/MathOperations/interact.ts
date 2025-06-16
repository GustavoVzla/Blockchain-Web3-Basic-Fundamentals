import "dotenv/config";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/01-MathOperations.sol/MathOperations.json";

const contractAddress = process.env.CONTRACT_ADDRESS_MATH! as `0x${string}`;

const main = async () => {
  console.log("🚀 Connecting to Viem public client...");

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  console.log("🔢 Calling MathOperations...");

  const sum = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "suma",
    args: [10n, 20n],
  });

  const div = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "div",
    args: [50n, 5n],
  });

  const [add1, add2] = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "_addmod",
    args: [10n, 15n, 12n],
  })) as [bigint, bigint];

  console.log("🧮 suma(10, 20):", sum);
  console.log("➗ div(50, 5):", div);
  console.log("➕ addmod(10, 15, 12):", add1, " vs native:", add2);
};

main().catch((err) => {
  console.error("❌ Error executing script:", err);
  process.exit(1);
});
