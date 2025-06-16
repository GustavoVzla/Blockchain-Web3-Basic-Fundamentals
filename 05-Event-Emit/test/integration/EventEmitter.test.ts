import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { parseEther, parseEventLogs } from "viem";

describe("EventEmitter", async () => {
  const { viem } = await network.connect();
  const [user1, user2] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const contract = await viem.deployContract("EventEmitter");

  it("should have initial stored value of 0", async () => {
    const storedValue = await contract.read.getStoredValue();
    assert.equal(storedValue, 0n);
  });

  it("should emit Deposit event when depositing ETH", async () => {
    // Amount to deposit
    const depositAmount = parseEther("1");

    // Perform the deposit
    const hash = await contract.write.deposit({
      value: depositAmount,
      account: user1.account,
    });

    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Verify that the Deposit event was emitted using parseEventLogs
    const depositEvents = parseEventLogs({
      abi: contract.abi,
      eventName: "Deposit",
      logs: receipt.logs,
    });

    // There should be at least one Deposit event
    assert.equal(depositEvents.length, 1, "Deposit event should be emitted");

    // Verify that the event sender is the correct user
    assert.equal(
      depositEvents[0].args.from.toLowerCase(),
      user1.account.address.toLowerCase(),
      "Event sender should match"
    );

    // Verify that the deposited amount is correct
    assert.equal(
      depositEvents[0].args.amount,
      depositAmount,
      "Deposit amount should match"
    );
  });

  it("should emit UpdatedValue event when updating value", async () => {
    // Initial value
    const initialValue = await contract.read.getStoredValue();

    // New value to set
    const newValue = 42n;

    // Update the value
    const hash = await contract.write.updateValue([newValue], {
      account: user1.account,
    });

    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Verify that the UpdatedValue event was emitted using parseEventLogs
    const valueUpdatedEvents = parseEventLogs({
      abi: contract.abi,
      eventName: "UpdatedValue",
      logs: receipt.logs,
    });

    // There should be at least one UpdatedValue event
    assert.equal(
      valueUpdatedEvents.length,
      1,
      "UpdatedValue event should be emitted"
    );

    // Verify that the old value is correct
    assert.equal(
      valueUpdatedEvents[0].args.oldValue,
      initialValue,
      "Old value should match"
    );

    // Verify that the new value is correct
    assert.equal(
      valueUpdatedEvents[0].args.newValue,
      newValue,
      "New value should match"
    );

    // Verify that the stored value was updated correctly
    const storedValue = await contract.read.getStoredValue();
    assert.equal(storedValue, newValue, "Stored value should be updated");
  });

  it("should emit UserRegistered event when registering a user", async () => {
    // Name of the user to register
    const userName = "Gustavo";

    // Register the user
    const hash = await contract.write.registerUser([userName], {
      account: user2.account,
    });

    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Verify that the UserRegistered event was emitted using parseEventLogs
    const userRegisteredEvents = parseEventLogs({
      abi: contract.abi,
      eventName: "UserRegistered",
      logs: receipt.logs,
    });

    // There should be at least one UserRegistered event
    assert.equal(
      userRegisteredEvents.length,
      1,
      "UserRegistered event should be emitted"
    );

    // Verify that the registered user is correct
    assert.equal(
      userRegisteredEvents[0].args.user.toLowerCase(),
      user2.account.address.toLowerCase(),
      "Registered user should match"
    );

    // Verify that the registered name is correct
    assert.equal(
      userRegisteredEvents[0].args.name,
      userName,
      "Registered name should match"
    );
  });

  it("should fail when trying to deposit 0 ETH", async () => {
    try {
      // Try to deposit 0 ETH
      await contract.write.deposit({
        value: 0n,
        account: user1.account,
      });

      // If we reach here, the transaction didn't fail as expected
      assert.fail("Transaction should have failed");
    } catch (error) {
      // Verify that the error contains the expected message
      assert.ok(
        (error as { message: string }).message.includes(
          "You must send some ETH!"
        ) ||
          (error as { message: string }).message.includes("execution reverted"),
        "Transaction should fail with the correct error message"
      );
    }
  });
});
