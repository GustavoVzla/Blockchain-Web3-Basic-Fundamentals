import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";
import { parseEther } from "viem";

describe("ContractLifecycle", async function () {
  const { viem } = await network.connect();
  const [owner, user1] = await viem.getWalletClients();

  it("Should deploy and test basic functionality", async function () {
    // Deploy contract
    const contract = await viem.deployContract("ContractLifecycle", [
      "TestContract",
    ]);

    // Test initial state
    const [contractName, initialOwner, , initialStatus] =
      await contract.read.getContractInfo();
    assert.strictEqual(contractName, "TestContract");
    assert.strictEqual(
      initialOwner.toLowerCase(),
      owner.account.address.toLowerCase()
    );
    assert.strictEqual(initialStatus, 1); // Status.Active

    // Test user registration
    const user1Contract = await viem.getContractAt(
      "ContractLifecycle",
      contract.address,
      {
        client: { wallet: user1 },
      }
    );

    await user1Contract.write.registerUser(["Alice"]);
    const [userName, , userExists] = await contract.read.getUserInfo([
      user1.account.address,
    ]);
    assert.strictEqual(userName, "Alice");
    assert.strictEqual(userExists, true);
  });

  it("Should test deposit functionality", async function () {
    const contract = await viem.deployContract("ContractLifecycle", [
      "TestContract",
    ]);
    const user1Contract = await viem.getContractAt(
      "ContractLifecycle",
      contract.address,
      {
        client: { wallet: user1 },
      }
    );

    await user1Contract.write.registerUser(["Alice"]);
    await user1Contract.write.deposit({ value: parseEther("1") });

    const [, userBalance] = await contract.read.getUserInfo([
      user1.account.address,
    ]);
    assert.strictEqual(userBalance, parseEther("1"));
  });

  it("Should test receive function", async function () {
    const contract = await viem.deployContract("ContractLifecycle", [
      "TestContract",
    ]);
    const publicClient = await viem.getPublicClient();

    await user1.sendTransaction({
      to: contract.address,
      value: parseEther("0.5"),
    });

    const balance = await publicClient.getBalance({
      address: contract.address,
    });
    assert.strictEqual(balance, parseEther("0.5"));
  });

  it("Should test owner restrictions", async function () {
    const contract = await viem.deployContract("ContractLifecycle", [
      "TestContract",
    ]);
    const user1Contract = await viem.getContractAt(
      "ContractLifecycle",
      contract.address,
      {
        client: { wallet: user1 },
      }
    );

    // Only owner can change status
    await assert.rejects(
      async () => await user1Contract.write.changeStatus([0]),
      /Only owner can do this/
    );
  });

  it("Should test require statements", async function () {
    const contract = await viem.deployContract("ContractLifecycle", [
      "TestContract",
    ]);
    const user1Contract = await viem.getContractAt(
      "ContractLifecycle",
      contract.address,
      {
        client: { wallet: user1 },
      }
    );

    // Empty name should fail
    await assert.rejects(
      async () => await user1Contract.write.registerUser([""]),
      /Name cannot be empty/
    );
  });
});
