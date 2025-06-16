import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";

describe("RequireBasic", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should set a valid age", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await requireBasic.write.setAge([25]);
    const age = await requireBasic.read.age();
    assert.equal(age, 25n);
  });

  it("Should revert if age is 0", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await assert.rejects(
      async () => await requireBasic.write.setAge([0]),
      /Age must be between 1 and 120/
    );
  });

  it("Should revert if age is over 120", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await assert.rejects(
      async () => await requireBasic.write.setAge([121]),
      /Age must be between 1 and 120/
    );
  });

  it("Should set a valid name", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await requireBasic.write.setName(["Alice"]);
    const name = await requireBasic.read.name();
    assert.equal(name, "Alice");
  });

  it("Should revert if name is empty", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await assert.rejects(
      async () => await requireBasic.write.setName([""]),
      /Name cannot be empty/
    );
  });

  it("Should return true for adult age", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await requireBasic.write.setAge([25]);
    const isAdult = await requireBasic.read.isAdult();
    assert.equal(isAdult, true);
  });

  it("Should return false for minor age", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await requireBasic.write.setAge([16]);
    const isAdult = await requireBasic.read.isAdult();
    assert.equal(isAdult, false);
  });

  it("Should revert if age not set when checking isAdult", async function () {
    const requireBasic = await viem.deployContract("RequireBasic");
    
    await assert.rejects(
      async () => await requireBasic.read.isAdult(),
      /Age not set/
    );
  });
});