import { expect } from "chai";
// const async = require('async')
// const should = require('chai').should()
import Redissearch from "./index"


describe("Redis connection", () => {
  it("Ping redis", async () => {
    const rs = new Redissearch({ port: 6379 })
    const pong = await rs.sendCommand("ping")
    expect(pong).to.equal("PONG")
    // const ok = await rs.sendCommand("FT.CREATE", ["myIdx", "ON", "HASH", "PREFIX", 1, "doc:", "SCHEMA", "title", "TEXT", "WEIGHT", 5.0, "body", "TEXT", "url", "TEXT"])
  })
})