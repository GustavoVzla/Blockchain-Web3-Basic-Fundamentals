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
import { abi } from "../../../artifacts/contracts/RequirePayments.sol/RequirePayments.json";

const contractAddress = process.env.CONTRACT_ADDRESS_PAYMENTS! as `0x${string}`;
const privateKey = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

const main = async () => {
  console.log("🚀 Conectando al contrato RequirePayments con Viem...");

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

  console.log("👤 Cuenta conectada:", account.address);
  console.log("📍 Dirección del contrato:", contractAddress);
  console.log("\n" + "=".repeat(60));

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 1: LECTURA DE ESTADO INICIAL
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n🔍 LEYENDO ESTADO INICIAL DEL CONTRATO:");

  const initialBalance = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "balances",
    args: [account.address],
  })) as bigint;

  console.log("💰 Balance inicial:", formatEther(initialBalance), "ETH");

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 2: DEPÓSITOS (VALIDACIONES DE REQUIRE)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n💰 REALIZANDO DEPÓSITOS (Probando validaciones de require):");

  try {
    // Depósito válido
    const txDeposit = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "deposit",
      value: parseEther("0.5"), // 0.5 ETH (mayor al mínimo de 0.1)
    });

    await publicClient.waitForTransactionReceipt({ hash: txDeposit });
    console.log("✅ Depósito exitoso: 0.5 ETH");

    // Verificar nuevo balance
    const newBalance = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "balances",
      args: [account.address],
    })) as bigint;
    console.log("💰 Nuevo balance:", formatEther(newBalance), "ETH");
  } catch (error: any) {
    console.log("❌ Error en depósito:", error.message);
  }

  // Probar depósito inválido (cero)
  console.log("\n🚫 Probando depósito inválido (0 ETH):");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "deposit",
      value: parseEther("0"), // 0 ETH
    });
  } catch (error: any) {
    console.log(
      "✅ Validación funcionó - Error esperado:",
      error.message.split("\n")[0]
    );
  }

  // Probar depósito inválido (muy pequeño)
  console.log("\n🚫 Probando depósito inválido (menor al mínimo):");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "deposit",
      value: parseEther("0.05"), // Menor al mínimo de 0.1 ETH
    });
  } catch (error: any) {
    console.log(
      "✅ Validación funcionó - Error esperado:",
      error.message.split("\n")[0]
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 3: RETIROS (VALIDACIONES DE REQUIRE)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n💸 REALIZANDO RETIROS (Probando validaciones de require):");

  try {
    // Retiro válido
    const txWithdraw = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "withdraw",
      args: [parseEther("0.2")], // Retirar 0.2 ETH
    });

    await publicClient.waitForTransactionReceipt({ hash: txWithdraw });
    console.log("✅ Retiro exitoso: 0.2 ETH");

    // Verificar balance después del retiro
    const balanceAfterWithdraw = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "balances",
      args: [account.address],
    })) as bigint;
    console.log(
      "💰 Balance después del retiro:",
      formatEther(balanceAfterWithdraw),
      "ETH"
    );
  } catch (error: any) {
    console.log("❌ Error en retiro:", error.message);
  }

  // Probar retiro inválido (más de lo disponible)
  console.log("\n🚫 Probando retiro inválido (balance insuficiente):");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "withdraw",
      args: [parseEther("10")], // Más de lo disponible
    });
  } catch (error: any) {
    console.log(
      "✅ Validación funcionó - Error esperado:",
      error.message.split("\n")[0]
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 4: CONSULTAR BALANCE
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n📊 CONSULTANDO BALANCE:");

  try {
    const userBalance = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "getBalance",
    })) as bigint;
    console.log("✅ Mi balance actual:", formatEther(userBalance), "ETH");
  } catch (error: any) {
    console.log("❌ Error al consultar balance:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 ¡Interacción con RequirePayments completada!");
};

main().catch((error) => {
  console.error("💥 Error en la ejecución:", error);
  process.exitCode = 1;
});
