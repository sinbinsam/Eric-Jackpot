const   Configstore = require('configstore'),
        config = new Configstore('config');


function getConfig(key) {
    return new Promise((resolve, reject) => {
        try {
            if (config.has(key)) {
                resolve(config.get(key));
            } else {
                reject();
            }            
        } catch {
            reject();
        }

        
    });
}

function setConfig(key, val) {
    return new Promise((resolve, reject) => {
        try {
            config.set(key, val);
            resolve();
        } catch {
            reject();
        }

    });
}

module.exports = {
    setConfig,
    getConfig,
}