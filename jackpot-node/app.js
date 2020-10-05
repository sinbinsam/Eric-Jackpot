const   express         = require('express'),
        CronJob         = require('cron').CronJob,
        axios           = require('axios'),
        //{ poolPromise } = require('./db'),
        //{ sql }         = require('./db'),
        { jackpotQuery }    = require('./jackpotQuery'),
        { promos }          = require('./promos'),
        port            = process.env.PORT || 9090,
        mongoInterface  = require('./mongoInterface'),
        playerIp        = '10.160.27.80',
        app             = express();

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });


var     q = [],
        promoObj = {},
        playerIsBusy = false;



        async function timeOut(ms) { //timeout function
            return new Promise(resolve => setTimeout(resolve, ms));
        }

   

const job = new CronJob('0/3 * * * *', async function() {
    const d = new Date();
    console.log(d + '3 minute timer: ')
    //sendJackpotQuery();
})

job.start()



function startPromoJobs() {
    promos.forEach(obj => {
        promoObj[obj.fileName] = new CronJob(obj.cron,() => {
            addToQ(obj);
        })
        promoObj[obj.fileName].start()
    })
}

startPromoJobs();


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

let tracks1000 = [
    {
        fileName: '1000HappenedAgainV1',
        timeLength: 12000
    },
    {
        fileName: '1000JackpotMomentsAgo',
        timeLength: 7000
    },
    {
        fileName: '1000JackpotWaytoGo',
        timeLength: 9000
    },
    {
        fileName: '1000MaybeYouV1',
        timeLength: 13000
    },
    {
        fileName: '1000SomebodyWon',
        timeLength: 10000
    }
]

let tracks2500 = [
    {
        fileName: '2500AllYourFriendsV1',
        timeLength: 10000
    },
    {
        fileName: '2500FeelAwesomeV1',
        timeLength: 9000
    },
    {
        fileName: '2500GenericV1',
        timeLength: 8000
    },
    {
        fileName: '2500ItHappenedAgainV1',
        timeLength: 9000
    },
    {
        fileName: '2500MomentsAgoV1',
        timeLength: 7000
    },
    {
        fileName: '2500WhosNextV1',
        timeLength: 11000
    }
]

let tracks5000 = [
    {
        fileName: '5000AnotherV1',
        timeLength: 6000
    },
    {
        fileName: '5000CongratulationsV1',
        timeLength: 12000
    },
    {
        fileName: '5000MaybeYouV1',
        timeLength: 10000
    },
    {
        fileName: '5000MomentsAgoV1',
        timeLength: 9000
    },
    {
        fileName: '5000ThatsHowV1',
        timeLength: 13000
    },
    {
        fileName: '5000WayToGoV1',
        timeLength: 5000
    },
    {
        fileName: '5000WhosNextV1',
        timeLength: 9000
    }
]

let tracks10000 = [
    {
        fileName: '10000BigCongratsV1',
        timeLength: 10000
    },
    {
        fileName: '10000CongratulationsV1',
        timeLength: 10000
    },
    {
        fileName: '10000FingerLakesFortuneV1',
        timeLength: 10000
    },
    {
        fileName: '10000GenericV1',
        timeLength: 12000
    },
    {
        fileName: '10000MomentsAgoV1',
        timeLength: 9000
    },
    {
        fileName: '10000TimetoCelebrateV1',
        timeLength: 10000
    }
]


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
    })

}

async function qManager () {
        if (!playerIsBusy) {
            console.log('called qmanager: ' + q[0].fileName)
            playerIsBusy = true;
            sendPlayCommand(q[0].fileName)
                //.catch(console.log('there was a problem playing audio'))
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
}

async function addToQ (obj) {
    q.push(obj);
    qManager();
}

    app.get('/eric', async (req, res) => {
    mongoInterface.getPromos()
        .then(resp => {
            console.log(resp)
            res.json(resp)
        })
    })

    app.get('/api/get', (req, res) => {
        mongoInterface.getPromos()
        .then(resp => {
            console.log(resp)
            res.json(resp)
        })
    })

    app.get('/api/set', (req, res) => {
    mongoInterface.setPromos(req.body.params)
        .then(res.sendStatus(200))
        .catch(res.sendStatus(500));
    })




    /*while (q.length > 0) {
        qManager(q[0].fileName, q[0].timeLength)
        timeOut(500)
    }*/
  
    app.listen(port, (err) => {
        let date = new Date()
        if (err) {
            console.log(date + ': ' + 'there was an error starting the server')
            console.log(err)
            } else {
                console.log(date + ': ' + 'Server started! V2 At http://localhost:' + port);
            }
    });