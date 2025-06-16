import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("DataStructures", async () => {
  const { viem } = await network.connect({ chainType: "l1" });
  const contract = await viem.deployContract("DataStructures");

  it("should return correct book1 struct values", async () => {
    const [title, author, year] = await contract.read.book1();
    assert.equal(title, "1984");
    assert.equal(author, "George Orwell");
    assert.equal(Number(year), 1949);
  });

  it("should return correct initial enums", async () => {
    const status = await contract.read.userStatus();
    const itemStatus = await contract.read.itemStatus();
    const paymentStatus = await contract.read.paymentStatus();
    const currentState = await contract.read.currentState();

    assert.equal(Number(status), 0); // Pending
    assert.equal(Number(itemStatus), 1); // Active
    assert.equal(Number(paymentStatus), 2); // Inactive
    assert.equal(Number(currentState), 0); // ON (defaultChoice = OFF, but unmodified state = ON)
  });

  it("should return values from fixed arrays", async () => {
    assert.equal(await contract.read.fixedUintList([0]), 1n);
    assert.equal(await contract.read.fixedUintList([1]), 2n);
    assert.equal(await contract.read.fixedUintList([2]), 3n);
    assert.equal(await contract.read.fixedUintList([3]), 4n);
    assert.equal(await contract.read.fixedUintList([4]), 5n);

    assert.equal(await contract.read.fixedArray([0]), 10n);
    assert.equal(await contract.read.fixedArray([1]), 20n);
    assert.equal(await contract.read.fixedArray([2]), 30n);
  });
});
