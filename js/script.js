// book list
let odinLibrary = [];

// book constructor
function Book(id, title, author, pages, readStatus) {
  if (!new.target) {
    throw new Error("use 'new' to create new book");
  }
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
}

// add book to list
function addBookToLibrary(title, author, pages, read) {
  let newBook = new Book(crypto.randomUUID(), title, author, pages, read);
  odinLibrary.push(newBook);
}

// render table
function renderTable() {
  // clear table
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  // add books to table
  for (let book of odinLibrary) {
    const tr = document.createElement("tr");
    tr.classList.add("book-entry");
    tr.dataset.uuid = book.id;
    const pairs = Object.entries(book);
    for ([key, value] of pairs) {
      if (key === "id") {
        continue;
      }
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }

    // edit/delete popup
    const popupMenu = document.createElement("div");
    const popupOptionEdit = document.createElement("div");
    popupOptionEdit.textContent = "Edit";
    const popupOptionDelete = document.createElement("div");
    popupOptionDelete.textContent = "Delete";
    // edit book
    popupOptionEdit.addEventListener("click", () => {
      document.querySelector("#book-form").reset();
      let form = document.querySelector("#book-form");
      const pairs = Object.entries(book);
      for ([key, value] of pairs) {
        let field = form.querySelector(`#${key}`);
        if (field) {
          field.value = value;
        }
      }
      document.querySelector("dialog").showModal();
      document.querySelector("#submit-button").dataset.function = "edit";
    });
    // delete book
    popupOptionDelete.addEventListener("click", function () {
      const tr = this.closest("tr");
      odinLibrary = odinLibrary.filter(function (book) {
        return book.id !== tr.dataset.uuid;
      });
      renderTable();
    });

    const divider = document.createElement("hr");
    popupMenu.appendChild(popupOptionEdit);
    popupMenu.appendChild(divider);
    popupMenu.appendChild(popupOptionDelete);
    popupMenu.classList.add("popup-menu");
    tr.appendChild(popupMenu);

    // show edit/delete popup
    tr.addEventListener("click", function (event) {
      // toggle popup on same book entry
      const uuid = event.target.parentNode.dataset.uuid;
      const popup = this.querySelector(".popup-menu");
      if (popup.classList.contains("show")) {
        popup.classList.remove("show");
      } else {
        popup.classList.add("show");
        // show popup where mouse click
        const el = event.currentTarget;
        Object.assign(popup.style, {
          left: `${event.pageX + el.scrollLeft - el.offsetLeft}px`,
          top: `${event.pageY + el.scrolTop - el.offsetTop}px`,
        });
      }
      // hide popup on other book entry
      const popups = document.querySelectorAll(".popup-menu");
      popups.forEach((p) => {
        if (
          p.classList.contains("show") &&
          p.parentNode.dataset.uuid !== uuid
        ) {
          p.classList.remove("show");
        }
      });
    });

    // add book entry to table
    tbody.appendChild(tr);
  }
}

// hide popup if user clicks outside table body
window.addEventListener("click", ({ target }) => {
  const tbody = document.querySelector("tbody");
  if (!tbody.contains(target)) {
    const popups = document.querySelectorAll(".popup-menu");
    popups.forEach((p) => p.classList.remove("show"));
  }
});

// add/edit book and update table
document
  .querySelector("#book-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const submitButton = document.querySelector("#submit-button");
    if (submitButton.dataset.function === "add") {
      addBookToLibrary(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("readStatus"),
      );
    } else {
      let modified = odinLibrary.findIndex((x) => x.id === formData.get("id"));

      for ([key, value] of formData.entries()) {
        odinLibrary[modified][`${key}`] = value;
      }
    }
    const dialog = document.querySelector("#book-form-dialog");
    dialog.close();
    renderTable();
  });

// show add book form modal/dialog
document.querySelector("#add-book").addEventListener("click", () => {
  document.querySelector("#book-form").reset();
  document.querySelector("dialog").showModal();
  document.querySelector("#submit-button").dataset.function = "add";
});

addBookToLibrary("Test title", "Test author", "201", "Read");
addBookToLibrary("Test title", "Test author", "201", "Unread");
addBookToLibrary("Test title", "Test author", "201", "Reading");

renderTable();
