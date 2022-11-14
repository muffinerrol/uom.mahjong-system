const express = require('express');
const router = express.Router();
const sheetCommands = require(require.main.path + '/googlesheet.js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
        const players = await sheetCommands.leaderboard();
        res.render('leaderboard', { players: players });
})

module.exports = router;