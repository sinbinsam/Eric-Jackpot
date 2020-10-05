    const       mongo       = require('mongodb').MongoClient,
                ObjectId    = require('mongodb').ObjectID,
                creds       =   require('./creds.json');


async function mongoConnect() {
    return new Promise((resolve, reject) => {
        mongo.connect(creds.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }, (err, client) => {
          if (err) {
            reject(err);
          }        
            resolve(client)
          })
    })
}





function getPromos () {
    return new Promise((resolve, reject) => {
        mongoConnect()
            .then(client => {
                let db = client.db('audioPlayer')
                let coll = db.collection('promos');
                let res = coll.find({}).toArray()
                resolve(res)
                .then(client.close())
                .then(console.log('yes'))
            })
            .catch(err => {
                reject(err);
            })
        })
}

function setPromos(obj) {
    return new Promise((resolve, reject) => {
        mongoConnect()
            .then(client => {
                let db = client.db('audioPlayer');
                let coll = db.collection('promos');
                coll.deleteMany({})
                    .then(() => {
                        coll.insertMany(obj)
                            .then(() => {
                                client.close()
                                resolve()
                            })                 
                    })

                
            })
            .catch(err => {
                reject(err);
            })
    })
}


module.exports = {
getPromos,
setPromos
}