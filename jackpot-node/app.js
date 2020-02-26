const   express     = require('express'),
        loki        = require('lokijs'),
        moment      = require('moment'),
        CronJob     = require('cron').CronJob,
        axios       = require('axios'),
        bodyParser  = require('body-parser'),
        //{ poolPromise } = require('./db'),
        //{ sql } = require('./db'),
        app         = express();


const port = process.env.PORT || 8080
const playerIp = '10.160.27.80'


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

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

const logSchema = {
    time: '',
    gameName: '',
    amount: '',
    playConfirmation: ''
}


async function loadDb(colName, callback) {
    var db = new loki('logs');
    db.loadDatabase({}, function () {
        var _collection = db.getCollection(colName);
        if (!_collection) {
            console.log("Collection %s does not exit. Creating ...", colName);
            _collection = db.addCollection(colName);
        }
        callback(_collection, db);
});
}

//logger(moment().format(), 'testGame2', 1690, true)

checker('2-20')


function logger(time, gameName, amount, playConfirmation) {
    loadDb(moment().format('M-YY'), function(col, db) {
        table = logSchema;
        table.time = time;
        table.gameName = gameName;
        table.amount = amount;
        table.playConfirmation = playConfirmation;
            col.insert(table);
                db.saveDatabase();
                    console.log(checker('2-20'))
    })


}

function checker(month, callback) {
    loadDb(month, function(col, db) {
        console.log(col)
    })
}

//schedule query

//const pool = new sql.ConnectionPool(config);
   

const job = new CronJob('0/3 * * * *', async function() {
    const d = new Date();
    console.log(d + '3 minute timer: ')
    sendJackpotQuery();
})

//job.start()



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
        console.log(date + ': no number or less than 1500')
    } else {
        if (num >= 1500 && num < 2500) {
            console.log(date + ': playing 1500 - 2500')
            //sendPlayCommand(tracks1000[getRandomInt(tracks1000.length)], num, gameName)
        } else if (num >= 2500 && num < 5000) { //if greater than or equal to 2,500 and less than 5,000
            console.log(date + ': playing 2500 - 5000')
            //sendPlayCommand(tracks2500[getRandomInt(tracks2500.length)], num, gameName)
        } else if (num >= 5000 && num < 10000) { //if greater or equal to 5,000 and less than 10,000
            //sendPlayCommand(tracks5000[getRandomInt(tracks5000.length)], num, gameName)
            console.log(date + ': playing 5000 - 10000')
        } else if (num >= 10000) { //if greater than or equal to 10,000
            console.log(date + ': playing 10000')
            //sendPlayCommand(tracks10000[getRandomInt(tracks10000.length)], num, gameName)
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
        loadDb(moment().format('M-YY'), function(col, db) {
            console.log(col.data)
            res.render('log', {data: col.data});
        });
        
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