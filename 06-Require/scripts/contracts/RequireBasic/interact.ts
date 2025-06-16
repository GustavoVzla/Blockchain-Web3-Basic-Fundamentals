import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/RequireBasic.sol/RequireBasic.json";

const contractAddress = process.env.CONTRACT_ADDRESS_BASIC! as `0x${string}`;
const privateKey = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

const main = async () => {
  console.log("🚀 Conectando al contrato RequireBasic con Viem...");

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

  const initialAge = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "age",
  })) as bigint;

  const initialName = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "name",
  })) as string;

  console.log("🎂 Edad inicial:", initialAge.toString());
  console.log("👤 Nombre inicial:", initialName || "(vacío)");

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 2: ESTABLECER EDAD (VALIDACIONES DE REQUIRE)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n🎂 ESTABLECIENDO EDAD (Probando validaciones de require):");

  try {
    // Intentar establecer edad válida
    const txSetAge = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "setAge",
      args: [25], // Edad válida
    });

    await publicClient.waitForTransactionReceipt({ hash: txSetAge });
    console.log("✅ Edad establecida exitosamente: 25 años");

    // Leer la edad establecida
    const newAge = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "age",
    })) as bigint;
    console.log("📖 Nueva edad:", newAge.toString());
  } catch (error: any) {
    console.log("❌ Error al establecer edad:", error.message);
  }

  // Probar validación de edad inválida
  console.log("\n🚫 Probando validación de edad inválida (0):");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "setAge",
      args: [0], // Edad inválida
    });
  } catch (error: any) {
    console.log(
      "✅ Validación funcionó - Error esperado:",
      error.message.split("\n")[0]
    );
  }

  console.log("\n🚫 Probando validación de edad inválida (121):");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "setAge",
      args: [121], // Edad inválida
    });
  } catch (error: any) {
    console.log(
      "✅ Validación funcionó - Error esperado:",
      error.message.split("\n")[0]
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 3: ESTABLECER NOMBRE (VALIDACIONES DE REQUIRE)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n👤 ESTABLECIENDO NOMBRE (Probando validaciones de require):");

  try {
    // Intentar establecer nombre válido
    const txSetName = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "setName",
      args: ["Alice"], // Nombre válido
    });

    await publicClient.waitForTransactionReceipt({ hash: txSetName });
    console.log("✅ Nombre establecido exitosamente: Alice");

    // Leer el nombre establecido
    const newName = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "name",
    })) as string;
    console.log("📖 Nuevo nombre:", newName);
  } catch (error: any) {
    console.log("❌ Error al establecer nombre:", error.message);
  }

  // Probar validación de nombre vacío
  console.log("\n🚫 Probando validación de nombre vacío:");
  try {
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "setName",
      args: [""], // Nombre vacío
    });
  } catch (error: any) {
    console.log(
      "✅ Validación funcionó - Error esperado:",
      error.message.split("\n")[0]
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 4: VERIFICAR SI ES ADULTO
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n🔞 VERIFICANDO SI ES ADULTO:");

  try {
    const isAdult = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "isAdult",
    })) as boolean;
    console.log("✅ ¿Es adulto?", isAdult ? "Sí" : "No");
  } catch (error: any) {
    console.log("❌ Error al verificar si es adulto:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 ¡Interacción con RequireBasic completada!");
};

main().catch((error) => {
  console.error("💥 Error en la ejecución:", error);
  process.exitCode = 1;
});
