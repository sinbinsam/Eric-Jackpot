const { promises } = require('dns');

const   express         = require('express'),
        CronJob         = require('cron').CronJob,
        axios           = require('axios'),
        fs              = require('fs'),
        moment          = require('moment'),
        //{ poolPromise } = require('./db'),
        //{ sql }         = require('./db'),
        { jackpotQuery }    = require('./jackpotQuery'),
        { promos }          = require('./promos'),
        { tracks1000 }      = require('./promos'),
        { tracks2500 }      = require('./promos'),
        { tracks5000 }      = require('./promos'),
        { tracks10000 }     = require('./promos'),
        { quietTimes }      = require('./promos'),
        port                = process.env.PORT || 9090,
        config              = require('./configInterface.js'),
        { nanoid }          = require('nanoid'),
        playerIp            = '10.160.27.80',
        app                 = express();

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });


var     q = [],
        promoObj = [],
        playerIsBusy = false,
        masterStopped = false,
        stopped = false;



        async function timeOut(ms) { //timeout function
            return new Promise(resolve => setTimeout(resolve, ms));
        }

   

const jackpot = new CronJob('0/3 * * * *', async function() {
    const d = new Date();
    console.log(d + '3 minute timer: ')
    if (masterStopped === false) {
        //sendJackpotQuery();
    } else {
        console.log('jackpot query not sent, masterStop is true')
    }
})

jackpot.start()

const quietTimeChecker = new CronJob('0/1 * * * *', () => {
    if (moment().isBetween(moment(quietTimes.startTime, 'h:mm a'), moment(quietTimes.endTime, 'h:mm a'))) {
        stopped = true
    } else {
        stopped = false
    }

    
})
quietTimeChecker.start()



function startPromoJobs() {
    promos.forEach(obj => {
        promoObj[obj.fileName] = new CronJob(obj.cron,() => {
            addToQ(obj);
        })
        promoObj[obj.fileName].start()
    })
}

startPromoJobs();

function stopPromoJobs() {
    return new Promise((resolve, reject) => {
        promos.forEach(obj => {
            promoObj[obj.fileName].stop()
        })
        resolve();
    })

}


async function sendJackpotQuery() {
    let date = new Date();
    const pool = await poolPromise
    const result = await pool.request()
            .query(jackpotQuery, (err, result) => {
                    if (err) {
                        console.log(date + ': ' + 'there was an error querying:')
                        console.log(err)
                    } else {
                        const date = new Date()
                        if (result.recordset.length > 0) {
                            console.log(date + ': ' + JSON.stringify(result.recordsets[0]));
                            jackpotConditional(parseInt(result.recordsets[0][0].WinInDollars), result.recordsets[0][0].gamename)
                            sql.close()
                            return
                        } else if (result.recordset.length == 0) {
                            console.log(date + ': ' + 'there were no results')
                            sql.close()
                            return
                        }
                    }
                })
            
        
}


function jackpotConditional(num, gameName) { //num is int of how much won, gameName is string of the game name
    let date = new Date()
    if (!num || num < 1500) {
        console.log(date + ': no number or less than 1500')
    } else {
        if (num >= 1500 && num < 2500) {
            console.log(date + ': playing 1500 - 2500');
            q.push(tracks1000[getRandomInt(tracks1000.length)])
        } else if (num >= 2500 && num < 5000) { //if greater than or equal to 2,500 and less than 5,000
            console.log(date + ': playing 2500 - 5000');
            q.push(tracks2500[getRandomInt(tracks2500.length)])
        } else if (num >= 5000 && num < 10000) { //if greater or equal to 5,000 and less than 10,000
            console.log(date + ': playing 5000 - 10000');
            q.push(tracks5000[getRandomInt(tracks5000.length)])
        } else if (num >= 10000) { //if greater than or equal to 10,000
            console.log(date + ': playing 10000');
            q.push(tracks10000[getRandomInt(tracks10000.length)])
        }
    }
} //tracks[getRandomInt(tracks.length)]


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }



async function sendPlayCommand(track) { //string of filename, dont include .wav
    return new Promise((resolve, reject) => {
        console.log('STOPPED: ' + stopped)
        if (stopped === false) {
            let date = new Date()
            console.log(date + ': played track ' + track)
            resolve() //remove for production
                /*axios({
                    method: 'get',
                    url: 'http://' + playerIp + ':9000/rest/control?fileName=' + track
                })
                .then((res) => {
                    if (res.status === 200) {
                        resolve();
                    } else {
                        console.log(date + ': ' + 'player did not respond, is it unplugged?')
                        reject();
                    }
                })*/            
        } else {
            reject();
        }

    })

}

async function qManager () {
        if (playerIsBusy === false && masterStopped === false) {
            console.log('called qmanager: ' + q[0].fileName)
            playerIsBusy = true;
            sendPlayCommand(q[0].fileName)
                .then(afterPlay())
                .catch(err => {
                    console.log('there was a problem playing audio, it might be stopped')
                    afterPlay()
                });
                    async function afterPlay() {
                    await timeOut(q[0].timeLength)
                    q = q.slice(1);
                    if (q.length > 0) {
                        playerIsBusy = false;
                        qManager(q[0].fileName, q[0].timeLength);
                    } else {
                        console.log('stopped watcher')
                        playerIsBusy = false;
                    }                          
                    }

                
        } else {
            return
        }
}

async function addToQ (obj) {
    q.push(obj);
    qManager();
}

    /*app.get('/eric', async (req, res) => {
        let arr = [
            {
                '_id': nanoid(),
                'fileName': 'yes',
                'timeLength': '10000',
                'cron': '0/1 * * * *'
            },
            {
                '_id': nanoid(),
                'fileName': 'no',
                'timeLength': '10000',
                'cron': '0/2 * * * *'
            }
        ]
    config.setConfig('promos', arr)
    })

    app.get('/stop', async (req, res) => {
        console.log(promoObj)
        stopPromoJobs()
            .then(res.sendStatus(200))
    })

    app.get('/api/get', (req, res) => {
        config.getConfig('promos')
        .then(resp => {
            console.log(resp)
            res.json(resp)
        })
        .catch(err => res.sendStatus(404));
    });

    app.get('/api/set', (req, res) => {
    config.setConfig('promos', req.body.params)
        .then(res.sendStatus(200))
        .catch(err => res.sendStatus(500));
    });

    app.get('/config', (req, res) => {
        config.getConfig('all')
            .then(resp => {
                res.send(resp)
            })
            .catch(err => res.sendStatus(404));
    });

    app.get('config/set/:key:val', (req, res) => {
        let key = req.body.key;
        let val = req.body.val;
        config.setConfig(key, val);
        res.sendStatus(200);
    })*/

    app.get('/stop', (req, res) => {
        masterStop = true;
        res.sendStatus(200);
    });

    app.get('/start', (req, res) => {
        masterStop = false;
        res.sendStatus(200)
    })

  
    app.listen(port, (err) => {
        let date = new Date()
        if (err) {
            console.log(date + ': ' + 'there was an error starting the server')
            console.log(err)
            } else {
                console.log(date + ': ' + 'Server started! V2 At http://localhost:' + port);
            }
    });