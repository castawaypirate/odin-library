const odinLibrary = [];

function Book(id, title, author, pages, read) {
  if (!new.target) {
    throw new Error("use 'new' to create new book");
  }
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
  let newBook = new Book(crypto.randomUUID(), title, author, pages, read);
  odinLibrary.push(newBook);
}

addBookToLibrary("Test title", "Test author", "201", "true");
addBookToLibrary("Test title", "Test author", "201", "true");
addBookToLibrary("Test title", "Test author", "201", "true");

function renderTable() {
  let TBODY = document.querySelector("tbody");
  TBODY.innerHTML = "";
  for (let book of odinLibrary) {
    let bookTR = document.createElement("tr");
    let propertyValues = Object.values(book);
    propertyValues.forEach((value) => {
      let propertyTD = document.createElement("td");
      propertyTD.textContent = value;
      bookTR.appendChild(propertyTD);
    });
    TBODY.appendChild(bookTR);
  }
}

renderTable();

document
  .querySelector("#add-book-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    addBookToLibrary(
      formData.get("title"),
      formData.get("author"),
      formData.get("pages"),
      formData.get("readStatus"),
    );
    let dialog = document.querySelector("#add-book-form-dialog");
    dialog.close();
    renderTable();
  });
