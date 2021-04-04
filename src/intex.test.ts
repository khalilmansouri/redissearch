import { expect } from "chai";
// const async = require('async')
// const should = require('chai').should()
import Redissearch from "./index"


describe("Redis connection", () => {

  it("Ping redis", async () => {
    const rs = new Redissearch({ port: 6379 })
    const pong = await rs.sendCommand("ping")
    expect(pong).to.equal("PONG")
  })

  it("Create/Drop index", async () => {
    const index = "author"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create("author", [{ name: "name", type: "TEXT" }])
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
  })
})



describe("Index Creation", () => {

  it("Create index with default args", async () => {
    const index = "author"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create("author", [{ name: "name", type: "TEXT" }, { name: "book", type: "TEXT" }])
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
  })

  it("Create index with score", async () => {
    const index = "author"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create("author", [{ name: "name", type: "TEXT" }, { name: "book", type: "TEXT" }], { score: "0.1", scoreField: "holyBook" })
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
  })
})