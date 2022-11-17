const express = require('express');
const router = express.Router();
const sheetCommands = require(require.main.path + '/googlesheet.js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    const query = req.query;

    if (query.query) {

        const names = await sheetCommands.searchName(query.query);
        res.render('check', { names: names });

    } else if (query.name) {

        const nameSpace = query.name;
        const scoreData = await sheetCommands.fetchScore(nameSpace);
        res.render('check', { name: nameSpace, score: scoreData[0], rank: scoreData[1], playerno: scoreData[2] });
    
    } else {

        res.render('check');

    }
})

module.exports = router;