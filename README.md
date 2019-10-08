# githubapi
app1.js retrieves pull requests in the last 30 days from the given repository and puts them in a text file in JSON format. 
The urls of each pull request are put in a separate text file.
app2.js takes the urls from this text file as input and retrieves review comments for each of the pull request by making a separate api call for each pull request. The review comments JSON in put in another text file.

I have used ES8 async await syntax to avoid confusion in handling multiple promises, as converting the response from fetch into JSON creates another promise.
