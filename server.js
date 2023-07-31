const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

const User = require("./models/User");

const port = process.env.PORT;

app.use(express.json());

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("\nConnected to the database...")) // En cas de succés
  .catch((error) => console.log(error)); // En cas d'erreur

// récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ajouter un nouvel utilisateur à la base de données
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const newUser = await User.create({ name, email, age });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// modifier un utilisateur par ID
app.put("/users/:id", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// supprimer un utilisateur par ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
