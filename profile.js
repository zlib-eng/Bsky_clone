
let userTweets = JSON.parse(localStorage.getItem('userTweets')) || []

document.getElementById('back-header').innerHTML = `${userTweets.length} Posts`

