import { expect } from "chai";
// const async = require('async')
// const should = require('chai').should()
import Redissearch from "./index"


describe("Redis connection", () => {

  it("Redis ping", async () => {
    const rs = new Redissearch({ port: 6379 })
    const pong = await rs.sendCommand("ping")
    expect(pong).to.equal("PONG")
  })

  it("Ping Create/Drop index", async () => {
    const index = "God"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create("God", [{ name: "name", type: "TEXT" }])
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
  })
})