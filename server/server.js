const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "nagyonTitkosKulcs";



// TOKEN ELLENŐRZÉS
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            error: "Nincs token"
        });

    }

    jwt.verify(token, SECRET_KEY, (err, user) => {

        if (err) {

            return res.status(403).json({
                error: "Érvénytelen token"
            });

        }

        req.user = user;

        next();

    });

}



// TESZT
app.get("/", (req, res) => {

    res.send("A szerver működik!");

});



// REGISZTRÁCIÓ
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            error: "Minden mező kötelező"
        });

    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `;

        db.run(sql, [username, hashedPassword], function(err) {

            if (err) {

                if (err.message.includes("UNIQUE")) {

                    return res.status(400).json({
                        error: "Ez a felhasználónév már foglalt"
                    });

                }

                return res.status(500).json({
                    error: "Szerver hiba"
                });

            }

            res.status(201).json({
                message: "Sikeres regisztráció"
            });

        });

    } catch (error) {

        res.status(500).json({
            error: "Szerver hiba"
        });

    }

});



// LOGIN
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            error: "Minden mező kötelező"
        });

    }

    const sql = `
        SELECT * FROM users
        WHERE username = ?
    `;

    db.get(sql, [username], async (err, user) => {

        if (err) {

            return res.status(500).json({
                error: "Szerver hiba"
            });

        }

        if (!user) {

            return res.status(401).json({
                error: "Nem létező felhasználó"
            });

        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {

            return res.status(401).json({
                error: "Hibás jelszó"
            });

        }

        const token = jwt.sign(

            {
                id: user.id,
                username: user.username
            },

            SECRET_KEY,

            {
                expiresIn: "1h"
            }

        );

        res.json({

            message: "Sikeres bejelentkezés",
            token

        });

    });

});



// JEGYZET LÉTREHOZÁSA
app.post("/notes", authenticateToken, (req, res) => {

    const { title, content } = req.body;

    const userId = req.user.id;

    if (!title || !content) {

        return res.status(400).json({
            error: "Minden mező kötelező"
        });

    }

    const sql = `
        INSERT INTO notes (title, content, user_id)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [title, content, userId], function(err) {

        if (err) {

            return res.status(500).json({
                error: "Szerver hiba"
            });

        }

        res.status(201).json({

            message: "Jegyzet létrehozva",
            id: this.lastID

        });

    });

});



// SAJÁT JEGYZETEK
app.get("/notes", authenticateToken, (req, res) => {

    const sql = `
        SELECT * FROM notes
        WHERE user_id = ?
    `;

    db.all(sql, [req.user.id], (err, rows) => {

        if (err) {

            return res.status(500).json({
                error: "Szerver hiba"
            });

        }

        res.json(rows);

    });

});



// JEGYZET TÖRLÉSE
app.delete("/notes/:id", authenticateToken, (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM notes
        WHERE id = ? AND user_id = ?
    `;

    db.run(sql, [id, req.user.id], function(err) {

        if (err) {

            return res.status(500).json({
                error: "Szerver hiba"
            });

        }

        res.json({
            message: "Jegyzet törölve"
        });

    });

});



// JEGYZET SZERKESZTÉSE
app.put("/notes/:id", authenticateToken, (req, res) => {

    const id = req.params.id;

    const { title, content } = req.body;

    if (!title || !content) {

        return res.status(400).json({
            error: "Minden mező kötelező"
        });

    }

    const sql = `
        UPDATE notes
        SET title = ?, content = ?
        WHERE id = ? AND user_id = ?
    `;

    db.run(sql, [title, content, id, req.user.id], function(err) {

        if (err) {

            return res.status(500).json({
                error: "Szerver hiba"
            });

        }

        res.json({
            message: "Jegyzet frissítve"
        });

    });

});



// SZERVER INDÍTÁS
app.listen(3000, () => {

    console.log("Szerver fut a 3000-es porton");

});