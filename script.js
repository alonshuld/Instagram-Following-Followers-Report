function compareInstagram() {
    const followersFile = document.getElementById('followers').files[0];
    const followingFile = document.getElementById('following').files[0];
    const results = document.getElementById('results');

    if (!followersFile || !followingFile) {
        results.textContent = 'Please select both HTML files.';
        return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(event) {
        const followersHTML = event.target.result;
        reader2.onload = function(event) {
            const followingHTML = event.target.result;
            const followers = extractUsernames(followersHTML);
            const following = extractUsernames(followingHTML);
            displayDifferences(followers, following);
        };
        reader2.readAsText(followingFile);
    };
    reader1.readAsText(followersFile);
}

function extractUsernames(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');
    const usernames = new Set();

    links.forEach(link => {
        const url = link.href;
        // Extract username from URL if it follows the pattern "https://www.instagram.com/username"
        if (url.includes('https://www.instagram.com/')) {
            const username = url.split('https://www.instagram.com/')[1].replace('/', '');
            usernames.add(username.trim());
        }
    });

    return usernames;
}

function displayDifferences(followers, following) {
    const notFollowingBack = [...following].filter(user => !followers.has(user));
    const notFollowedBack = [...followers].filter(user => !following.has(user));
    const results = document.getElementById('results');

    let output = '<h2>Results:</h2>'
    output += '<h3>People you follow but who do not follow you back:</h3>';
    output += notFollowingBack.length ? createLinksList(notFollowingBack) : '<p>None</p>';
    output += '<h3>People who follow you but you do not follow back:</h3>';
    output += notFollowedBack.length ? createLinksList(notFollowedBack) : '<p>None</p>';

    results.innerHTML = output;
}

function createLinksList(usernames) {
    return `<ul>${usernames.map(username => 
        `<li><a href="https://www.instagram.com/${username}" target="_blank">${username}</a></li>`).join('')}</ul>`;
}
