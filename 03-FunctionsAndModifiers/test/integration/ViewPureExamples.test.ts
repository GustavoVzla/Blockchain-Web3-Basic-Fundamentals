import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("ViewPureExamples", async () => {
  const { viem } = await network.connect();
  const contract = await viem.deployContract("ViewPureExamples");

  it("should return correct stored number", async () => {
    const result = await contract.read.storedNumber();
    assert.equal(result, 30n);
  });

  it("should return correct name", async () => {
    const result = await contract.read.getName();
    assert.equal(result, "Gustavo");
  });

  it("should return correct number from pure function", async () => {
    const result = await contract.read.getNumber();
    assert.equal(result, 200n);
  });

  it("should read number correctly from view function", async () => {
    const result = await contract.read.readNumber();
    assert.equal(result, 30n);
  });
});