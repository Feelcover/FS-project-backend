import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postValidation
} from "./validations/validations.js";
import authMiddleware from "./utils/authMiddleware.js";
import { login, me, register } from "./controllers/UserController.js";
import { create, getAll, getOne } from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://pioneerbeat:Andrey@fs.h3wezc2.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error", err));
  
const app = express();

app.use(express.json());

// Выполнение авторизации
app.post("/auth/login", loginValidation, login);

// Выполнение регистрации
app.post("/auth/register", registerValidation, register);

// Запрос данных пользователя
app.get("/auth/me", authMiddleware, me);

// Выполнение создания статьи
app.post("/posts", authMiddleware, postValidation, create);

// Запрос всех статей
app.get("/posts", getAll);

// Запрос статьи
app.get("/posts/:id", getOne);

// // Выполнение удаления статьи
// app.get("/posts", remove);

// // Запрос обновления статьи
// app.get("/posts", update);


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
