const express = require('express');
const router = express.Router();
const sheetCommands = require(require.main.path + '/googlesheet.js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
        const query = req.query;

        if (query.query) {

                const names = await sheetCommands.searchNameScoreless(query.query);
                res.render('rename', { names: names });
        
        } else {
        
                res.render('rename');
        
        }
})

router.post('/', async (req, res) => {
        const query = req.body;

        if (query.name) {

                const playerName = query.name;
                res.render('rename', { playerName: playerName });
        
        } else if (query.studentID) {
        
                const playerName = query.playerName;
                const databaseID = await sheetCommands.fetchID(playerName);
                const studentID = query.studentID;
                //console.log(playerName, databaseID);

                if (databaseID == studentID) {
                        res.render('rename', { loggedName: playerName });
                } else {
                        res.render('rename', { playerName: playerName, logged: false });
                }
        
        } else if (query.newName) {

                const loggedName = query.loggedName;
                const newName = query.newName.trim();
                //console.log(loggedName, newName)
                
                let response = await sheetCommands.updateName(loggedName, newName);
                if (response == "findError") {
                        console.log(`Find Error: Cannot find name for ${loggedName}`);
                        res.render('rename', { loggedName: loggedName });
                } else {
                        res.render('rename', { loggedName: newName });
                }

        }
})

module.exports = router;