import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("EnumOptionLogic", async () => {
  const { viem } = await network.connect();
  const contract = await viem.deployContract("EnumOptionLogic");

  it("should have initial state set to OFF", async () => {
    const state = await contract.read.currentState();
    // OFF is 1
    assert.equal(state, 1n);
  });

  it("should turn ON correctly", async () => {
    await contract.write.turnOn();
    const state = await contract.read.currentState();
    // ON is 0
    assert.equal(state, 0n);
  });

  it("should turn OFF correctly", async () => {
    // First make sure it's ON
    await contract.write.turnOn();
    let state = await contract.read.currentState();
    assert.equal(state, 0n);
    
    // Then turn it OFF
    await contract.write.turnOff();
    state = await contract.read.currentState();
    // OFF is 1
    assert.equal(state, 1n);
  });

  it("should get current state correctly", async () => {
    await contract.write.turnOn();
    const state = await contract.read.getCurrentState();
    // ON is 0
    assert.equal(state, 0n);
  });
});