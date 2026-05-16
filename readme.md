# Saját Online Napló Alkalmazás

Ez az alkalmazás egy böngészőből használható online jegyzetkezelő rendszer.  
A felhasználók regisztrálhatnak, bejelentkezhetnek, majd saját jegyzeteket hozhatnak létre, módosíthatnak vagy törölhetnek.

A projekt frontend és backend részből áll, SQLite adatbázist használ, valamint JWT token alapú autentikációt valósít meg.

---

# Funkciók

## Felhasználó kezelés

- Regisztráció
- Bejelentkezés
- JWT alapú hitelesítés
- Kijelentkezés

## Jegyzet kezelés

- Jegyzet létrehozása
- Jegyzetek listázása
- Jegyzet szerkesztése
- Jegyzet törlése

---

# Használt technológiák

## Backend

- Node.js
- Express.js
- SQLite3
- bcrypt
- JSON Web Token (JWT)

## Frontend

- HTML5
- CSS3
- JavaScript

## Fejlesztői eszközök

- VS Code
- Git
- Thunder Client
- Jest

---

# Projekt struktúra

```text
online-naplo/
│
├── .env
├── .git
├── client/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── server/
│   ├── database.js
│   ├── server.js
│   ├── middleware/
│   └── routes/
│
├── sql/
│   └── init.sql
│
├── tests/
│   └── server.test.js
│
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

# Telepítés

## 1. Projekt megnyitása

Visual Studio Code-ban.

---

## 2. Függőségek telepítése

Terminálban futtasd:

```bash
npm install
```

A `node_modules` mappa automatikusan létrejön a telepítés során.


---

# Backend indítása

A backend futtatásához:

```bash
node server/server.js
```

Sikeres indítás esetén:

```text
Szerver fut a 3000-es porton
```

A backend alapértelmezett címe:

```text
http://localhost:3000
```

---

# Frontend indítása

A frontend futtatásához ajánlott a VS Code Live Server bővítmény.

---

# API végpontok

## Auth végpontok

### Regisztráció

```http
POST /register
```

### Bejelentkezés

```http
POST /login
```

---

## Jegyzet végpontok

### Jegyzetek lekérése

```http
GET /notes
```

### Új jegyzet létrehozása

```http
POST /notes
```

### Jegyzet szerkesztése

```http
PUT /notes/:id
```

### Jegyzet törlése

```http
DELETE /notes/:id
```

---

# Adatbázis

Az alkalmazás SQLite adatbázist használ.

Az adatbázis automatikusan létrejön az első indításkor.

---

## users tábla

| Oszlop   | Típus   |
|----------|----------|
| id       | INTEGER  |
| username | TEXT     |
| password | TEXT     |

---

## notes tábla

| Oszlop  | Típus   |
|---------|----------|
| id      | INTEGER  |
| title   | TEXT     |
| content | TEXT     |

---

# SQL inicializáló fájl

A projekt tartalmaz SQL scriptet az adatbázis táblák létrehozásához.

Fájl:

```text
sql/init.sql
```

---

# Tesztelés

Az alkalmazás Jest alapú automatizált teszteket tartalmaz.

## Tesztek futtatása

```bash
npm test
```

---

# Git és verziókezelés

A projekt Git verziókezelőt használ.

A fejlesztés során több commit készült különböző funkciók implementálásához.

---



A `node_modules` mappa automatikusan újratelepíthető az alábbi paranccsal:

```bash
npm install
```

---

# Biztonsági megoldások

Az alkalmazás az alábbi biztonsági technikákat használja:

- bcrypt alapú jelszó titkosítás
- JWT token alapú hitelesítés
- bemeneti adatok validálása
- HTTP státuszkód kezelés

---
