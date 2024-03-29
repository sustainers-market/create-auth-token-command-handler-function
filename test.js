const { expect } = require("chai");
const { post } = require("@sustainer-network/request");
const { fineTimestamp } = require("@sustainer-network/datetime");
const { create } = require("@sustainer-network/jwt");
const { sign } = require("@sustainer-network/kms");

const url = "https://create.auth-token.core.staging.sustainer.network";

describe("Create auth token command", () => {
  it("should return successfully", async () => {
    const principle = "some-principle-root";
    const token = await create({
      options: {
        issuer: "create.auth-token.core.staging.sustainer.network",
        subject: principle,
        audience: "https://create.auth-token.core.staging.sustainer.network",
        expiresIn: 234234234234
      },
      data: {
        root: "some-rooot",
        principle,
        scopes: ["*:*:*"],
        context: {
          network: "sustainer.network",
          service: "core",
          org: "some-org"
        }
      },
      signFn: sign
    });

    const response = await post(
      url,
      {
        principle: "some-principle-root",
        audiences: ["*"],
        scopes: ["*:*:*"],
        issuedTimestamp: fineTimestamp(),
        issuerInfo: {
          id: "asdf",
          ip: "asdf"
        }
      },
      {
        authorization: token
      }
    );

    expect(response.statusCode).to.equal(200);
    //eslint-disable-next-line no-console
    console.log(JSON.parse(response.body).token);

    expect(JSON.parse(response.body).token).to.exist;
  });
  it("should return an error if incorrect params", async () => {
    const response = await post(url, {});
    expect(response.statusCode).to.be.at.least(400);
  });
});
