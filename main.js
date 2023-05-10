require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsConfig = require("./config/cors.config");

const app = express();
const PORT = process.env.PORT;
const API_BASE_PATH = process.env.API_BASE_PATH;

const {errorHandler, errorLogger} = require("./middleware/error.middleware");

// const authRouter = require("./routes/auth.routes");
const userRouter = require("./userService/router");
// const assetsRouter = require("./routes/asset.routes");
// const productRouter = require("./routes/asset.routes");
// const orderRouter = require("./routes/asset.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsConfig));

/** isolated Routers with Route controllers */
// app.use("/auth", authRouter);
app.use(`${API_BASE_PATH}/user`, userRouter);
// app.use("/assets", assetsRouter);
// app.use("/order", orderRouter);
// app.use("/product", productRouter);


/** error handling middleware */
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server has started on port:  ${PORT}`))