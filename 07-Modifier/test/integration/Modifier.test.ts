import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";

describe("Modifier Contract", async function () {
  const { viem } = await network.connect();

  it("Should deploy and test basic modifiers", async function () {
    const contract = await viem.deployContract("Modifier", [], {
      value: 0n,
    });

    // Test initial state
    assert.equal(await contract.read.getNumber(), 0n);
    assert.equal(await contract.read.isReady(), false);

    // Test modifier validNumber
    await contract.write.setNumber([42n]);
    assert.equal(await contract.read.getNumber(), 42n);

    // Test modifier validNumber - should fail with 0
    await assert.rejects(
      async () => await contract.write.setNumber([0n]),
      /Number must be between 1 and 100/
    );

    // Test modifier validNumber - should fail with 101
    await assert.rejects(
      async () => await contract.write.setNumber([101n]),
      /Number must be between 1 and 100/
    );
  });

  it("Should test onlyOwner modifier", async function () {
    const contract = await viem.deployContract("Modifier", [], {
      value: 0n,
    });

    // Owner can activate the contract
    await contract.write.makeReady([]);
    assert.equal(await contract.read.isReady(), true);
  });

  it("Should test whenReady modifier", async function () {
    const contract = await viem.deployContract("Modifier", [], {
      value: 0n,
    });

    // Should fail if not ready
    await assert.rejects(
      async () => await contract.write.setNumberWhenReady([25n]),
      /Contract is not ready/
    );

    // Activate contract
    await contract.write.makeReady([]);

    // Now it should work
    await contract.write.setNumberWhenReady([25n]);
    assert.equal(await contract.read.getNumber(), 50n); // 25 * 2
  });

  it("Should test multiple modifiers", async function () {
    const contract = await viem.deployContract("Modifier", [], {
      value: 0n,
    });

    // Activate contract
    await contract.write.makeReady([]);

    // Test function with multiple modifiers
    await contract.write.setNumberWhenReady([30n]);
    assert.equal(await contract.read.getNumber(), 60n); // 30 * 2

    // Should fail with invalid number
    await assert.rejects(
      async () => await contract.write.setNumberWhenReady([0n]),
      /Number must be between 1 and 100/
    );
  });
});
