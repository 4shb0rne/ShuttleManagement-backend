var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

const bodyParser = require("body-parser");
var usersRouter = require("./routes/users");
var scheduleRouter = require("./routes/schedule");
var individualRF = require("./routes/individualRF").router;
var groupRF = require("./routes/groupRF");
var email = require('./routes/email');
var attendance = require('./routes/attendance');
var specialdate = require('./routes/specialdate');
var dosen = require('./routes/dosen');


var app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use("/users", usersRouter);
app.use("/schedules", scheduleRouter);
app.use("/registration", individualRF);
app.use("/group-registration", groupRF);
app.use("/email", email);
app.use("/attendance", attendance);
app.use("/specialdate", specialdate);
app.use("/dosen", dosen);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
