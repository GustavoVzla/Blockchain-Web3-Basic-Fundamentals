import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("VirtualOverride", async () => {
  const { viem } = await network.connect();
  const baseContract = await viem.deployContract("VirtualInheritance");
  const childContract = await viem.deployContract("ChildFunctions");

  it("should return correct greeting from base contract", async () => {
    const result = await baseContract.read.greet();
    assert.equal(result, "Hello from the base contract");
  });

  it("should return correct greeting from child contract", async () => {
    const result = await childContract.read.greet();
    assert.equal(result, "Hello from the child contract");
  });
});