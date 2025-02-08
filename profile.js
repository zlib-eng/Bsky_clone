import { getFeedHtml } from './index.js';

let userTweets = JSON.parse(localStorage.getItem('userTweets'))
let tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
let userReplies = JSON.parse(localStorage.getItem('userReplies')) 



document.getElementById('back-header').innerHTML = `${userTweets.length} Posts`


// Get references to profile elements
const userName = document.getElementById('user-name')
const bioHandle = document.getElementById('bio-Handle')
const bioText = document.getElementById('bioText')

// Get references to modal and form elements
const editProfileButton = document.getElementById('edit-profile')
const modal = document.getElementById('edit-profile-modal')
const profileForm = document.getElementById('profile-form')
const nameInput = document.getElementById('name')
const bioInput = document.getElementById('edit-bio')
const cancelButton = document.querySelector('.cancel-btn')


document.getElementById('header-image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            document.getElementById('header-image').src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

document.getElementById('profile-image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            document.getElementById('profile-image1').src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})
// Open the edit profile modal
editProfileButton.addEventListener('click', function () {
    modal.style.display = 'flex'

    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {}

    nameInput.value = profileData.name || ''
    bioInput.value = profileData.bio || ''
})

// Close the edit profile modal without saving
cancelButton.addEventListener('click', function () {
    modal.style.display = 'none'
})

// Save profile changes
profileForm.addEventListener('submit', function (event) {
    event.preventDefault()

    const updatedProfile = {
        name: nameInput.value,
        bio: bioInput.value,
        handle: bioHandle.textContent.replace('@', '') || 'zlib7328732'
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))

    userName.textContent = updatedProfile.name
    bioText.textContent = updatedProfile.bio

    modal.style.display = 'none'
})


// Only add the back button listener once
if (!document.getElementById('fa-arrow-left').hasListener) {
    document.getElementById('fa-arrow-left').addEventListener('click', backButton);
    document.getElementById('fa-arrow-left').hasListener = true; // Mark as listener added
}

function backButton() {
    window.location.href = 'index.html'; // Navigate back to the index page
}


document.querySelectorAll('.user-menu-item').forEach(tab => {
    tab.addEventListener('click', function () {
        switchTab.call(this, 'user-menu-item', 'show-')
    })
})


function switchTab(menuClass, contentPrefix) {
    //remove 'active' class from all menu items
    document.querySelectorAll(`.${menuClass}`).forEach(tab => tab.classList.remove('active'))

    //add 'active' class to clicked tab
    this.classList.add('active')

    //hide all content sections
    document.querySelectorAll(`div[class^="${contentPrefix}"]`).forEach(content => {
        content.classList.add('hidden')
    })

    //show the related content section
    const relatedContent = document.querySelector(`.show-${this.classList[1].split('-')[0]}`);
    if (relatedContent) {
        relatedContent.classList.remove('hidden')
    }
}


function showUserLikes() {
    const eachLikedTweet = document.getElementById('each-show-likes')

    const likedTweets = tweetsData.filter( tweet => {
        return tweet.isLiked
    })

    const newContent = getFeedHtml(likedTweets)
    // Add new content without removing existing content
    if (eachLikedTweet) {
        eachLikedTweet.insertAdjacentHTML('beforeend', newContent)
    } else {
        likedTweets.innerHTML = `
        <div class="no-posts-yet">
            <div class="no-posts-logo"></div>
            <p class="no-posts-text">No likes yet.</p>
        </div>
        
        `;
    }

}


function showUserTweets() {
    const eachShowTweet = document.getElementById('each-show-tweet')
    const newContent = getFeedHtml(userTweets)

    // Add new content without removing existing content
    if (eachShowTweet) {
        eachShowTweet.insertAdjacentHTML('beforeend', newContent)
    } else {
        eachShowTweet.innerHTML = `
        <div class="no-posts-yet">
            <div class="no-posts-logo"></div>
            <p class="no-posts-text">No tweets yet.</p>
        </div>
        
        `;
    }

}

function showUserReplies() {
    const eachReply = document.getElementById('each-show-replies')

    const newContent = getFeedHtml(userReplies)

    // Add new content without removing existing content
    if (eachReply) {
        eachReply.insertAdjacentHTML('beforeend', newContent)
    } else {
        eachReply.innerHTML = `
        <div class="no-posts-yet">
            <div class="no-posts-logo"></div>
            <p class="no-posts-text">No replies yet.</p>
        </div>
        
        `;
    }

}

function showUserMedia() {
    const eachMedia = document.getElementById('each-show-media')
    eachMedia.innerHTML = `
        <div class="no-posts-yet">
            <div class="no-posts-logo"></div>
            <p class="no-posts-text">No media yet.</p>
        </div>
        
        `;

    // const newContent = getFeedHtml(userMedia)

    // // Add new content without removing existing content
    // if (eachMedia) {
    //     eachMedia.insertAdjacentHTML('beforeend', newContent)
    // } else {
    //     eachMedia.innerHTML = '<div>No replies yet!</div>';
    // }

}

function showUserFeeds() {
    const eachFeeds = document.getElementById('each-show-feeds')
    eachFeeds.innerHTML = `
        <div class="no-posts-yet">
            <div class="no-posts-logo"></div>
            <p class="no-posts-text">No feeds yet.</p>
        </div>
        
        `;

    // const newContent = getFeedHtml(userFeeds)

    // // Add new content without removing existing content
    // if (eachFeeds) {
    //     eachFeeds.insertAdjacentHTML('beforeend', newContent)
    // } else {
    //     eachFeeds.innerHTML = '<div>No replies yet!</div>';
    // }

}




showUserTweets()
showUserLikes()
showUserReplies()
showUserMedia()
showUserFeeds()

