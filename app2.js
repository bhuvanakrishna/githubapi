const fetch = require("node-fetch");
//setting global headers to fetch headers
global.Headers = fetch.Headers;
//base-64 module to encode username and passoword
let base64 = require('base-64');
const fs = require('fs');
const moment = require('moment');
let today = moment();




let urls = JSON.parse(fs.readFileSync('urls.txt'));



//your git username and password. We need to set these with base64 encoding in the headers to authenticate our api request. Because github api has set limit of only 60 calls per hour for unauthenticated requests. So, if there are more than 60 pulls, the code fails. By using authenticated request(ie by providing our username and password) we can make 5000 api calls per hour. There is one more way of authenticating where we can a token from github.
let username = 'bhuvanakrishna';
let password = 'Bhuvanakrishna123$';

//The logic is similar to previous program. We have a function that takes a single url and fetches review comments json from the api
const getReviewComments = async function (url) {

    //adding 'comments' to each url(api request syntax)
    let actualUrl = `${url}/comments`;
    //here we are adding headers for our fetch request.
    var apiResults = await fetch(actualUrl, {
        headers: new Headers({
            'Authorization': 'Basic ' + base64.encode(username + ":" + password)
        })
    })
        //handling the promise(think as response) from the fetch
        .then(resp => {
            return resp.json();
        });

    let i = 0;
    while (i < apiResults.length) {
        i++;
    }
    console.log("No. of review comments for the pull request, ", url, ":", i);
    return apiResults;


}


const getAllComments = async function () {
    let comment = null;
    let comments = [];
    let i = 0;



    while (i < urls.length) {

        comment = await getReviewComments(urls[i]);


        //here we are pushing into the array comments only if there is a comment for a pull request. Comment variable would be -> [] if a particular pull request has no review comment. So, by checking length we are only copying the comments.
        if (comment.length > 0) {
            //console.log(comment);
            comments.push(comment);
        }
        i++;
    }


    return comments;


};




(async () => {

    const entireList = await getAllComments();


    fs.writeFile('comments.txt', JSON.stringify(entireList, null, 4), 'utf8', function (err) {

        if (err) console.log('error', err);
    });


})();
