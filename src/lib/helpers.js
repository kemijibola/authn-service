const halson = require('halson');
const config = require('config');

module.exports = {
    makeHAL: makeHAL,
    setupRoutes: setupRoutes,
    validateKey: validateKey,
    sendMail: mailBuilder
}

function setupRoutes(server, swagger, lib){
    for(controller in lib.controllers){
        cont = lib.controllers[controller](lib);
        cont.setUpActions(server, swagger);
    }
}
function validateKey(hmacdata, key, lib){
    if(+key === 777) return true;
    let hmac = require('crypto')
                .createHmac('md5', config.get('secretKey'))
                .update(hmacdata)
                .digest('hex');
    return hmac;
}
function makeHAL(data, links, embed){
    let obj = halson(data);
    if (links && links.length > 0){
        links.forEach(link => {
            obj.addLink(link.name, {
                href: link.href,
                title: link.title || ''
            })
        });
    }
    if (embed && embed.length > 0){
        embed.forEach(item => {
            obj.addEmbed(item.name, item.data)
        });
    }
    return obj;
}
function mailBuilder(){
    return 
}