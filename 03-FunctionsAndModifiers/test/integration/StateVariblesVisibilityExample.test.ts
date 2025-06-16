import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("StateVariblesVisibilityExample", async () => {
  const { viem } = await network.connect();
  const contract = await viem.deployContract("StateVariblesVisibilityExample");

  it("should have correct initial values", async () => {
    const storedNumber = await contract.read.storedNumber();
    const storedName = await contract.read.storedName();
    const isReady = await contract.read.isReady();

    assert.equal(storedNumber, 0n);
    assert.equal(storedName, "");
    assert.equal(isReady, false);
  });

  it("should set public number correctly", async () => {
    await contract.write.setPublicNumber([42n]);
    const storedNumber = await contract.read.storedNumber();
    assert.equal(storedNumber, 42n);
  });

  it("should set internal name correctly", async () => {
    await contract.write.setInternalName(["Test Name"]);
    const storedName = await contract.read.storedName();
    assert.equal(storedName, "Test Name");
  });

  it("should toggle ready state", async () => {
    const initialState = await contract.read.isReady();
    await contract.write.toggleReadyPrivate();
    const newState = await contract.read.isReady();
    assert.notEqual(initialState, newState);
  });

  it("should use private toggle", async () => {
    const initialState = await contract.read.isReady();
    await contract.write.usePrivateToggle();
    const newState = await contract.read.isReady();
    assert.notEqual(initialState, newState);
  });
});