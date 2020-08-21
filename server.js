// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const nunjucks = require('nunjucks');

const base = require('airtable').base('appNVBAeki7fUsmWn');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.set('view engine', 'html');

const tableNames = [
  'Sports',
  'Genres',
  'Settings',
  'Perspective',
  'Time period',
  'Players',
  'Realtime',
  'Games',
  'Activities',
  'Adjectives'
];

const tables = {}

let index = 0;

const getTable = function(index){
  let tableName = tableNames[index];
  tables[tableName] = [];
  console.log("--------------------------");
  console.log("Table: " + tableName);
  base(tableName).select().eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
          const name = record.get('Name');
          if (name != undefined){
            console.log('Record: ' + name);
            tables[tableName].push(name);
          }
      });

      fetchNextPage();

  }, function done(err) {
      if (err) { console.error(err); return; }
      if (index < tableNames.length - 1){
        index += 1
        getTable(index)
      } else {
        serve();
      }
  });
}

getTable(index)



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

const getRandom = function(tableName){
  const table = tables[tableName];
  console.log(table);
  const index = Math.round(Math.random()*(table.length-1));
  console.log(index);
  const value = table[index];
  console.log(value);
  return value;
}

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  let gameIdea = "A ";
  let adjective = getRandom('Adjectives');
  gameIdea += adjective;
  let players = getRandom('Players');
  gameIdea += " " + players;
  let genre = getRandom('Genres');
  gameIdea += " " + genre;
  gameIdea += " game set ";
  let setting = getRandom('Settings');
  gameIdea += " " + setting;
  response.render("index", {'gameIdea':gameIdea});
});

const serve = function(){
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });

}