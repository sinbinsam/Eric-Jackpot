const jackpotQuery = "\
SELECT top 4\
CONVERT(money, (PenniesWon / 100.00))AS 'WinInDollars',gamename\
    FROM floorz.play  with (nolock)\
        where InsertedDatetime > DATEADD(minute, -3, getdate())\
            and PlayerID is not null\
            and isJackpotwin = 1\
            and pennieswon  >=100000\
            ;\
"



module.exports = {
    jackpotQuery
}