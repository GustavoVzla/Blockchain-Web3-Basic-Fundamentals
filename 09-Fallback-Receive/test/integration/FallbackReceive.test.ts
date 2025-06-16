import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("FallbackReceive", async () => {
  const { viem } = await network.connect({ chainType: "l1" });
  const publicClient = await viem.getPublicClient();
  const [wallet] = await viem.getWalletClients();

  const contract = await viem.deployContract("FallbackReceive", [], {
    client: wallet,
  });

  it("should receive ether via receive function", async () => {
    const initialBalance = await contract.read.getContractBalance();
    
    await wallet.sendTransaction({
      to: contract.address,
      value: 1000000000000000000n, // 1 ETH
      data: "0x", // Empty data to trigger receive()
    });
    
    const finalBalance = await contract.read.getContractBalance();
    const [receiveCount, etherFromReceive] = await contract.read.getReceiveStats();
    
    assert.equal(finalBalance, initialBalance + 1000000000000000000n);
    assert.equal(receiveCount, 1n);
    assert.equal(etherFromReceive, 1000000000000000000n);
  });

  it("should trigger fallback with data", async () => {
    await wallet.sendTransaction({
      to: contract.address,
      value: 500000000000000000n, // 0.5 ETH
      data: "0x12345678", // Data to trigger fallback()
    });
    
    const [fallbackCount, etherFromFallback] = await contract.read.getFallbackStats();
    
    assert.equal(fallbackCount, 1n);
    assert.equal(etherFromFallback, 500000000000000000n);
  });

  it("should get contract balance correctly", async () => {
    const contractBalance = await contract.read.getContractBalance();
    const actualBalance = await publicClient.getBalance({
      address: contract.address,
    });
    
    assert.equal(contractBalance, actualBalance);
  });

  it("should reset statistics", async () => {
    await contract.write.resetStats();
    
    const [receiveCount, etherFromReceive] = await contract.read.getReceiveStats();
    const [fallbackCount, etherFromFallback] = await contract.read.getFallbackStats();
    
    assert.equal(receiveCount, 0n);
    assert.equal(etherFromReceive, 0n);
    assert.equal(fallbackCount, 0n);
    assert.equal(etherFromFallback, 0n);
  });

  it("should track last interaction data", async () => {
    await wallet.sendTransaction({
      to: contract.address,
      value: 100000000000000000n, // 0.1 ETH
      data: "0x", // Empty data
    });
    
    const [lastSender, lastData] = await contract.read.getLastInteraction();
    const isDataEmpty = await contract.read.isLastDataEmpty();
    
    assert.equal(lastSender.toLowerCase(), wallet.account.address.toLowerCase());
    assert.equal(isDataEmpty, true);
  });
});