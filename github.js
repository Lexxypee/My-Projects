async function findGitHubUser(username) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Searching...';

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        // Handle case when the user is not found (404 error)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }

        // Parse the response body as JSON
        const user = await response.json();

        // Make sure that we have the expected data
        if (!user || !user.login) {
            throw new Error('No user data available');
        }

        // Display the user details
        resultDiv.innerHTML = `
            <strong>User Found:</strong><br>
            <img src="${user.avatar_url}" alt="${user.login}" style="width: 100px; height: 100px; border-radius: 50%;"><br>
            Username: <a href="${user.html_url}" target="_blank">${user.login}</a><br>
            Name: ${user.name || 'N/A'}<br>
            Bio: ${user.bio || 'N/A'}<br>
            Public Repos: ${user.public_repos}<br>
            Followers: ${user.followers}<br>
            Following: ${user.following}<br>
        `;
    } catch (error) {
        // Display the error message to the user
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}

document.getElementById('userForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById('usernameInput').value.trim();

    // Only search if the username is not empty
    if (usernameInput) {
        findGitHubUser(usernameInput);
    } else {
        document.getElementById('result').innerHTML = '<span class="error">Please enter a username.</span>';
    }
});
