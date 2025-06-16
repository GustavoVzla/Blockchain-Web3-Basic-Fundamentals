import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("DataLocation", async () => {
  const { viem } = await network.connect();
  const contract = await viem.deployContract("DataLocation");

  it("should return the same string in getGreeting", async () => {
    const input = "Hello, World!";
    const result = await contract.read.getGreeting([input]);
    assert.equal(result, input);
  });

  it("should handle storage array operations correctly", async () => {
    // Check initial length
    let length = await contract.read.getArrayLength();
    assert.equal(length, 0n);

    // Modify array
    await contract.write.modifyStorageArray();

    // Check updated length
    length = await contract.read.getArrayLength();
    assert.equal(length, 1n);

    // Check element
    const element = await contract.read.storageArray([0n]);
    assert.equal(element, "Updated");

    // Clear array
    await contract.write.clearStorageArray();

    // Check final length
    length = await contract.read.getArrayLength();
    assert.equal(length, 0n);
  });

  it("should add multiple elements to the array", async () => {
    // Add multiple elements
    await contract.write.modifyStorageArray();
    await contract.write.modifyStorageArray();

    // Check length
    const length = await contract.read.getArrayLength();
    assert.equal(length, 2n);

    // Check elements
    const element0 = await contract.read.storageArray([0n]);
    const element1 = await contract.read.storageArray([1n]);
    assert.equal(element0, "Updated");
    assert.equal(element1, "Updated");
  });
});