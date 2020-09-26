const   sql         = require('mssql'),
        express     = require('express'),
        CronJob     = require('cron').CronJob,
        axios       = require('axios'),
        path        = require('path'),
        config      = require(path.join(__dirname, './sql.json')),
        app         = express();


const port = process.env.PORT || 443
const playerIp = '10.160.27.80'


const jackpotQuery = "\
SELECT top 4\
CONVERT(money, (PenniesWon / 100.00))AS 'WinInDollars',gamename\
    FROM floorz.play  with (nolock)\
        where PlayerID is not null\
            and isJackpotwin = 1\
            and pennieswon  >=100000\
            and InsertedDatetime > DATEADD(minute, -3, getdate())\
            ;\
"

//schedule query

const pool = new sql.ConnectionPool(config);

const job = new CronJob('0/3 * * * *', async function() {
    const d = new Date();
    console.log(d + '3 minute timer: ')
    sendJackpotQuery();
})

job.start()



async function sendJackpotQuery() {
    const poolConnect = pool.connect();
    await poolConnect;
    const transaction = new sql.Transaction(pool)
        transaction.begin(err => {
            if (err) {
                date = new Date()
                console.log(date + ': ' + 'there was an error with transaction:')
                console.log(err)
            } else {
                const request = new sql.Request(transaction)
                request.query(jackpotQuery, (err, result) => {
                    if (err) {
                        let date = new Date();
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
            
                    transaction.commit(err => {
                        if (err) {
                        console.log('there was an error commiting:')
                        console.log(err)
                        }
                        //console.log("Transaction committed.")
                    })
                })
            }
        })
}

let tracks1000 = [
        '1000HappenedAgainV1',
        '1000JackpotMomentsAgo',
        '1000JackpotWaytoGo',
        '1000MaybeYouV1',
        '1000SomebodyWon'
    ]

let tracks2500 = [
    '2500AllYourFriendsV1',
    '2500FeelAwesomeV1',
    '2500GenericV1',
    '2500ItHappenedAgainV1',
    '2500MomentsAgoV1',
    '2500WhosNextV1'
]

let tracks5000 = [
    '5000AnotherV1',
    '5000CongratulationsV1',
    '5000MaybeYouV1',
    '5000MomentsAgoV1',
    '5000ThatsHowV1',
    '5000WayToGoV1',
    '5000WhosNextV1'
]

let tracks10000 = [
    '10000BigCongratsV1',
    '10000CongratulationsV1',
    '10000FingerLakesFortuneV1',
    '10000GenericV1',
    '10000MomentsAgoV1',
    '10000TimetoCelebrateV1'
]


function jackpotConditional(num, gameName) {
    let date = new Date()
    if (!num || num < 1500) {
        console.log('no number or less than 1000')
    } else {
        if (num >= 1500 && num < 2500) {
            console.log(date + ': playing 1500 - 2500')
            sendPlayCommand(tracks1000[getRandomInt(tracks1000.length)], num, gameName)
        } else if (num >= 2500 && num < 5000) { //if greater than or equal to 2,500 and less than 5,000
            console.log(date + ': playing 2500 - 5000')
            sendPlayCommand(tracks2500[getRandomInt(tracks2500.length)], num, gameName)
        } else if (num >= 5000 && num < 10000) { //if greater or equal to 5,000 and less than 10,000
            sendPlayCommand(tracks5000[getRandomInt(tracks5000.length)], num, gameName)
            console.log(date + ': playing 5000 - 10000')
        } else if (num >= 10000) { //if greater than or equal to 10,000
            console.log(date + ': playing 10000')
            sendPlayCommand(tracks10000[getRandomInt(tracks10000.length)], num, gameName)
        }
    }
} //tracks[getRandomInt(tracks.length)]


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }



function sendPlayCommand(track, chickenDinner, gameName) {
    let date = new Date()
    axios({
        method: 'get',
        url: 'http://' + playerIp + ':9000/jackpot/play?fileName=' + track + '&chickenDinner=' + chickenDinner + '&gameName=' + gameName,
      })
      .then((res) => {
          if (res.status === 200) {
              return true
          } else {
              console.log(date + ': ' + 'player did not respond, is it unplugged?')
              return false
          }
      })
      return true
}

    app.get('/eric', (req, res) => {
        let date = new Date()
        let combinedArr = tracks2500.concat(tracks5000, tracks10000)
        console.log(combinedArr[getRandomInt(combinedArr.length)])
        let playCommand = sendPlayCommand(combinedArr[getRandomInt(combinedArr.length)], 1, 2)
        if (playCommand == true) {
            res.send(date + ': ' + 'sent test command');
        } else {
            res.send(date + ': ' + "there was a problem, the device didn't respond")
        }
      
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
