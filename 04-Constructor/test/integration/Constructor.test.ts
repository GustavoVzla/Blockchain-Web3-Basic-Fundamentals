import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("Constructor Contracts", async () => {
  const { viem } = await network.connect({ chainType: "l1" });

  it("should read values from all constructor contracts", async () => {
    const [signer] = await viem.getWalletClients();

    const basic = await viem.deployContract("BasicConstructor", ["JS 4 Life"], {
      client: signer,
    });
    const owner = await viem.deployContract("OwnerConstructor", [], {
      client: signer,
    });
    const immutable = await viem.deployContract("ImmutableConstructor", [999], {
      client: signer,
    });

    const name = await basic.read.name();
    assert.equal(name, "JS 4 Life");

    const isOwner = await owner.read.isOwner();
    assert.equal(isOwner, true);

    const creator = await immutable.read.creator();
    const initialValue = await immutable.read.initialValue();

    assert.equal(creator.toLowerCase(), signer.account.address.toLowerCase());
    assert.equal(Number(initialValue), 999);
  });
});
