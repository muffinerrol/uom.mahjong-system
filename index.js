const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

const checkRouter = require("./routes/check");
app.use("/check", checkRouter);

const leaderboardRouter = require("./routes/leaderboard");
app.use("/leaderboard", leaderboardRouter);

app.listen(3000);
console.log("listening at port 3000");