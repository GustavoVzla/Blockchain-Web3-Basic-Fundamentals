import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("MathOperations", async () => {
  const { viem } = await network.connect();
  const contract = await viem.deployContract("MathOperations");

  it("should sum correctly", async () => {
    const result = await contract.read.suma([10n, 15n]);
    assert.equal(result, 25n);
  });

  it("should divide correctly", async () => {
    const result = await contract.read.div([30n, 3n]);
    assert.equal(result, 10n);
  });

  it("should calculate mod and addmod", async () => {
    const [mod1, mod2] = await contract.read._addmod([17n, 11n, 10n]);
    assert.equal(mod1, (17n + 11n) % 10n); // native addmod
    assert.equal(mod2, 8n);
  });

  it("should calculate mulmod and manual mod", async () => {
    const [mul1, mul2] = await contract.read._mulmod([7n, 6n, 13n]);
    assert.equal(mul1, (7n * 6n) % 13n); // native mulmod
    assert.equal(mul2, 3n);
  });
});
