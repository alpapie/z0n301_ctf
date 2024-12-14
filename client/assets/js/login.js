let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
}

fetch("https://ctf-dashboard-rsq6.onrender.com/admin/auth", {
    headers: headersList,
}).then((res) => {
    if (res.ok) {
        window.location.href = "dashboard.html"
    }
})

let pwdinput = document.querySelector("#password-input")
pwdinput.addEventListener("click", () => {
    let pwdd = document.querySelector("#mypasword")
    if (pwdd.type === "password") {
        pwdd.type = "text";
    } else {
        pwdd.type = "password";
    }
})

let form_login = document.getElementById("form-login")
form_login.addEventListener("submit", async (e) => {
    e.preventDefault()
    var formData = new FormData(form_login);
    let data = {
        login: formData.get("login"),
        password: formData.get("password")
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    await fetch("https://ctf-dashboard-rsq6.onrender.com/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: myHeaders,
    }).then((res) => {
        return res.json()
    }).then((data) => {
        if (data.error) {
            document.getElementById('message').textContent = data.error;
            document.getElementById('troll-gif').src = data.gif;

            document.getElementById('troll-gif').style.display = 'block';

            const trollSound = document.getElementById('troll-sound');
            trollSound.src = `assets/son/${data.sound}`;
            trollSound.play();
            return
        }
        if (data?.token) {
            localStorage.setItem("token", data.token)
            window.location.href = "dashboard.html"
        }
    })
    document.getElementById("error_page").style.display = "flex"
})
