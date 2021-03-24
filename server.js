let writeIcs = require('./ics').writeIcs;
const express = require('express');

let app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded());

app.listen(process.env.PORT || 1337, () => console.log('server is listening'));


app.post('/', (req, res) => {
  let { token, hocky } = req.body;
  console.log(token, hocky)
  if (token) {
    writeIcs(token, hocky)
      .then(() => {
        res.sendFile(__dirname + `/${token}.ics`)
      });
  }
})
