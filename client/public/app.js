// Make a GET request to the server when the page loads
window.onload = () => {
    // fetch('/api/message')
    //     .then(response => response.json())
    //     .then(data => {
    //         // Update the message paragraph with the response from the server
    //         document.getElementById('message').textContent = data.message;
    //     })
    //     .catch(error => {
    //         console.error('Error fetching message:', error);
    //     });

    // Load the JSON file
    fetch('example-document.json')
    .then(response => {
        console.log(response);
        console.log("here");
        if (!response.ok) {
            throw new Error('Failed to load JSON file');
        }
        return response.json();
    })
    .then(data => {
        // Make the POST request using the fetched JSON data
        fetch('http://127.0.0.1:8080/document/v1/mynamespace/my_content/docid/example-document-id', {
            method: 'POST',
            headers: 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'no-cors' // Use the fetched JSON data as the request body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Success:', responseData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
};