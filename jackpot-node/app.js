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
 
var j = schedule.scheduleJob(rule, function(){ //execute query
    console.log('3 minute timer')
    sendJackpotQuery();
});


function sendJackpotQuery() {
    sql.on('error', err => {
        console.log('SQL error:' + err);
    })
    
    sql.connect(config).then(pool => {
        // Query
        
        return pool.request()
            .query(jackpotQuery);
    })
    .then(result => {
        console.log('response recieved')
        if (result.recordset.length > 0) {
            console.log('we got results!: ')
            console.log(result.recordsets);
            sendPlayCommand()
        } else if (result.recordset.length == 0) {
            console.log('there were no results')
        }
    })
    .catch(err => {
    console.log(err);
    });
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
    axios({
        method: 'get',
        url: 'http://10.160.27.80:9000/rest/control?cmd=' + tracks[getRandomInt(tracks.length)],
      })
      .then((res) => {
          console.log(res.status)
          if (res.status === 200) {
              return true
          } else {
              return false
          }
      })
      return true
}

    app.get('/eric', (req, res) => {
        let playCommand = sendPlayCommand()
        console.log(playCommand)
        if (playCommand == true) {
            res.send('sent test command');
        } else {
            res.send("there was a problem, the device didn't respond")
        }
      
    })
  
    app.listen(port, (err) => {
        if (err) {
            console.log('there was an error starting the server')
            console.log(err)
            } else {
                console.log('Server started! V2 At http://localhost:' + port);
            }
    });
