import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";
import { parseEther } from "viem";

describe("RequirePayments", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();

  it("Should accept valid deposit", async function () {
    const requirePayments = await viem.deployContract("RequirePayments");

    await requirePayments.write.deposit({ value: parseEther("1") });

    const balance = await requirePayments.read.balances([
      owner.account.address,
    ]);
    assert.equal(balance, parseEther("1"));
  });

  it("Should revert if deposit is zero", async function () {
    const requirePayments = await viem.deployContract("RequirePayments");

    await assert.rejects(
      async () =>
        await requirePayments.write.deposit({ value: parseEther("0") }),
      /Must send some ETH/
    );
  });

  it("Should revert if deposit is below minimum", async function () {
    const requirePayments = await viem.deployContract("RequirePayments");

    await assert.rejects(
      async () =>
        await requirePayments.write.deposit({ value: parseEther("0.05") }),
      /Minimum deposit is 0.1 ETH/
    );
  });

  it("Should allow withdrawal of deposited amount", async function () {
    const requirePayments = await viem.deployContract("RequirePayments");

    // First deposit
    await requirePayments.write.deposit({ value: parseEther("1") });

    // Then withdraw
    await requirePayments.write.withdraw([parseEther("0.5")]);

    const balance = await requirePayments.read.balances([
      owner.account.address,
    ]);
    assert.equal(balance, parseEther("0.5"));
  });

  it("Should revert if insufficient balance for withdrawal", async function () {
    const requirePayments = await viem.deployContract("RequirePayments");

    await assert.rejects(
      async () => await requirePayments.write.withdraw([parseEther("1")]),
      /Insufficient balance/
    );
  });

  it("Should return correct user balance", async function () {
    const requirePayments = await viem.deployContract("RequirePayments");

    await requirePayments.write.deposit({ value: parseEther("2") });

    const userBalance = await requirePayments.read.getBalance();
    assert.equal(userBalance, parseEther("2"));
  });
});
