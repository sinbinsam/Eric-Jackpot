const   sql         = require('mssql'),
        express     = require('express'),
        schedule    = require('node-schedule'),
        axios       = require('axios'),
        path        = require('path'),
        config      = require(path.join(__dirname, './sql.json')),
        app         = express();


const port = process.env.PORT || 8080


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



var rule = new schedule.RecurrenceRule(); //set schedule of query
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.minute = [new schedule.Range(0, 59, 3)];
 
 


    sql.on('error', err => {
        console.log()
    })


var j = schedule.scheduleJob(rule, async function(){ //execute query
        const date = new Date()
    console.log(date + ': ' + '3 minute timer')
    const pool = new sql.ConnectionPool(config);
    const poolConnect = pool.connect();
    await poolConnect;
    sendJackpotQuery(pool, date);
});


async function sendJackpotQuery(pool, date) {
    const transaction = new sql.Transaction(pool)

        transaction.begin(err => {
            if (err) {
                console.log(date + ': ' + 'there was an error with transaction:')
                console.log(err)
            } else {
                const request = new sql.Request(transaction)
                request.query(jackpotQuery, (err, result) => {
                    if (err) {
                        console.log(date + ': ' + 'there was an error querying:')
                        console.log(err)
                    } else {
                        if (result.recordset.length > 0) {
                            console.log(date + ': ' + JSON.stringify(result.recordsets));
                            sendPlayCommand()
                            pool.close()
                            return
                        } else if (result.recordset.length == 0) {
                            console.log(date + ': ' + 'there were no results')
                            pool.close()
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




function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

let tracks = [
'1000jackpotmomentsago', 
'1000jackpotwaytogo', 
'1000Trigger', 
'1000Trigger2', 
'GenericTrigger', 
'jackpotmaybenextgeneric', 
'prettyawesomejackpotgeneric', 
'somebodywon1000jackpotgeneric'
];


function sendPlayCommand() {
    let date = new Date()
    axios({
        method: 'get',
        url: 'http://10.160.27.80:9000/rest/control?cmd=' + tracks[getRandomInt(tracks.length)],
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
        let playCommand = sendPlayCommand()
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
