import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";
import { parseEther } from "viem";

describe("PayableBasics Contract", async function () {
  const { viem } = await network.connect();

  it("Should deploy and test constructor with ether", async function () {
    const initialAmount = parseEther("1");
    
    const contract = await viem.deployContract("PayableBasics", [], {
      value: initialAmount,
    });

    // Test initial state with ether
    assert.equal(await contract.read.getTotalReceived(), initialAmount);
    assert.equal(await contract.read.getContractBalance(), initialAmount);
  });

  it("Should test receive function", async function () {
    const contract = await viem.deployContract("PayableBasics", [], {
      value: 0n,
    });

    const sendAmount = parseEther("0.5");
    const [, user] = await viem.getWalletClients();

    // Send ether directly (activates receive function)
    await user.sendTransaction({
      to: contract.address,
      value: sendAmount,
    });

    assert.equal(await contract.read.getTotalReceived(), sendAmount);
    assert.equal(await contract.read.getContractBalance(), sendAmount);
  });

  it("Should test sendEther function", async function () {
    const contract = await viem.deployContract("PayableBasics", [], {
      value: 0n,
    });

    const sendAmount = parseEther("1");

    // Test sendEther function
    await contract.write.sendEther([], { value: sendAmount });
    
    assert.equal(await contract.read.getTotalReceived(), sendAmount);
    assert.equal(await contract.read.getContractBalance(), sendAmount);

    // Test sendEther - should fail with 0 ether
    await assert.rejects(
      async () => await contract.write.sendEther([], { value: 0n }),
      /Must send some Ether/
    );
  });

  it("Should test view functions", async function () {
    const contract = await viem.deployContract("PayableBasics", [], {
      value: 0n,
    });

    // Test initial state
    assert.equal(await contract.read.getTotalReceived(), 0n);
    assert.equal(await contract.read.getContractBalance(), 0n);

    const sendAmount = parseEther("2");
    await contract.write.sendEther([], { value: sendAmount });

    // Test after sending ether
    assert.equal(await contract.read.getTotalReceived(), sendAmount);
    assert.equal(await contract.read.getContractBalance(), sendAmount);
  });

  it("Should test multiple transactions", async function () {
    const contract = await viem.deployContract("PayableBasics", [], {
      value: 0n,
    });

    const amount1 = parseEther("0.3");
    const amount2 = parseEther("0.7");
    const totalExpected = amount1 + amount2;
    const [, user] = await viem.getWalletClients();

    // Primera transacción usando sendEther
    await contract.write.sendEther([], { value: amount1 });

    // Segunda transacción usando receive function
    await user.sendTransaction({
      to: contract.address,
      value: amount2,
    });

    assert.equal(await contract.read.getTotalReceived(), totalExpected);
    assert.equal(await contract.read.getContractBalance(), totalExpected);
  });
});
