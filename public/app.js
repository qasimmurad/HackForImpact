// Make a GET request to the server when the page loads
window.onload = () => {
    fetch('/api/message')
        .then(response => response.json())
        .then(data => {
            // Update the message paragraph with the response from the server
            document.getElementById('message').textContent = data.message;
        })
        .catch(error => {
            console.error('Error fetching message:', error);
        });
};