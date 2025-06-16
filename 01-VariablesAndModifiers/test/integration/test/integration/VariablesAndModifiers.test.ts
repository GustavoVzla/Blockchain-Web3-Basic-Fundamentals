import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("VariablesAndModifiers", async () => {
  const { viem } = await network.connect({ chainType: "l1" });
  const contract = await viem.deployContract("VariablesAndModifiers");

  it("should return correct uint and int values", async () => {
    assert.equal(Number(await contract.read.positiveNumber()), 100);
    assert.equal(Number(await contract.read.maxUint8()), 255);
    assert.equal(Number(await contract.read.negativeNumber()), -50);
    assert.equal(Number(await contract.read.publicUint()), 123);
  });

  it("should return correct string and bytes values", async () => {
    assert.equal(await contract.read.greeting(), "Hello, Blockchain!");
    assert.equal(
      await contract.read.fixedBytes(),
      "0x486f6c6100000000000000000000000000000000000000000000000000000000"
    );
    assert.equal(await contract.read.dynamicBytes(), "0x123456");
    assert.equal(await contract.read.singleByte(), "0x42");
  });

  it("should return correct bool values", async () => {
    assert.equal(await contract.read.isActive(), true);
    assert.equal(await contract.read.flagA(), true);
  });

  it("should return correct address values", async () => {
    const deployer = await contract.read.owner();
    assert.ok(deployer); // address should be valid
    const dev = await contract.read.developer();
    assert.equal(
      dev.toLowerCase(),
      "0xab8483f64d9c6d1ecf9b849ae677dd3315835cb2"
    );
  });

  it("should return visibility test value", async () => {
    assert.equal(await contract.read.visibleToAll(), 42n);
  });

  it("should return valid hash outputs", async () => {
    assert.ok(await contract.read.hashKeccak());
    assert.ok(await contract.read.hashSha256());
    assert.ok(await contract.read.hashRipemd());
  });
});
