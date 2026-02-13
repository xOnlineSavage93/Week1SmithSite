async function loadItems() {
  const res = await fetch("/api/items");
  const items = await res.json();

  const list = document.getElementById("itemList");
  list.innerHTML = "";

  items.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("item-row");

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("item-name");
  nameSpan.textContent = item.name;

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
    const res = await fetch(`/api/items/${item._id}`, { method: "DELETE" });
    const data = await res.json();
    document.getElementById("message").textContent = data.message || "Deleted";
    await loadItems();
  };

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(nameSpan);
  li.appendChild(actions);

  list.appendChild(li);
});

}

document.addEventListener("DOMContentLoaded", loadItems);
