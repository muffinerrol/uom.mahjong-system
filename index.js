const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root : __dirname });
})

const checkRouter = require("./routes/check");
app.use("/check", checkRouter);

const leaderboardRouter = require("./routes/leaderboard");
app.use("/leaderboard", leaderboardRouter);

const renameRouter = require("./routes/rename");
app.use("/rename", renameRouter);

app.use((req, res, next) => {
    res.status(404).sendFile('views/404.html', { root : __dirname });
})

app.listen(port, () => console.log(`uom.Mahjong-system listening on port ${port}!`));