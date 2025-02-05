const http = require("http");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const mongoURI = "mongodb://localhost:27017";
const dbName = "formDB";
const client = new MongoClient(mongoURI);

async function insertData(data) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("users");
        await collection.insertOne(data);
        return { message: "Form submitted successfully!" };
    } catch (error) {
        return { message: "Error submitting form", error };
    }
}

const server = http.createServer(async (req, res) => {
    if (req.method === "GET") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading page");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    } else if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const userData = JSON.parse(body);
            const response = await insertData(userData);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response));
        });
    }
});

server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});