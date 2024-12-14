function openModal(modalType) {
    document.getElementById(`${modalType}Modal`).classList.add('active');
    document.getElementById(`${modalType}Modal`).querySelector('.modal').classList.add('active');
}

function closeModal(modalType) {
    document.getElementById(`${modalType}Modal`).classList.remove('active');
    document.getElementById(`${modalType}Modal`).querySelector('.modal').classList.remove('active');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function handleCreateUser(event) {
    event.preventDefault();
    let form = new FormData(event.target)
    let data = {
        users: JSON.parse(form.get("users")),
        token: form.get("token")
    }
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    }
    closeModal('createUser');
    fetch("https://ctf-dashboard-rsq6.onrender.com/admin/register", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(data)
    }).then((res) => {
        if (res.ok) {
            return res.json()
        }
        return null
    }).then(data => {
        if (data) {
            showNotification('Users added successfull !');
            return
        } else {
            showNotification('Error get user data formed or token !', "error")
        }
    }).catch((err) => {
        console.log(err);
        showNotification('Error get user data formed or token !', "error")
    })

}

function handleAddPoints(event) {
    event.preventDefault();
    let form = new FormData(event.target)
    let data = {
        point: +form.get("point"),
        userIds: Array.from(event.target.users.selectedOptions).map(option => +option.value),
        token: form.get("token")
    }
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    }


    closeModal('addPoints');
    fetch("https://ctf-dashboard-rsq6.onrender.com/admin/update", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(data)
    }).then((res) => {
        if (res.ok) {
            return res.json()
        }
        return null
    }).then(data => {
        if (data) {
            showNotification('Users updated successfull !');
            return
        } else {
            showNotification('Error get user data formed or token !', "error")
        }
    }).catch((err) => {
        console.log(err);
        showNotification('Error get user data formed or token !', "error")
    })
}

fetch("https://ctf-dashboard-rsq6.onrender.com/api/users").then((res) => {

    if (res.ok) {
        return res.json()
    }
    return null
}).then(teams => {
    console.log(teams);
    if (teams) {
        let blue = teams?.blue_teams || []
        let red = teams?.red_teams || []
        let datas = [...blue, ...red]
        let table = document.getElementById("table-body");
        let selectOption = document.getElementById("users-list")
        table.innerHTML = "";
        datas.forEach(team => {
            let row = document.createElement("tr");
            row.innerHTML = `
                        <td>${team.login}</td>
                        <td>${team.point}</td>
                        <td>${team.team === "BLUE_TEAM" ? "<span class='badge-b'>BLUE TEAM" : "<span class='badge'> RED TEAM"}</span></td>
                    `;
            let span = document.createElement("option")
            span.value = team?.id
            span.innerHTML = team?.login
            selectOption.appendChild(span)
            table.appendChild(row);
        });

    }
})

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            overlay.querySelector('.modal').classList.remove('active');
        }
    });
});