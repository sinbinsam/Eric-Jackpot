const   sql         = require('mssql'),
        express     = require('express'),
        schedule    = require('node-schedule'),
        fs          = require('fs')
        app         = express()

const config = {
    user: '',
    password: '',
    server: '',
    database: '',
}

sql.on('error', err => {
    console.log('error:' + err)
})
 
sql.connect(config).then(pool => {
    // Query
    
    return pool.request()
        .query("\
        select * from viewplayers with (nolock)\
        where acct = 7777\
        ")
}).then(result => {
    console.dir(result)
}).catch(err => {
  console.log(err)
});



/* jackpot query
        .query("\
        SELECT\
        CONVERT(money, (PenniesWon / 100.00))AS 'WinInDollars',gamename\
        FROM floorz.play with (nolock)\
        where PlayerID is not null\
        and isJackpotwin = 1\
        and pennieswon >= 100000\
        and InsertedDatetime > DATEADD(minute, -3, getdate())\
        ;\
        ")
*/