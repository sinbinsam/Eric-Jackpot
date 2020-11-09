var promos = [
    {
        fileName: 'yes',
        timeLength: 10000,
        cron: '0/1 * * * *'
    },
    {
        fileName: 'no',
        timeLength: 10000,
        cron: '0/2 * * * *'
    }
];

var quietTimes = {
    startTime: '4:10 pm',
    endTime: '7:50 pm'
}

var tracks1000 = [
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
];

var tracks2500 = [
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
];

var tracks5000 = [
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
];

var tracks10000 = [
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
];

module.exports = {
    promos,
    quietTimes,
    tracks1000,
    tracks2500,
    tracks5000,
    tracks10000
}