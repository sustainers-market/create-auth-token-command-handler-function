const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const commandHandler = require("@sustainer-network/create-auth-token-command-handler");
const tokensFromReq = require("@sustainer-network/tokens-from-req");
const eventStore = require("@sustainer-network/event-store-js");
const { sign } = require("@sustainer-network/kms");
const logger = require("@sustainer-network/logger");

app.use(bodyParser.json());

app.post("/", (req, res) => {
  logger.info("req body: ", req.body);
  commandHandler({
    params: req.body,
    tokens: tokensFromReq(req),
    signFn: sign,
    publishEventFn: eventStore.add
  })
    .then(response => res.send(response))
    .catch(e => {
      logger.error(e, { stack: e.stack });

      res.status(e.statusCode || 500).send(e);
    });
});

module.exports = app;
