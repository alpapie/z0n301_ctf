(async function name() {
    await fetch("https://ctf-dashboard-rsq6.onrender.com/api/users").then(data => {
        if (data.status === 200) {
            return data.json()
        }
        return null
    }).then(teams => {
        if (teams) {
            blue_team_table(teams?.blue_teams || [])
            red_team_table(teams?.red_teams || [])
            return
        }
        console.log("nothing");
    }).catch(error => {
        console.log(error)
    })
})()


let blue_team_table = (teams = [{ "id": 1, nom: "Dupont", prenom: "Jean", login: "jdupont", email: "jean.dupont@example.com", team: "RED_TEAM", point: 120 }]) => {
    let total = teams.reduce((acc, value) => {
        return acc + value.point
    }, 0);
    document.getElementById("blue_team_score").innerHTML = `${total} pts`

    document.getElementById("blue_team_member").innerHTML = teams.length
    let table = document.getElementById("blue_team_table")

    table.innerHTML = "";
    let i = 0
    for (let team of teams) {
        i++
        let row = document.createElement("tr");

        let rankCell = document.createElement("td");
        rankCell.className = "rank";
        rankCell.textContent = i;
        row.appendChild(rankCell);

        let usernameCell = document.createElement("td");
        let usernameDiv = document.createElement("div");
        usernameDiv.className = "username";

        let statusIndicator = document.createElement("span");
        statusIndicator.className = "status-indicator";
        usernameDiv.appendChild(statusIndicator);

        let usernameText = document.createTextNode(`${team.login}`);
        usernameDiv.appendChild(usernameText);

        usernameCell.appendChild(usernameDiv);
        row.appendChild(usernameCell);

        let pointsCell = document.createElement("td");
        pointsCell.className = "points";
        pointsCell.textContent = team.point;
        row.appendChild(pointsCell);

        table.appendChild(row);
    }
}

let red_team_table = (teams = [{ "id": 1, nom: "", prenom: "", login: "", email: "", team: "", point: 0 }]) => {
    let total = teams.reduce((acc, value) => {
        return acc + value.point
    }, 0);
    document.getElementById("red_team_score").innerHTML = `${total} pts`
    document.getElementById("red_team_member").innerHTML = teams.length
    let table = document.getElementById("red_team_table")

    table.innerHTML = "";
    let i = 0
    for (let team of teams) {
        let row = document.createElement("tr");
        i++
        let rankCell = document.createElement("td");
        rankCell.className = "rank";
        rankCell.textContent = i;
        row.appendChild(rankCell);

        let usernameCell = document.createElement("td");
        let usernameDiv = document.createElement("div");
        usernameDiv.className = "username";

        let statusIndicator = document.createElement("span");
        statusIndicator.className = "status-indicator";
        usernameDiv.appendChild(statusIndicator);

        let usernameText = document.createTextNode(`${team.login}`);
        usernameDiv.appendChild(usernameText);

        usernameCell.appendChild(usernameDiv);
        row.appendChild(usernameCell);

        let pointsCell = document.createElement("td");
        pointsCell.className = "points";
        pointsCell.textContent = team.point;
        row.appendChild(pointsCell);

        table.appendChild(row);
    }
}

let isDevToolsOpen = false;
const checkDevTools = () => {
    const before = performance.now();
    debugger;
    const after = performance.now();
    if (after - before > 100) {
        isDevToolsOpen = true;
    } else {
        isDevToolsOpen = false;
    }
};

setInterval(() => {
    checkDevTools();
    console.log(`DevTools open: ${isDevToolsOpen}`);
}, 100);