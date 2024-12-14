let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
}

fetch("https://ctf-dashboard-rsq6.onrender.com/admin/auth", {
    headers: headersList,
}).then((res) => {
    if (!res.ok) {
        window.location.href = "login.html"
    }
})