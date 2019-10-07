const fetch = require("node-fetch");
const fs = require('fs');
const moment = require('moment');
let today = moment();


let user = 'vuejs';
let repo = 'vue-next'

const limitPerPage = 20;
const apiUrl = `https://api.github.com/repos/${user}/${repo}/pulls`;

const getPulls = async function (pageNo = 1) {

    let actualUrl = apiUrl + `?page=${pageNo}&limit=${limitPerPage}`;
    var apiResults = await fetch(actualUrl)
        .then(resp => {
            return resp.json();
        });

    return apiResults;

}

const getAllPulls = async function (pageNo = 1) {
    const results = await getPulls(pageNo);
    //console.log("Retreiving data from API for page : " + pageNo);
    if (results.length > 0) {
        return results.concat(await getAllPulls(pageNo + 1));
    } else {
        return results;
    }
};


(async () => {

    const entireList = await getAllPulls();

    console.log(entireList.length);

    let filteredList = [];
    let urls = [];
    //console.log(entireList);

    for (let i = 0; i < entireList.length; i++) {

        if (today.diff(entireList[i].created_at, 'days') <= 30) {
            filteredList.push(entireList[i]);
            urls.push(entireList[i].url);
        }

    }

    console.log(filteredList.length);

    fs.writeFile('pullslast30days.txt', JSON.stringify(filteredList, null, 4), 'utf8', function (err) {

        if (err) console.log('error', err);
    });

    fs.writeFile('urls.txt', JSON.stringify(urls, null, 4), 'utf8', function (err) {

        if (err) console.log('error', err);
    });

})();
