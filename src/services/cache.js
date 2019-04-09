const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const config = require('config');

const client = redis.createClient(config.redis.host);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(){
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function(){

    if (!this.useCache){
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cachedValue = await client.get(key);
    if (cachedValue){
        console.log('fetching from cache');
        return JSON.parse(cachedValue);
    }
    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));
    return result;

}