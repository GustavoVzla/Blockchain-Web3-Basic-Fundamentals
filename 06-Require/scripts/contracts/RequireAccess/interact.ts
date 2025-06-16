import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { abi } from "../../../artifacts/contracts/RequireAccess.sol/RequireAccess.json";

const contractAddress = process.env.CONTRACT_ADDRESS_ACCESS! as `0x${string}`;
const privateKey = process.env.HARDHAT_PRIVATE_KEY! as `0x${string}`;

const main = async () => {
  console.log("🚀 Conectando al contrato RequireAccess con Viem...");

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

  const owner = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "owner",
  })) as `0x${string}`;

  const isAuthorized = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "authorizedUsers",
    args: [account.address],
  })) as boolean;

  console.log("👑 Owner:", owner);
  console.log("🔐 Usuario autorizado:", isAuthorized);
  console.log(
    "🤔 ¿Soy el owner?",
    owner.toLowerCase() === account.address.toLowerCase()
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // 📚 EJEMPLO 2: AUTORIZACIÓN DE USUARIOS (CONTROL DE ACCESO)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n🔐 PROBANDO AUTORIZACIÓN DE USUARIOS:");

  // Solo el owner puede autorizar usuarios
  if (owner.toLowerCase() === account.address.toLowerCase()) {
    try {
      // Crear una segunda cuenta para autorizar
      const secondAccount = privateKeyToAccount(
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
      );

      console.log("👤 Intentando autorizar usuario:", secondAccount.address);

      const txAddUser = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName: "addUser",
        args: [secondAccount.address],
      });

      await publicClient.waitForTransactionReceipt({ hash: txAddUser });
      console.log("✅ Usuario autorizado exitosamente");

      // Verificar autorización
      const isNewUserAuthorized = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "authorizedUsers",
        args: [secondAccount.address],
      })) as boolean;
      console.log("🔍 Verificación - Usuario autorizado:", isNewUserAuthorized);

      // ══════════════════════════════════════════════════════════════════════════════
      // 📚 EJEMPLO 3: FUNCIÓN RESTRINGIDA
      // ══════════════════════════════════════════════════════════════════════════════

      console.log("\n🔒 PROBANDO FUNCIÓN RESTRINGIDA:");

      // El owner puede llamar la función restringida
      try {
        const txRestrictedOwner = await walletClient.writeContract({
          address: contractAddress,
          abi,
          functionName: "restrictedFunction",
        });

        await publicClient.waitForTransactionReceipt({
          hash: txRestrictedOwner,
        });
        console.log("✅ Owner ejecutó función restringida exitosamente");
      } catch (error: any) {
        console.log(
          "❌ Error al ejecutar función restringida (owner):",
          error.message
        );
      }

      // El usuario autorizado también puede llamar la función
      try {
        const secondWalletClient = createWalletClient({
          account: secondAccount,
          chain: hardhat,
          transport: http(),
        });

        const txRestrictedUser = await secondWalletClient.writeContract({
          address: contractAddress,
          abi,
          functionName: "restrictedFunction",
        });

        await publicClient.waitForTransactionReceipt({
          hash: txRestrictedUser,
        });
        console.log(
          "✅ Usuario autorizado ejecutó función restringida exitosamente"
        );
      } catch (error: any) {
        console.log(
          "❌ Error al ejecutar función restringida (usuario):",
          error.message
        );
      }

      // ══════════════════════════════════════════════════════════════════════════════
      // 📚 EJEMPLO 4: REMOVER USUARIO
      // ══════════════════════════════════════════════════════════════════════════════

      console.log("\n🚫 REMOVIENDO USUARIO:");

      try {
        const txRemoveUser = await walletClient.writeContract({
          address: contractAddress,
          abi,
          functionName: "removeUser",
          args: [secondAccount.address],
        });

        await publicClient.waitForTransactionReceipt({ hash: txRemoveUser });
        console.log("✅ Usuario removido exitosamente");

        // Verificar que ya no está autorizado
        const isStillAuthorized = (await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "authorizedUsers",
          args: [secondAccount.address],
        })) as boolean;
        console.log(
          "🔍 Verificación - Usuario aún autorizado:",
          isStillAuthorized
        );
      } catch (error: any) {
        console.log("❌ Error al remover usuario:", error.message);
      }
    } catch (error: any) {
      console.log("❌ Error en autorización:", error.message);
    }
  } else {
    console.log("⚠️ No eres el owner, no puedes autorizar usuarios");

    // Probar función restringida sin autorización
    console.log("\n🚫 Probando función restringida sin autorización:");
    try {
      await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName: "restrictedFunction",
      });
    } catch (error: any) {
      console.log(
        "✅ Validación funcionó - Error esperado:",
        error.message.split("\n")[0]
      );
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 ¡Interacción con RequireAccess completada!");
};

main().catch((error) => {
  console.error("💥 Error en la ejecución:", error);
  process.exitCode = 1;
});
