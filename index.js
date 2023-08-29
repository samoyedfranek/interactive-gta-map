const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files (your HTML and client-side scripts)
app.use(express.static("public"));

// Define a dummy admin user for demonstration
const adminUser = {
    password: "admin",
};

// Dummy in-memory storage for polygons
let polygonsData = [];

// Save polygons to JSON file
app.post("/savePolygons", (req, res) => {
    // Implement password check before saving polygons
    const password = req.body.password;
    if (password === adminUser.password) {
        polygonsData = req.body.polygons;
        fs.writeFile("polygons.json", JSON.stringify(polygonsData), (err) => {
            if (err) {
                res.status(500).send("Error saving polygons");
            } else {
                res.send("Polygons saved successfully");
            }
        });
    } else {
        res.status(401).send("Invalid password");
    }
});

// Load polygons from JSON file
app.get("/loadPolygons", (req, res) => {
    fs.readFile("polygons.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error loading polygons");
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Check password validity
app.post("/checkPassword", (req, res) => {
    const password = req.body.password;
    if (password === adminUser.password) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});
app.post("/removePolygon", (req, res) => {
    const password = req.body.password;
    if (password === adminUser.password) {
        const latlngsToRemove = req.body.latlngs;
        polygonsData = polygonsData.filter(
            (polygon) => !areLatLngsEqual(polygon.latlngs, latlngsToRemove)
        );
        fs.writeFile("polygons.json", JSON.stringify(polygonsData), (err) => {
            if (err) {
                res.status(500).json({ message: "Error removing polygon" });
            } else {
                res.json({ message: "Polygon removed successfully" });
            }
        });
    } else {
        res.status(401).json({ message: "Invalid password" });
    }
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
