const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {

    if (err) {

        console.error("Adatbázis hiba:", err.message);

    } else {

        console.log("SQLite adatbázis csatlakoztatva");

    }

});



// USERS TÁBLA
db.run(`
    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT UNIQUE NOT NULL,

        password TEXT NOT NULL

    )
`);



// NOTES TÁBLA
db.run(`
    CREATE TABLE IF NOT EXISTS notes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title TEXT NOT NULL,

        content TEXT NOT NULL,

        user_id INTEGER NOT NULL

    )
`);

module.exports = db;