const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

const checkRouter = require("./routes/check");
app.use("/check", checkRouter);

const leaderboardRouter = require("./routes/leaderboard");
app.use("/leaderboard", leaderboardRouter);

app.listen(port, () => console.log(`uom.Mahjong-system listening on port ${port}!`));