import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("StructCustomerMapping", async () => {
  const { viem } = await network.connect();
  const [deployer, user1, user2] = await viem.getWalletClients();
  const contract = await viem.deployContract("StructCustomerMapping");

  it("should save and retrieve customer data", async () => {
    // Save customer data for user1
    await contract.write.saveCustomer(
      [1n, "John Doe", "john@example.com"],
      { account: user1.account }
    );

    // Retrieve customer data for user1
    const customer = await contract.read.customers([user1.account.address]);
    assert.equal(customer[0], 1n); // id
    assert.equal(customer[1], "John Doe"); // name
    assert.equal(customer[2], "john@example.com"); // email

    // Get customer using getMyCustomer
    const myCustomer = await contract.read.getMyCustomer({ account: user1.account });
    assert.equal(myCustomer[0], 1n); // id
    assert.equal(myCustomer[1], "John Doe"); // name
    assert.equal(myCustomer[2], "john@example.com"); // email
  });

  it("should handle multiple users correctly", async () => {
    // Save customer data for user2
    await contract.write.saveCustomer(
      [2n, "Jane Smith", "jane@example.com"],
      { account: user2.account }
    );

    // Check user1's data is still correct
    const customer1 = await contract.read.customers([user1.account.address]);
    assert.equal(customer1[0], 1n);
    assert.equal(customer1[1], "John Doe");

    // Check user2's data is correct
    const customer2 = await contract.read.customers([user2.account.address]);
    assert.equal(customer2[0], 2n);
    assert.equal(customer2[1], "Jane Smith");
  });
});