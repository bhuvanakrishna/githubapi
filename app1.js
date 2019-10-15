//to get fetch api in node
const fetch = require("node-fetch");
//setting global headers to fetch headers
global.Headers = fetch.Headers;
//file system module
const fs = require('fs');
//moment module for working with dates
const moment = require('moment');
//base-64 module to encode username and passoword
let base64 = require('base-64');

//asigning todays's date and time to the variable today
let today = moment();




//username of the repository. Change this
let user = 'godotengine';
//name of the repo
let repo = 'godot'

//api results limit
const limitPerPage = 20;

const apiUrl = `https://api.github.com/repos/${user}/${repo}/pulls?state=all`;

//give your github username and password
let username = 'bhuvanakrishna';
let password = 'Bhuvanakrishna123$';


//asynchronous function to get pulls from the page given as argument
const getPulls = async function (pageNo = 1) {

    let actualUrl = apiUrl + `&page=${pageNo}&limit=${limitPerPage}`;
    //here the fetch method returns a promise(think as response) which is handled by .then. In .then we are converting response into json. Here return resp.json() returns another promise. Had we not used await, we should again handle the promise by writing a second .then. So to avoid multiple .then handling we are using new feature in JS which is called async-await. The function needs to be a async function to use await. That's the reason we are using keyword async before the function above.
    //.then runs ONLY after it gets a promise from the fetch
    var apiResults = await fetch(actualUrl, {
        headers: new Headers({
            'Authorization': 'Basic ' + base64.encode(username + ":" + password)
        })
    })
        .then(resp => {
            let respo = resp.json();
            // console.log(respo);
            return respo;
        });

    //we are returning the apiresults of the pageNo which is sent as argument
    return apiResults;

}



const getAllPulls = async function (pageNo = 1) {

    const results = await getPulls(pageNo);

    console.log("Retreiving data from API for page : " + pageNo);

    //we are incrementing the page number and calling this function recursively until there is a result. Finally the results variable will have all the pull requests from all the pages available.
    if (results.length > 0) {
        return results.concat(await getAllPulls(pageNo + 1));
    } else {
        return results;
    }
};

//wrapping a function in paranthesis is called IIFE or Immediately Invoked Function Expression. Basically, it is written to execute the function as soon as it is defined and not wait until we call it. Note that this is an anonymous async function.
(async () => {


    const entireList = await getAllPulls();

    console.log('Total no. of Pull requests on the given repository: ', entireList.length);

    let filteredList = [];
    let urls = [];

    for (let i = 0; i < entireList.length; i++) {
        //today.diff is a method from the moment module. This syntax is simply saying we want only the pulls from last 30 days. Each element(which is a object in this case) in the entirelist array has a key - created_at which has date on which the pull request is created. See the JSON from the API for better understanding.
        if (today.diff(entireList[i].created_at, 'days') <= 30) {
            filteredList.push(entireList[i]);
            //we are pushing the urls of each pull request into variable urls. This is used in the second program where we need to retrive review comments for each pull request.
            urls.push(entireList[i].url);
        }

    }

    //No. of pull requests in last 30 days
    console.log('Pull requests in last 30 days: ', filteredList.length);


    //writing pulls in the last 30 days to a text file
    fs.writeFile('pullslast30days.txt', JSON.stringify(filteredList, null, 4), 'utf8', function (err) {

        if (err) console.log('error', err);
    });
    //writing urls of each pull request in a separate file
    fs.writeFile('urls.txt', JSON.stringify(urls, null, 4), 'utf8', function (err) {

        if (err) console.log('error', err);
    });

})();
