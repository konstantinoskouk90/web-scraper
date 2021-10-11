import IORedis from 'ioredis';

type DbConfig = { host: string; port: number };

export default class Cache {
  public client: IORedis.Redis;

  constructor(private readonly config: DbConfig) {
    this.client = new IORedis({ port: this.config.port, host: this.config.host });
  }

  public getKey(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.client?.get(key, (_err, reply) => {
        resolve(reply);
      });
    });
  }

  public setKey(key: string, value: string, mode: string, duration: number): Promise<string | undefined | null> {
    return new Promise((resolve) => {
      this.client?.set(key, value, mode, duration, (err, reply) => {
        if (err) {
          resolve(null);
        } else {
          resolve(reply);
        }
      });
    });
  }
}