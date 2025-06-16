import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";

describe("RequireAccess", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();

  it("Should allow owner to add user", async function () {
    const requireAccess = await viem.deployContract("RequireAccess");

    await requireAccess.write.addUser([otherAccount.account.address]);

    const isUser = await requireAccess.read.authorizedUsers([
      otherAccount.account.address,
    ]);
    assert.equal(isUser, true);
  });

  it("Should revert if not owner tries to add user", async function () {
    const requireAccess = await viem.deployContract("RequireAccess");

    await assert.rejects(
      async () =>
        await requireAccess.write.addUser([otherAccount.account.address], {
          account: otherAccount.account,
        }),
      /Only owner can perform this action/
    );
  });

  it("Should allow owner to remove user", async function () {
    const requireAccess = await viem.deployContract("RequireAccess");

    // First add user
    await requireAccess.write.addUser([otherAccount.account.address]);

    // Then remove user
    await requireAccess.write.removeUser([otherAccount.account.address]);

    const isUser = await requireAccess.read.authorizedUsers([
      otherAccount.account.address,
    ]);
    assert.equal(isUser, false);
  });

  it("Should allow authorized user to call restricted function", async function () {
    const requireAccess = await viem.deployContract("RequireAccess");

    // Add user first
    await requireAccess.write.addUser([otherAccount.account.address]);

    // Should not throw
    await requireAccess.write.restrictedFunction([], {
      account: otherAccount.account,
    });

    // If we reach here, the function executed successfully
    assert.ok(true);
  });

  it("Should revert if unauthorized user tries to call restricted function", async function () {
    const requireAccess = await viem.deployContract("RequireAccess");

    await assert.rejects(
      async () =>
        await requireAccess.write.restrictedFunction([], {
          account: otherAccount.account,
        }),
      /User not authorized/
    );
  });
});
