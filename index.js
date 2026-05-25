import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js"
import rateLimit from "express-rate-limit"


dotenv.config();
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: { success: false, message: "Muitas requisições, tente novamente em breve." }
});

app.use("/api", limiter);
app.use("/", routes);

app.listen(3000, () => console.log("Server running on port 3000"));