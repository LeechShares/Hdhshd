/*
::::::::::::::Endpoints:::::::::::::

>MANAGE USERS:
manage-uids?action={action}&uid={uid} 

action: add, delete 
uid: fb_uid

>SHOW COOKIES:
/krukis.txt 

>SHOW ALL USER DATA
/nukos.json
*/

const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const port = 3000;
const filename = 'nukos.json';
const filePath = path.join(__dirname, 'cookie', 'krukis.txt'); 
const fileHakdog = path.join(__dirname, 'cookie', 'hakdog.txt'); 
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Middleware for file upload
app.use(fileUpload());

// HTML form to upload JSON file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

// Endpoint to handle file upload
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e., "jsonFile") is used to retrieve the uploaded file
    const jsonFile = req.files.jsonFile;

    // Move the uploaded file to the specified directory
    jsonFile.mv(path.join(__dirname, 'uploads', 'krukis.json'), (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded and renamed successfully!');
    });
});

// POST route to handle form submission and update krukis.txt
app.post('/updateKrukisTxt', (req, res) => {
    const newContent = req.body.newContent;

    // Write the new content to krukis.txt
    fs.writeFile(filePath, newContent, 'utf8', err => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ message: 'Error updating krukis.txt' });
        }
        res.json({ message: 'Content updated successfully' });
    });
});

//  Exnd 
//para sa hakdogtubner
app.post('/updateHakdog', (req, res) => {
    const newContent = req.body.newContent;

    // Write the new content to krukis.txt
    fs.writeFile(fileHakdog, newContent, 'utf8', err => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ message: 'Error updating hakdog.txt' });
        }
        res.json({ message: 'Content updated successfully' });
    });
});
//3nd
function addUid(uid) {
    // Read the existing JSON file
    const jsonString = fs.readFileSync(filename, 'utf-8');

    // Decode JSON string to JavaScript object
    const data = JSON.parse(jsonString);

    // Check if UID already exists
    if (data.ChatWithAiOfficialUserIDs.includes(uid)) {
        return { message: `UID ${uid} is already registered.` };
    } else {
        // Add UID to the array
        data.ChatWithAiOfficialUserIDs.push(uid);

        // Encode object back to JSON and save to the file
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));

        return { message: `UID ${uid} has been successfully added.` };
    }
}

function deleteUid(uid) {
    // Read the existing JSON file
    const jsonString = fs.readFileSync(filename, 'utf-8');

    // Decode JSON string to JavaScript object
    const data = JSON.parse(jsonString);

    // Check if UID exists
    const key = data.ChatWithAiOfficialUserIDs.indexOf(uid);
    if (key !== -1) {
        // Remove UID from the array
        data.ChatWithAiOfficialUserIDs.splice(key, 1);

        // Encode object back to JSON and save to the file
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));

        return { message: `UID ${uid} has been successfully deleted.` };
    } else {
        return { message: `UID ${uid} not found.` };
    }
}
// Express route to fetch the content of nukos.json
// Express route to fetch the entire content of nukos.json
app.get('/nukos.json', (req, res) => {
    try {
        const jsonString = fs.readFileSync(filename, 'utf-8');
        res.json(JSON.parse(jsonString));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Express route for handling requests to add or delete UIDs
app.get('/manage-uids', (req, res) => {
    const action = req.query.action;
    const uid = req.query.uid;

    // Check for the 'action' and 'uid' parameters in the query string
    if (action && uid) {
        // Perform the specified action
        if (action === 'add') {
            res.json(addUid(uid));
        } else if (action === 'delete') {
            res.json(deleteUid(uid));
        } else {
            res.status(400).json({ message: 'Invalid action specified.' });
        }
    } else {
        res.status(400).json({ message: "Missing 'action' or 'uid' parameter in the URL." });
    }
});

// Express route for displaying all registered UIDs
app.get('/uids', (req, res) => {
    // Read the existing JSON file
    const jsonString = fs.readFileSync(filename, 'utf-8');

    // Decode JSON string to JavaScript object
    const data = JSON.parse(jsonString);

    // Send the list of UIDs as a response
    res.json({ message: 'List of registered UIDs', uids: data.ChatWithAiOfficialUserIDs });
});
//kru
// Express route to fetch the content of krukis.json
app.get('/krukis.json', (req, res) => {
    try {
        const krukisJsonString = fs.readFileSync(path.join(__dirname, 'uploads', 'krukis.json'), 'utf-8');
        res.json(JSON.parse(krukisJsonString));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 
//273
// Express route to fetch the content of krukis.txt
app.get('/krukis.txt', (req, res) => {
    try {
        const krukisTxtContent = fs.readFileSync(path.join(__dirname, 'cookie', 'krukis.txt'), 'utf-8');
        res.send(krukisTxtContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 

//sa hkdof
app.get('/hakdog.txt', (req, res) => {
    try {
        const HKContent = fs.readFileSync(path.join(__dirname, 'cookie', 'hakdog.txt'), 'utf-8');
        res.send(HKContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});  
// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});