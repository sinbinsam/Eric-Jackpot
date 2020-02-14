const   sql         = require('mssql'),
        express     = require('express'),
        schedule    = require('node-schedule'),
        axios       = require('axios'),
        path        = require('path'),
        config      = require(path.join(__dirname, './sql.json')),
        app         = express();

app.use(express);

if (!config) {
    console.log('config file not found, please create sql.json in root directory with these credentials:')
    console.log('user, password, server, database')
}


const jackpotQuery = "\
SELECT top 4\
CONVERT(money, (PenniesWon / 100.0))AS 'WinInDollars',gamename\
FROM floorz.play with (nolock)\
    where PlayerID is not null\
        and isJackpotwin = 1\
        and pennieswon >=100000\
        and InsertedDatetime > DATEADD(minute, -3, getdate())\
        ;\
"

//schedule query

var rule = new schedule.RecurrenceRule(); //set schedule of query
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.second = [new schedule.Range(0, 59, 5)];
 
var j = schedule.scheduleJob(rule, function(){ //execute query
  console.log('sending query');
  //sendJackpotQuery();
});


function sendJackpotQuery() {
    sql.on('error', err => {
        console.log('SQL error:' + err);
    })
    
    sql.connect(config).then(pool => {
        // Query
        
        return pool.request()
            .query(jackpotQuery);
    }).then(result => {
        console.dir(result);
    }).catch(err => {
    console.log(err);
    });
}



function sendPlayCommand(cmd) {
    axios({
        method: 'get',
        url: '/rest/control',
        data: {
          cmd: cmd
        }
      })
      .then((res) => {
          if (res.status == 200) {
              return "success"
          } else {
              return "failure"
          }
      })
      return true
}

  
    
  
    app.get('/eric', (req, res) => {
        if (sendPlayCommand('TEST FILE NAME HERE') == "success") {
            res.send('sent test command');
        } else {
            res.send("there was a problem, the device didn't respond")
        }
      
    })
  

    app.listen(9090, function() {
      console.log('Example app listening on port 9090!');
    });
