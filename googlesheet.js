const {google} = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "config.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});
    
//create client instance for auth
const client = auth.getClient();
    
//create instance of sheets api
const sheets = google.sheets({version: "v4", auth: client});

//obtain the corresponding game sheet
const { sheet_Id } = require('./config.json');
const sheetId = sheet_Id;

//provides a filtered result of the name searched
exports.searchName = async function (name) {
    const searchTerm = name.toLowerCase();
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:B500"
    });

    let searchList = [];

    for (const row of playerScoreSheet.data.values) {
        if (row[1] && row[0].toLowerCase().includes(searchTerm)) {
            searchList.push([row[0]]);
        }
    };

    return searchList;
}

//using the submitted name to find their score
exports.fetchScore = async function (name) {
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:B500"
    });

    const playerData = playerScoreSheet.data.values.filter(item => item[1]);
    playerData.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    //console.log(playerData);

    let playerScore = ['', 1, playerData.length];

    for (let i = 0; i < playerData.length; i++) {

        //competitive ranking (1224)
        if (i != 0) {
            //console.log(i + " " + playerScore[1]);
            playerScore[1] = playerData[i][1] == playerData[i - 1][1] ? playerScore[1] : i + 1;
        };

        if (playerData[i][1] && playerData[i][0] == name) {
            playerScore[0] = playerData[i][1];
            break;
        }
    };
    
    return playerScore;
}

//shows the top 3 players
exports.leaderboard = async function () {
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:B500"
    });

    const playerData = playerScoreSheet.data.values.filter(item => item[1]);
    playerData.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    
    let topTen = playerData.slice(0, 10);
    topTen[0].unshift(1);

    for (let i = 0; i < topTen.length; i++) {

        //competitive ranking (1224)
        if (i != 0) {
            //console.log(i + " " + playerScore[1]);
            topTen[i].unshift(topTen[i][1] == topTen[i - 1][2] ? topTen[i - 1][0] : i + 1);
        };

    };

    return topTen;
}

//provides a filtered result of the name searched, including scoreless ones
exports.searchNameScoreless = async function (name) {
    const searchTerm = name.toLowerCase();
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:C500"
    });

    let searchList = [];

    for (const row of playerScoreSheet.data.values) {
        if (row[0] && row[0].toLowerCase().includes(searchTerm)) {
            searchList.push([row[0], row[2]]);
        }
    };

    return searchList;
}

//updates the player name in the leaderboard
exports.updateName = async function (oldName, newName) {
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:A500"
    });

    let rowNumber = playerScoreSheet.data.values.findIndex(player => player[0] == oldName) + 2;
    if (rowNumber < 2) {
        return "findError";
    }

    const response = sheets.spreadsheets.values.update({
        auth,
        spreadsheetId: sheetId,
        range: `player!A${rowNumber}:A${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        resource: { values : [[newName]] }
    });

    return response;
}

