import { tweetsData as initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// Load tweetsData / userTweets from localStorage, or use an empty array if no data is found
let tweetsData = initialTweetsData
let userTweets = JSON.parse(localStorage.getItem('userTweets')) || []
console.log(tweetsData)

console.log(userTweets)


const tweetInputArea = document.getElementById('tweet-input')
const tweetButton = document.getElementById('tweet-btn')
const draftQ = document.getElementById('draft-prompt')

//Below lies click event listeners on the whole document. 
document.addEventListener('click', function(e){
    const { like, retweet, reply } = e.target.dataset
    // If the click target has a 'data-like' attribute, handle like click
    if(like){
       handleLikeClick(like) 
    }
    else if(retweet){
        handleRetweetClick(retweet)
    }
    else if(reply){
        handleReplyClick(reply)
    }
    // If the click target has an id 'tweet-btn', handle tweet button click
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } 
    // We could also use e.target.classList.contains('reply-btn'):  If click target contains the 'reply-btn' class, handle reply button click 
    else if(e.target.dataset.tweetId) {  
        replyTweet(e.target.dataset.tweetId);

    } else if(e.target.dataset.delete) {
        document.getElementById(`delete-tweet-${e.target.dataset.delete}`).classList.toggle('hidden');
        e.stopPropagation();
        deleteTweet(e.target.dataset.delete)

    } else if (e.target.classList.contains('delete-tweet')) {
        const tweetId = e.target.dataset.tweetId;
        deleteTweet(tweetId); 
 
    } else if (e.target.classList.contains('profile-user')) {
        loadHTMLProfile()
    }
    else if (e.target.id === 'nav-btn'){
        document.getElementById('overlay').classList.toggle('hidden')
        document.getElementById('tweet-input-area').classList.toggle('show')

    } else if(e.target.id === 'cancel-btn') {
        handleCancelBtn()

    } else if(e.target.id === 'discard-btn') {
        draftQ.classList.remove('show')
        tweetInputArea.value = ''
        charCount()
        closeTweetModal()
 
    } else if(e.target.id === 'cancel-draft-btn') {
        draftQ.classList.remove('show') 
    } 
    else if (!e.target.closest('#tweet-input-area') && e.target.id !== 'nav-btn') {
        closeTweetModal()
    } 
})

document.querySelectorAll('.discover-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        switchToDiscover()
    })
})

document.querySelectorAll('.following-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        switchToFollowing()
    })
})

tweetInputArea.addEventListener('keyup', charCount)


function switchToDiscover() {
    document.querySelectorAll('.discover-tab').forEach(el => el.classList.add('active'))
    document.querySelectorAll('.following-tab').forEach(el => el.classList.remove('active'))
    document.getElementById('discover').classList.remove('hidden')
    document.getElementById('following').classList.add('hidden')

}

function switchToFollowing() {
    document.querySelectorAll('.following-tab').forEach(el => el.classList.add('active'))
    document.querySelectorAll('.discover-tab').forEach(el => el.classList.remove('active'))
    document.getElementById('following').classList.remove('hidden')
    document.getElementById('discover').classList.add('hidden')

}
function charCount() {
    const innerCircle = document.getElementById('inner-circle')
    const progressValue = document.getElementById('counter')

    const maxChars = 300;

    //Count characters and calculate remaining chars
    const numChars = tweetInputArea.value.length

    if (numChars == 0) {
        tweetButton.disabled = true
        tweetButton.classList.add('disabled-utility')
     

    } else {
        tweetButton.disabled = false
        tweetButton.classList.remove('disabled-utility')

    }

    const remainingChars = maxChars - numChars

    //Use charCount to update counter text and colour
    const counterColour = remainingChars < 50 ? 'crimson' : 'whitesmoke'
    progressValue.textContent = `${remainingChars}`
    progressValue.style.color = counterColour

    const angle = (numChars / maxChars) * 360 

    innerCircle.style.background = `conic-gradient(#0F8CDF ${angle}deg, rgba(22,30,39,1) ${angle}deg)`

    return numChars

}
 
function bottomNav() {
    const navItems =  document.getElementsByClassName('nav-item')

    for (const currItem of navItems) {
        currItem.addEventListener('click', function() {
            for (const prevItem of navItems) {
                prevItem.classList.remove('active')
            }
            currItem.classList.add('active')

        } )

    }
}
bottomNav()

function handleCancelBtn() {
    const numChars = tweetInputArea.value.length

    if (numChars === 0) {
        closeTweetModal()
    } 
    else 
    {
        draftQ.classList.add('show')
    }

}

function closeTweetModal() {
    document.getElementById('overlay').classList.add('hidden')
    document.getElementById('tweet-input-area').classList.remove('show') 

}

function loadHTMLProfile() {
    const centerFeed = document.getElementById('center-feed')

    setTimeout(() => {
        fetch('userprofile.html').
        then(res => res.text()).
        then(data => centerFeed.innerHTML = data)
    }, 1000)
    
    
}

function deleteTweet(tweetId) {
    // Find the index and array containing the tweet
    const tweetIndexInUserTweets = userTweets.findIndex(tweet => tweet.uuid === tweetId)
    const tweetIndexInTweetsData = tweetsData.findIndex(tweet => tweet.uuid === tweetId)

    let tweetIndex = -1
    let tweetArr = null

    //Determine which array the tweet is in
    if (tweetIndexInUserTweets !== -1) {
        tweetIndex = tweetIndexInUserTweets
        tweetArr = userTweets
    } else if (tweetIndexInTweetsData !== -1) {
        tweetIndex = tweetIndexInTweetsData
        tweetArr = tweetsData
    }

    //Remove the tweet if found
    if (tweetArr && tweetIndex !== -1) {
        tweetArr.splice(tweetIndex, 1)

        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
        localStorage.setItem('userTweets', JSON.stringify(userTweets))

        render()
    } 
}

function handleLikeClick(tweetId) { 
    // Find the tweet by its UUID
    const targetTweetObj = findTweetObj(userTweets, tweetId) || findTweetObj(tweetsData, tweetId)

    if (targetTweetObj) {
        if (targetTweetObj.isLiked) {
            targetTweetObj.likes--;
        } else {
            targetTweetObj.likes++;
        }
        targetTweetObj.isLiked = !targetTweetObj.isLiked;
    }

    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    localStorage.setItem('userTweets', JSON.stringify(userTweets))
    render();
}


function handleRetweetClick(tweetId){
    // Find the tweet by its UUID
    const targetTweetObj = findTweetObj(userTweets, tweetId) || findTweetObj(tweetsData, tweetId)
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    localStorage.setItem('userTweets', JSON.stringify(userTweets))
    render() 

}


function handleReplyClick(tweetId) {
    // Toggle visibility of the reply input and replies
    const repliesContainer = document.getElementById(`replies-${tweetId}`)
    const replyInputContainer = document.getElementById(`reply-input-${tweetId}`)
    const replyInput = document.getElementById(`reply-text-${tweetId}`)
    const replyBtn = document.getElementById('reply-button')

    repliesContainer.classList.add('replies-container');
    replyInputContainer.classList.add('reply-input-container');

    repliesContainer.classList.toggle('hidden')
    replyInputContainer.classList.toggle('hidden')

    replyBtn.classList.toggle('hidden')
}

function replyTweet(tweetId) {
    const replyInput = document.getElementById(`reply-text-${tweetId}`)

    // Find the tweet by its UUID
    let userD = findTweetObj(userTweets, tweetId)
    let dataD = findTweetObj(tweetsData, tweetId)

    const replyData = {
        handle: `@Scrimba`,  
        profilePic: `images/scrimbalogo.png`,
        tweetText: replyInput.value,
        isLiked: false,
        isRetweeted: false,
        retweets: 0,
        likes: 0,
        uuid: uuidv4()  
    }

    if (replyInput.value) {
        if (userD) {
            userD.replies.push(replyData)

        } else if (dataD) {
            dataD.replies.push(replyData)
    }
        
        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
        localStorage.setItem('userTweets', JSON.stringify(userTweets))

        render()
        replyInput.value = '' 
    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        const newTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
            userId: "scrim1232"

        }
        
    //Add new tweet to userTweets array + Save to localStorage
    userTweets.unshift(newTweet)
    localStorage.setItem('userTweets', JSON.stringify(userTweets))

    closeTweetModal()
    setTimeout(1000)


    switchToFollowing()
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(feedArr) {
    let feedHtml = ``;

    feedArr.forEach(function (tweet) {
        let likeIconClass = tweet.isLiked ? 'liked' : '';
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';

        let repliesHtml = '';

        // Safely process replies
        if (Array.isArray(tweet.replies) && tweet.replies.length > 0) {

            tweet.replies.forEach(function (reply) {
                let likeIconReply = reply.isLiked ? 'liked' : '';
                let retweetIconReply = reply.isRetweeted ? 'retweeted' : '';
                repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                            <div class="reply-details">
                                <span class="reply-detail">
                                    <i class="fa-regular fa-comment-dots"
                                    data-reply="${reply.uuid}"
                                    ></i>
                                    ${reply.replies?.length || 0}
                                </span>
                                <span class="reply-detail">
                                    <i class="fa-solid fa-heart ${likeIconReply}"
                                    data-like="${reply.uuid}"
                                    ></i>
                                    ${reply.likes || 0}
                                </span>
                                <span class="reply-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconReply}"
                                        data-retweet="${reply.uuid}" 
                                    ></i>
                                    ${reply.retweets || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        const loggedInUserId = "scrim1232";
        const showDeleteOption = tweet.userId === loggedInUserId;

        // Safely process main tweet
        feedHtml += `
            <div class="tweet" id="tweet-id-${tweet.uuid}">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${Array.isArray(tweet.replies) ? tweet.replies.length : 0}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes || 0}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                    data-retweet="${tweet.uuid}" 
                                ></i>
                                ${tweet.retweets || 0}
                            </span>
                            <span class="more-options">
                                <i class="fa-solid fa-ellipsis"
                                    data-delete="${tweet.uuid}"
                                ></i>
                                ${showDeleteOption
                                    ? `<span class="delete-tweet hidden" id="delete-tweet-${tweet.uuid}" data-tweet-id="${tweet.uuid}">
                                        Delete Tweet
                                    </span>`
                                    : `<span class="delete-tweet hidden" id="delete-tweet-${tweet.uuid}" data-tweet-id="${tweet.uuid}">
                                        Not Interested
                                    </span>`}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="whole-reply hidden" id="reply-input-${tweet.uuid}">
                    <h1>Replying to ${tweet.handle}</h1>
                    <textarea id="reply-text-${tweet.uuid}" placeholder="Write a reply..."></textarea>
                    <div class="icon-set" id="icon-set">
                        <i class="fas fa-image"></i>
                        <i class="fa-solid fa-film"></i>
                        <i class="fa-solid fa-file"></i>
                        <i class="fa-solid fa-face-smile"></i>
                    </div>
                    <button class="reply-btn" data-tweet-id="${tweet.uuid}">Reply</button>
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
            </div>
        `;
    });

    return feedHtml;
}


// Used to render the feed by inserting the generated HTML into the page
function render(){
    
    document.getElementById('feed-following').innerHTML = getFeedHtml(userTweets)
    document.getElementById('feed').innerHTML = getFeedHtml(tweetsData)
}

//helper function 
function findTweetObj(data, id) {
    let targetObj = data.find(function(tweet){
        return tweet.uuid === id
    })


    if (!targetObj) {
        // Search for the tweet in the replies
        data.forEach(tweet => {
            const reply = tweet.replies.find(r => r.uuid === id);
            if (reply) {
                targetObj = reply;
            }
        });
    }

    return targetObj
}



// document.getElementById('back-header').innerHTML = `${userTweets.length} Posts`


// Initial call to display initial feed
render()



