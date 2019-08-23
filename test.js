const { fineTimestamp } = require("@sustainer-network/datetime");
const { expect } = require("chai");
const { post } = require("@sustainer-network/request");

const address =
  "https://create.auth-token.core.staging.sustainer.network/v1/issue";
describe("Create auth token command", () => {
  it("should return successfully", async () => {
    const response = await post(address, {
      issuedTimestamp: fineTimestamp(),
      account: "some-account-root",
      payload: {
        metadata: {
          a: 1
        },
        permissions: [
          {
            root: "*",
            domain: "*",
            scope: "*"
          }
        ]
      },
      issuerInfo: {
        id: "asdf",
        ip: "asdf"
      }
    });

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.equal({});
  });
  it("should return an error if incorrect params", async () => {
    const response = await post(address, {});
    expect(response.statusCode).to.be.at.least(400);
  });
});
