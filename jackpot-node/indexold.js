var express = require('express');
var app = express();
//var HtmlWidgetClass = require("@brightsign/htmlwidget");

function main() {
  process.chdir('/storage/sd');

  app.use(express.static('www'));

  app.get('/eric', (req, res) => {
    res.send('eric is the best');
  })

  app.get('/playvid', (req, res) => {
    //var htmlwidget = new HtmlWidgetClass({ rect:{x: 0, y:0, width: 640, height: 480 }, url: "https://brightsign.biz" });
    res.send('yes')
    let video = 'Audio_bands_Feed.mp4'
    video.play()
  })

  app.listen(9090, function() {
    console.log('Example app listening on port 9090!');
  });
}
window.main = main;
