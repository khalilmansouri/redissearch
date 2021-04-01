import { createClient, ClientOpts, RedisClient } from "redis"


class redissearch {
  redisClient: RedisClient
  constructor(clientOpts: ClientOpts) {
    this.redisClient = createClient(clientOpts);
    // this.redisClient.add_command('ft.create');
    // this.redisClient.add_command('ft.add');
    // this.redisClient.add_command('ft.addhash');
    // this.redisClient.add_command('ft.aggregate');
    // this.redisClient.add_command('ft.info');
    // this.redisClient.add_command('ft.search');
    // this.redisClient.add_command('ft.explain');
    // this.redisClient.add_command('ft.del');
    // this.redisClient.add_command('ft.drop');
    // this.redisClient.add_command('ft.optimize');
    // this.redisClient.add_command('ft.sugadd');
    // this.redisClient.add_command('ft.sugget');
    // this.redisClient.add_command('ft.sugdel');
    // this.redisClient.add_command('ft.suglen');
    // this.redisClient.add_command('ft.get');
    // this.redisClient.add_command('ft.mget');
    // this.redisClient.add_command('ft.aggregate');
    // this.redisClient.add_command('ft.aggregate');
  }

  async sendCommand(command: string, arg?: any[]) {
    return await new Promise((resolve, reject) => {
      this.redisClient.sendCommand(command, arg, (err, reply) => {
        if (err)
          reject(err)
        else
          resolve(reply)
      })
    })
  }
}


export default redissearch