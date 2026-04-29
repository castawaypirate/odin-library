// Library class
class Library {
  constructor() {
    this._bookList = [];
  }

  get bookList() {
    return this._bookList;
  }

  set bookList(list) {
    this._bookList = list;
  }

  addBookToLibrary(book) {
    this._bookList.push(book);
  }
}

// Book class
class Book {
  constructor(id, title, author, pages, readStatus) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = title;
  }

  get author() {
    return this._author;
  }

  set author(author) {
    this._author = author;
  }

  get pages() {
    return this._pages;
  }

  set pages(pages) {
    this._pages = pages;
  }

  get readStatus() {
    return this._readStatus;
  }

  set readStatus(readStatus) {
    this._readStatus = readStatus;
  }
}

// render table
function renderTable() {
  // clear table
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  // add books to table
  for (let book of odinLibrary.bookList) {
    const tr = document.createElement("tr");
    tr.classList.add("book-entry");
    tr.dataset.uuid = book.id;
    const pairs = Object.entries(book);
    for ([key, value] of pairs) {
      if (key === "_id") {
        continue;
      }
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }

    // edit/delete popup
    const popupMenu = document.createElement("div");
    const popupOptionEdit = document.createElement("div");
    popupOptionEdit.classList.add("popup-option");
    popupOptionEdit.textContent = "Edit";
    const popupOptionDelete = document.createElement("div");
    popupOptionDelete.classList.add("popup-option");
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
      odinLibrary.bookList = odinLibrary.bookList.filter(function (book) {
        return book.id !== tr.dataset.uuid;
      });
      renderTable();
    });

    const divider = document.createElement("div");
    divider.classList.add("divider");
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

document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
});

// add/edit book and update table
document
  .querySelector("#book-form")
  .addEventListener("submit", function (event) {
    // validations
    const title = document.querySelector("#_title");
    title.addEventListener("input", () => {
      if (title.validity.valid) {
        document.querySelector("#title-error").textContent = "";
      }
    });

    const author = document.querySelector("#_author");
    author.addEventListener("input", () => {
      if (author.validity.valid) {
        document.querySelector("#author-error").textContent = "";
      }
    });

    const pages = document.querySelector("#_pages");
    pages.addEventListener("input", () => {
      if (!pages.validity.patternMismatch) {
        document.querySelector("#pages-error").textContent = "";
      }
    });

    const errors = {};

    if (!title.validity.valid) {
      errors.title = "Title must be filled!";
    }

    if (!author.validity.valid) {
      errors.author = "Author must be filled!";
    }

    if (pages.validity.patternMismatch) {
      errors.pages = "Pages must be a positive integer!";
    }

    if (Object.keys(errors).length !== 0) {
      displayErrors(errors);
      event.preventDefault();
      return;
    }

    const formData = new FormData(this);

    // if (!validateNumberOfPagesInput(formData.get("pages"))) {
    //   alert("Bad pages input. Must be a positive integer!");
    //   return;
    // }

    const submitButton = document.querySelector("#submit-button");
    if (submitButton.dataset.function === "add") {
      odinLibrary.addBookToLibrary(
        new Book(
          crypto.randomUUID(),
          formData.get("title"),
          formData.get("author"),
          formData.get("pages"),
          formData.get("readStatus"),
        ),
      );
    } else {
      let modified = odinLibrary.bookList.findIndex(
        (x) => x.id === formData.get("id"),
      );

      for ([key, value] of formData.entries()) {
        odinLibrary.bookList[modified][`${key}`] = value;
      }
    }
    const dialog = document.querySelector("#book-form-dialog");
    dialog.close();
    renderTable();
  });

// show add book form modal/dialog
document.querySelector("#add-book").addEventListener("click", () => {
  document.querySelector("#book-form").reset();

  // clear error message
  document.querySelector("#title-error").textContent = "";
  document.querySelector("#author-error").textContent = "";
  document.querySelector("#pages-error").textContent = "";

  document.querySelector("dialog").showModal();
  document.querySelector("#submit-button").dataset.function = "add";
});

function displayErrors(errors) {
  const titleError = document.querySelector("#title-error");
  const authorError = document.querySelector("#author-error");
  const pagesError = document.querySelector("#pages-error");

  if (Object.hasOwn(errors, "title")) {
    titleError.textContent = errors.title;
  }
  if (Object.hasOwn(errors, "author")) {
    authorError.textContent = errors.author;
  }
  if (Object.hasOwn(errors, "pages")) {
    pagesError.textContent = errors.pages;
  }
}

function validateNumberOfPagesInput(pages) {
  let numberOfPages = parseInt(pages);
  if (
    (Number.isInteger(numberOfPages) &&
      numberOfPages > 0 &&
      numberOfPages.toString() === pages) ||
    pages.length === 0
  ) {
    return true;
  }
  return false;
}

const odinLibrary = new Library();

odinLibrary.addBookToLibrary(
  new Book(crypto.randomUUID(), "Neuromancer", "William Gibson", "271", "Read"),
);
odinLibrary.addBookToLibrary(
  new Book(
    crypto.randomUUID(),
    "Make It Stick: The Science of Successful Learning",
    "Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel",
    "336",
    "Reading",
  ),
);
odinLibrary.addBookToLibrary(
  new Book(
    crypto.randomUUID(),
    "Design Patterns: Elements of Reusable Object-Oriented Software",
    " Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    "416",
    "Unread",
  ),
);

renderTable();
