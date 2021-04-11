import { expect } from "chai";
import redissearch from "./index";
// const async = require('async')
// const should = require('chai').should()
import Redissearch from "./index"


describe("Redis Connection", () => {

  it("Ping redis", async () => {
    const rs = new Redissearch({ port: 6379 })
    const pong = await rs.sendCommand("ping")
    expect(pong).to.equal("PONG")
    await rs.disconnect()
  })

  it("Create/Drop index", async () => {
    const index = "article"
    const rs = new Redissearch({ port: 6379 })
    let ok = await rs.create(index, [{ name: "name", type: "TEXT" }])
    expect(ok).to.equal("OK")
    ok = await rs.dropindex(index)
    expect(ok).to.equal("OK")
    await rs.disconnect()
  })
})


describe("Index Creation", () => {
  let rs: redissearch
  let index = 'author'
  beforeEach(async () => {
    rs = new Redissearch({ port: 6379 })
  })

  afterEach(async () => {
    await rs.dropindex(index)
    await rs.disconnect();
  })

  it("Create index with default args", async () => {
    let ok = await rs.create(index, [{ name: "name", type: "TEXT" }, { name: "book", type: "TEXT" }])
    expect(ok).to.equal("OK")
  })

  it("Create index with score", async () => {
    let ok = await rs.create(index, [{ name: "name", type: "TEXT" }, { name: "book", type: "TEXT" }], { score: "0.1", scoreField: "holyBook" })
    expect(ok).to.equal("OK")

  })
})


describe("Search", async () => {

  let rs: redissearch
  let index = "books"

  beforeEach(async () => {
    rs = new Redissearch({ port: 6379 })
  })

  afterEach(async () => {
    await rs.dropindex(index)
    await rs.disconnect();
  })

  it("Insertion", async () => {
    await rs.create(index, [{ name: "title", type: "TEXT" }, { name: "summary", type: "TEXT" }], { score: "0.1", scoreField: "summary" })
    await rs.insert(index, "dune", { title: "dune", summary: "People strugling in the desert" })
    await rs.insert(index, "jungle", { title: "jungle", summary: "In the jungle we strugle" })

    let indexType = await rs.sendCommand("type", ["books#dune"])
    expect(indexType).to.equal("hash")

    let title = await rs.sendCommand("hget", ["books#dune", "title"])
    expect(title).to.equal("dune")
  })

  it("Search", async () => {
    await rs.create(index, [{ name: "title", type: "TEXT" }, { name: "summary", type: "TEXT" }], { score: "0.1", scoreField: "summary" })
    await rs.insert(index, "GoT", { title: "GoT", summary: "you know nothing john snow" })
    await rs.insert(index, "LoR", { title: "LoR", summary: "I use to know you" })
    await rs.insert(index, "martix", { title: "martix", summary: "You will get some Knowledge you" })
    await rs.insert(index, "Bible", { title: "Bible", summary: "Jessus wanna be God" })
    let ret = await rs.search(index, "@summary:know", { noContent: false })
    expect(ret[0]).to.equal(2)
    expect(ret[1]).to.equal("books#LoR")
    expect(ret[2]).deep.equal(['title', 'LoR'])
  })
})

describe("Info", () => {
  let rs: redissearch
  let index = "books"

  beforeEach(async () => {
    rs = new Redissearch({ port: 6379 })
  })

  afterEach(async () => {
    await rs.dropindex(index)
    await rs.disconnect();
  })

  it("Info", async () => {
    await rs.create(index, [{ name: "title", type: "TEXT" }, { name: "summary", type: "TEXT" }], { score: "0.1", scoreField: "summary" })
    await rs.insert(index, "GoT", { title: "GoT", summary: "you know nothing john snow" })
    await rs.insert(index, "LoR", { title: "LoR", summary: "I use to know you" })
    let info = await rs.info("books")
    expect(info.index_name).to.equal("books")
  })
})