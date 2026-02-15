async function authMe() {
  const res = await fetch("/api/auth/me");
  return await res.json();
}

function renderAuthNav(auth) {
  const nav = document.getElementById("authNav");
  if (!nav) return;

  nav.innerHTML = "";

  if (!auth.loggedIn) {
    nav.innerHTML = `
      <a class="btn" href="/login.html">Login</a>
      <a class="btn btn-secondary" href="/register.html">Register</a>
    `;
  } else {
    const manage = document.createElement("a");
    manage.className = "btn btn-secondary";
    manage.href = "/add.html";
    manage.textContent = "Manage List";

    const logout = document.createElement("button");
    logout.className = "btn btn-danger";
    logout.textContent = "Logout";
    logout.onclick = async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    };

    nav.appendChild(manage);
    nav.appendChild(logout);
  }
}

async function loadItems() {
  //  Checks auth first
  const auth = await authMe();
  renderAuthNav(auth);

  // Loads list 
  const res = await fetch("/api/items");
  const items = await res.json();

  const list = document.getElementById("itemList");
  const msg = document.getElementById("message");

  if (!list) return;
  list.innerHTML = "";

  if (msg) msg.textContent = auth.loggedIn
    ? ""
    : "Log in to add, update, or delete items.";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("item-row");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("item-name");
    nameSpan.textContent = item.name;

    li.appendChild(nameSpan);

    //Only show buttons when logged in
    if (auth.loggedIn) {
      const actions = document.createElement("div");
      actions.classList.add("item-actions");

      const editBtn = document.createElement("button");
      editBtn.classList.add("btn", "btn-small");
      editBtn.textContent = "Update";
      editBtn.onclick = () => {
        window.location.href = `/edit.html?id=${item._id}`;
      };

      const delBtn = document.createElement("button");
      delBtn.classList.add("btn", "btn-small", "btn-danger");
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        const delRes = await fetch(`/api/items/${item._id}`, { method: "DELETE" });

        //If session expired, send them to login
        if (delRes.status === 401) {
          window.location.href = "/login.html?error=Please log in first";
          return;
        }

        const data = await delRes.json();
        if (msg) msg.textContent = data.message || "Deleted";
        await loadItems();
      };

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      li.appendChild(actions);
    }

    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadItems);
