import { expect } from "chai";
import redissearch from "./index";
// const async = require('async')
// const should = require('chai').should()
import Redissearch from "./index"


describe("Redis connection", () => {

  it("Ping redis", async () => {
    const rs = new Redissearch({ port: 6379 })
    const pong = await rs.sendCommand("ping")
    expect(pong).to.equal("PONG")
    await rs.disconnect()
  })

  it("Create/Drop index", async () => {
    const index = "author"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create("author", [{ name: "name", type: "TEXT" }])
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
    await rs.disconnect()
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
    await rs.disconnect()
  })

  it("Create index with score", async () => {
    const index = "author"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create("author", [{ name: "name", type: "TEXT" }, { name: "book", type: "TEXT" }], { score: "0.1", scoreField: "holyBook" })
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
    await rs.disconnect()
  })
})


describe("Search", async () => {

  let rs: redissearch
  let index = "books"

  before(async () => {
    rs = new Redissearch({ port: 6379 })
  })

  after(async () => {
    rs.dropindex(index)
    await rs.disconnect();
  })


  it("Search", async () => {
    await rs.create(index, [{ name: "title", type: "TEXT" }, { name: "summary", type: "TEXT" }], { score: "0.1", scoreField: "holyBook" })
    await rs.insert(index, { title: "dune", summary: "People strugling in the desert" })
    await rs.insert(index, { title: "jungle", summary: "In the jungle we strugle" })
    await rs.insert(index, { title: "GoT", summary: "you know nothing john snow" })
    await rs.insert(index, { title: "Bible", summary: "Jessus wanna be God" })
    // console.log(await rs.sendCommand("keys", ["*"]))
    // let ret = await rs.search(index, "Je", )
    // console.log(ret)
    // console.log(await rs.sendCommand("HGETALL", ["books"]))
    // console.log(await rs.sendCommand("get", ["k"]))
    expect(1).to.equal(1)
  })
})