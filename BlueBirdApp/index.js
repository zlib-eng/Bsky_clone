import { tweetsData as initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// Load tweetsData from localStorage, or use an empty array if no data is found
let tweetsData = JSON.parse(localStorage.getItem('tweetsData')) || initialTweetsData
console.log(tweetsData)
const tweetInputArea = document.getElementById('tweet-input')
const tweetButton = document.getElementById('tweet-btn')
const draftQ = document.getElementById('draft-prompt')

//Below lies click event listeners on the whole document. 
document.addEventListener('click', function(e){
    // If the click target has a 'data-like' attribute, handle like click
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
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
 
    } else if (e.target.id === 'discover-tab') {
        document.getElementById('discover-tab').classList.add('active')
        document.getElementById('following-tab').classList.remove('active')
        document.getElementsById('following').classList.toggle('hidden')


    } else if(e.target.id === 'following-tab') {
        document.getElementById('following-tab').classList.add('active')
        document.getElementById('discover-tab').classList.remove('active')
        document.getElementsById('discover').classList.toggle('hidden')

    } else if (e.target.id === 'nav-btn'){
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

tweetInputArea.addEventListener('keyup', charCount)

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
    // IF no text, CANCEL should close modal; 
    // ELSE, CANCEL should prompt the user with a modal asking them if they'd like to save to drafts or not 
    // AND THEN close modal. 

    
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


function deleteTweet(tweetId) {
    // Find the tweet object in tweetsData
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId);
    
    // Remove the tweet from the tweetsData array
    if (tweetIndex !== -1) {
        tweetsData.splice(tweetIndex, 1);
    }

    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    
    // Re-render the feed to reflect changes
    render();
   
}

function handleLikeClick(tweetId){ 
    //We find tweet object that matches the tweetId 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    // Toggle the 'isLiked' flag to switch the like state + call render() to so layout reflect changes made 
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

    render()
   
}

function handleRetweetClick(tweetId){
    //We find tweet object that matches the tweetId 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    // Toggle the 'isRetweeted' flag to switch the retweet state + call render() to so layout reflect changes made 
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    render() 

}

function handleReplyClick(tweetId) {
    // Toggle visibility of the reply input and replies
    const repliesContainer = document.getElementById(`replies-${tweetId}`)
    const replyInputContainer = document.getElementById(`reply-input-${tweetId}`)

    repliesContainer.classList.add('replies-container');
    replyInputContainer.classList.add('reply-input-container');

    repliesContainer.classList.toggle('hidden')
    replyInputContainer.classList.toggle('hidden')
}

function replyTweet(tweetId) {
    const replyInput = document.getElementById(`reply-text-${tweetId}`)

    // Find the tweet by its UUID
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (replyInput.value) {
        targetTweetObj.replies.push({
            handle: `@Scrimba`,  
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()  
        });

        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

        render(); 
        replyInput.value = '' 
       
    }
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
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
        })

    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    closeTweetModal()
    setTimeout(1000)
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = tweet.isLiked ? 'liked' : ''
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''
        
        let repliesHtml = ''
        // If the tweet has replies, loop through and generate HTML for each reply
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                `
            })
        } 
        
        const loggedInUserId = "scrim1232"
        const showDeleteOption = tweet.userId === loggedInUserId;
        // Build the main HTML for the tweet, including likes, retweets, and replies 
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
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                    data-retweet="${tweet.uuid}" 
                                ></i>
                                ${tweet.retweets}
                            </span>
                            <span class="more-options">
                                <i class="fa-solid fa-ellipsis"
                                    data-delete="${tweet.uuid}"
                                ></i>
                                ${showDeleteOption ? 
                                    `<span class="delete-tweet hidden" id="delete-tweet-${tweet.uuid}" data-tweet-id="${tweet.uuid}">
                                        Delete Tweet
                                    </span>`
                                    : `<span class="delete-tweet hidden" id="delete-tweet-${tweet.uuid}" data-tweet-id="${tweet.uuid}">
                                        Not Interested
                                    </span>`
                                }
                                
                         
                            </span>
                            
                        </div>
                    </div>
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
                
           
                <!-- New reply input area -->
                <div class="hidden" id="reply-input-${tweet.uuid}">
                    <textarea id="reply-text-${tweet.uuid}" placeholder="Write a reply..."></textarea>
                    <button class="reply-btn" data-tweet-id="${tweet.uuid}">Reply</button>
                </div>
            </div>
`

   })
   return feedHtml 
}

// Used to render the feed by inserting the generated HTML into the page
function render(){
    
    document.getElementById('feed-following').innerHTML = getFeedHtml()
    document.getElementById('feed').innerHTML = getFeedHtml()
}

// Initial call to display initial feed
render()

