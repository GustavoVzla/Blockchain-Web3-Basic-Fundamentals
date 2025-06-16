import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("SenderInteractions", async () => {
  const { viem } = await network.connect();
  const [deployer, user1, user2] = await viem.getWalletClients();
  const contract = await viem.deployContract("SenderInteractions");

  it("should have initial lastSender as zero address", async () => {
    const lastSender = await contract.read.lastSender();
    assert.equal(lastSender.toLowerCase(), "0x0000000000000000000000000000000000000000");
  });

  it("should return correct address with whoAmI", async () => {
    const result = await contract.read.whoAmI({ account: user1.account });
    assert.equal(result.toLowerCase(), user1.account.address.toLowerCase());
  });

  it("should update lastSender correctly", async () => {
    await contract.write.updateLastSender({ account: user1.account });
    const lastSender = await contract.read.lastSender();
    assert.equal(lastSender.toLowerCase(), user1.account.address.toLowerCase());
  });

  it("should update lastSender when called by different users", async () => {
    // First user
    await contract.write.updateLastSender({ account: user1.account });
    let lastSender = await contract.read.lastSender();
    assert.equal(lastSender.toLowerCase(), user1.account.address.toLowerCase());

    // Second user
    await contract.write.updateLastSender({ account: user2.account });
    lastSender = await contract.read.lastSender();
    assert.equal(lastSender.toLowerCase(), user2.account.address.toLowerCase());
  });
});