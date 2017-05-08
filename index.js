var express = require('express'),
    request = require('request');

var app = express();

var recent = [];

app.get('/search', (req, res) => {
  var query = req.query.query;
  var startAt = req.query.start;
  if (!query) {
    res.send({
      'Error': 'Invalid search query'
    })
  } else if (startAt && (!/\d+/.test(startAt) || startAt == 0)) {
    res.send({
      'Error': 'Invalid search result offset'
    })
  } else {
    recent.push({
      term: req.query.query,
      when: (new Date()).toISOString()
    })
    request(
      `https://www.googleapis.com/customsearch/v1?
        q=${req.query.query}
        &cx=003424867538552154199%3Ae261evm8pvm
        &searchType=image
        ${req.query.start ? '&start=' + req.query.start : ''}
        &fields=items(displayLink%2CformattedUrl%2Cimage(contextLink%2CthumbnailLink)%2Clink%2Csnippet)
        &key=AIzaSyB-y0PJTWWMryONWN2UKYK7DtPFWWl2-EM`.replace(/\s/gmi, ''),
      function (error, response, body) {
        res.send(
          JSON.parse(body).items.map(
            item => ({
              url: item.link,
              snippet: item.snippet,
              thumbnail: item.image.thumbnailLink,
              context: item.image.contextLink
            })
          )
        );
      }
    )
  }
});

app.get('/recent', (req, res) => {
  res.send(recent);
})

app.listen(8080, () => {
  console.log('listening on 8080');
})
