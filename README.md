# Redissearch

TS client library for [redisearch](https://oss.redislabs.com/redisearch/)

# install

# usage

## Index creation


``` typescript
// The following example creates "users" index with firstName, lastName and email schema  
import Redissearch from "Redissearch"
const PORT = process.env.PORT
const rs = new Redissearch({port: PORT})
const index = "users"
async ()=>{
  await rs.create(
    index, [
      { firstName: "name", type: "TEXT" },
      { lastName: "email", type: "TEXT" }, 
      { email: "name", type: "TEXT" }])
}()
```
## Insertion 

``` typescript
// The following example insert a doc to index "users"  
const user = {
  email: "johndoe@email.com",
  firstName: "John",
  lastName: "Doe"
}
await rs.insert(index, email, user )

```
## Search
...
## Index droping
...

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### The MIT License (MIT)

Copyright (c) 2021 KHALIL MANSOURI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.