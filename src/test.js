const fetch = require("node-fetch");

global.Headers = fetch.Headers;

const fs = require("fs");

const moment = require("moment");

let base64 = require("base-64");

const express = require("express");
const app = express();

const path = require("path");

let today = moment();

// let user = "polynote";

// let repo = "polynote";

// const limitPerPage = 20;

// const openPullsUrl = `https://api.github.com/repos/${user}/${repo}/pulls?state=open`;
// const closedPullsUrl = `https://api.github.com/repos/${user}/${repo}/pulls?state=closed`;
// const allPullsUrl = `https://api.github.com/repos/${user}/${repo}/pulls?state=all`;

let username = "bhuvanakrishna";
let password = "Bhuvanakrishna123$";

let finalArray = [];
let length = 0;

async function getPulls(url, page = 1) {
  let actualUrl = url + `&page=${page}`;
  const response = await fetch(actualUrl, {
    headers: new Headers({
      Authorization: "Basic " + base64.encode(username + ":" + password)
    })
  });
  const myJson = await response.json();
  // console.log(myJson);
  return myJson;
  // let length = myJson.length;
  // console.log(myJson.length);
}

async function getAllPulls(type, days, owner, repo) {
  let url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=${type}`;

  let pullArray = await getPulls(url, 1);
  // length = pullArray.length;
  let page = 1;

  // console.log(pullArray.length);
  // console.log("inside getallpulls", pullArray);

  while (pullArray.length > 0) {
    for (let i = 0; i < pullArray.length; i++) {
      if (today.diff(pullArray[i].created_at, "days") <= days) {
        finalArray.push(pullArray[i]);
        length += 1;
      }
    }

    pullArray = await getPulls(url, page + 1);
    page++;
    // length = length + pullArray.length;
  }
  // console.log(length);

  let newarray = [...finalArray];

  // console.log("array: ", newarray);

  const obj = {
    length: length,
    array: newarray
  };
  // console.log("array: ", obj.array);

  return obj;
}

const pathname = path.join(__dirname, "../public");
console.log(pathname);
app.use(express.static(pathname));

app.get("/pull", async (req, res) => {
  let type = req.query.type;
  let days = req.query.days;
  let owner = req.query.owner;
  let repo = req.query.repo;

  length = 0;
  finalArray = [];

  // console.log(type, days, owner, repo);

  await getAllPulls(type, days, owner, repo).then(obj => {
    // console.log("inside get ", obj);
    let length = obj.length;
    let arr = obj.array;
    // let arr = obj.array;
    res.send({
      length,
      arr
    });
  });
});

const server = app.listen(3000, () => {
  console.log("server started!!");
});

server.timeout = 240000;
