import { v4 as uuidv5 } from 'https://jspm.dev/uuid';

export const tweetsData = [   
    {
        handle: `@TrollBot66756542`,
        profilePic: `images/troll.jpg`,
        likes: 27,
        retweets: 10,
        tweetText: `Buy Bitcoin, ETH Make low low prices. 
            Guaranteed return on investment. HMU DMs open!!`,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: '4b161eee-c0f5-4545-9c4b-8562944223ee',
    },    
    {
        handle: `@Elon `,
        profilePic: `images/musk.png`, 
        likes: 6500,
        retweets: 234,
        tweetText: `I need volunteers for a one-way mission to Mars. No experience necessary`,
        replies: [
                {
                handle: `@TomCruise `,
                profilePic: `images/tcruise.png`,
                tweetText: `Yes! Sign me up! `,
                likes: 65,
                retweets: 4,
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv5(),
            },
                {
                handle: `@ChuckNorris `,
                profilePic: `images/chucknorris.jpeg`,
                tweetText: `I went last year`,
                likes: 60,
                retweets: 2,
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv5(),
            },
        ],
        isLiked: false,
        isRetweeted: false,
        uuid: '3c23454ee-c0f5-9g9g-9c4b-77835tgs2',
    },
    {
        handle: `@NoobCoder12`,
        profilePic: `images/flower.png`,
        likes: 10,
        retweets: 3,
        tweetText: `Are you a coder if you only know HTML?`,
        replies: [
            {
                handle: `@StackOverflower `,
                profilePic: `images/overflow.png`,
                tweetText: `No. Obviosuly not. Go get a job in McDonald's.`,
                likes: 500,
                retweets: 34,
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv5(),
            },
            {
                handle: `@YummyCoder64`,
                profilePic: `images/love.png`,
                tweetText: `You are wonderful just as you are!`,
                likes: 600,
                retweets: 24,
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv5(),
            },
        ],
        isLiked: false,
        isRetweeted: false,
        uuid: '8hy671sff-c0f5-4545-9c4b-1237gyys45',
    },

    
]