// // Make a GET request to the server when the page loads
window.onload = () => {

    const readline = require('readline');
    const fs = require('fs');
    // Define the path to your JSONL file
    const jsonlFilePath = 'example-document.jsonl';
    // Create a readline interface to read the file line by line
    const rl = readline.createInterface({
        input: fs.createReadStream(jsonlFilePath),
        crlfDelay: Infinity // Recognize all line terminators
    });
    // Function to send a POST request for each line (JSON object)
    rl.on('line', (line) => {
        // Make a POST request using the JSON object from the line
        fetch('http://127.0.0.1:8080/document/v1/mynamespace/my_content/docid/example-document-id2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: line, // Send the line as the request body
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
    });
    // Handle errors
    rl.on('error', (err) => {
        console.error('Error:', err);
    });
    // Handle end of file
    rl.on('close', () => {
        console.log('End of file');
    });
    
//     // fetch('/api/message')
//     //     .then(response => response.json())
//     //     .then(data => {
//     //         // Update the message paragraph with the response from the server
//     //         document.getElementById('message').textContent = data.message;
//     //     })
//     //     .catch(error => {
//     //         console.error('Error fetching message:', error);
//     //     });

//     // Load the JSON file
//     fetch('example-document.json')
//     .then(response => {
//         console.log(response);
//         console.log("here");
//         if (!response.ok) {
//             throw new Error('Failed to load JSON file');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Make the POST request using the fetched JSON data
//         fetch('http://127.0.0.1:8080/document/v1/mynamespace/my_content/docid/example-document-id', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data),
//             mode: 'no-cors' // Use the fetched JSON data as the request body
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(responseData => {
//             console.log('Success:', responseData);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
};