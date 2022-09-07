displayNotes();
//dynamic text area start
const Textareas = document.querySelectorAll("textarea");
Textareas.forEach((textarea) =>
  textarea.addEventListener(
    "input",
    (e) => {
      const scHeight = e.target.scrollHeight;
      textarea.style.height = `${scHeight}px`;
    },
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        textarea.value = textarea.value.trim();
        const scHeight = 21;
        textarea.style.height = `${scHeight}px`;
      }
    })
  )
);
Textareas.forEach((textarea) =>
  textarea.addEventListener("focus", (e) => {
    const scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight}px`;
  })
);
//dynamic text area end

function sidebarAdjust() {
  const sideElements = document.querySelectorAll(".Side-Items-text");
  const Sidebar = document.getElementById("Sidebar");
  if (Sidebar.classList.contains("col-3")) {
    Sidebar.classList.remove("col-3");
    Sidebar.classList.add("col-1");
    Sidebar.classList.remove("pe-5");
    Sidebar.classList.add("pe-0");
  } else {
    Sidebar.classList.remove("col-1");
    Sidebar.classList.add("col-3");
    Sidebar.classList.remove("pe-0");
    Sidebar.classList.add("pe-5");
  }

  sideElements.forEach(function (element) {
    element.style.display == "none"
      ? (element.style.display = "block")
      : (element.style.display = "none");
  });
}
//clearing text start
function clearText(id) {
  const searchInput = document.getElementById(id);
  searchInput.value = "";
}
//clearing text end

const btns = document.querySelectorAll(".Side-Items");
btns.forEach(function (element) {
  element.addEventListener("click", function () {
    let curr = document.querySelector(".active");
    curr.classList.remove("active");
    this.classList.add("active");
  });
});

//For entering note -start
function clickingNote() {
  document.getElementById("take-a-note").style.display = "none"; //disabling general note section
  document.getElementById("close-a-note").style.display = "block"; //enabling actual input section
  document.getElementById("search_input").disabled = "true"; //disabling search bar
  document.getElementById("title_input").focus();
}
//For entering note -end

//Adding notes start
function addNote() {
  const title = document.getElementById("title_input");
  const desc = document.getElementById("note_input");

  let notesObj = JSON.parse(localStorage.getItem("notes")) || [];
  if (title.value !== "" || desc.value !== "") {
    notesObj = [[title.value.trim(), desc.value.trim()], ...notesObj];

    // console.log(notesObj);
    localStorage.setItem("notes", JSON.stringify(notesObj));
  }
  location.reload();
}
//Adding notes end

function displayNotes() {
  let notesObj = JSON.parse(localStorage.getItem("notes")) || [];

  let html = "";
  notesObj.forEach(function (element, index) {
    element[0] = element[0].replaceAll("\n", "<br>");
    element[1] = element[1].replaceAll("\n", "<br>");
    html += NoteCards(element, index);
  });
  const notesElm = document.getElementById("notes-area");
  if (notesObj.length != 0) {
    notesElm.innerHTML = html;
  } else {
    notesElm.innerHTML = emptyNotes();
  }
}

//delete
function deleteNote(index) {
  let notesObj = JSON.parse(localStorage.getItem("notes")) || [];
  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  location.reload();
  displayNotes();
}

// search functionality
const searchInput = document.getElementById("search_input");
searchInput.addEventListener("input", function () {
  const note1 = document.getElementById("take-a-note");
  const note2 = document.getElementById("close-a-note");
  const notesarea = document.getElementById("notes-area");
  const closed = document.querySelector(".close");

  if (searchInput.value) {
    note1.style.display = "none";
    note2.style.display = "none";
    closed.style.display = "inline-flex";
    notesarea.classList.add("mt-5");
  } else {
    closed.style.display = "none";
    note1.style.display = "block";
    notesarea.classList.remove("mt-5");
  }
  closed.addEventListener("click", function () {
    searchInput.value = "";
    searchInput.focus();
  });
  const inputVal = searchInput.value.toLowerCase();
  const noteCards = document.getElementsByClassName("noteCard");
  Array.from(noteCards).forEach(function (element) {
    const title = element.querySelector(".card-title").innerText;
    const desc = element.querySelector(".card-text").innerText;

    if (
      title.toLowerCase().includes(inputVal) |
      desc.toLowerCase().includes(inputVal)
    ) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
});

const noteCards = document.querySelectorAll(".noteCard");

noteCards.forEach(function (element, index) {
  element.addEventListener("click", () => {
    localStorage.setItem("Flag", index);

    const title = element.querySelector(".card-title");
    const desc = element.querySelector(".card-text");
    const TitledefaultHeight = 33;
    const DescdefaultHeight = 24;
    const titleLines = Lines(title.innerText);
    const descLines = Lines(desc.innerText);
    document.getElementById("title_input_modal").style.height = `${
      titleLines * TitledefaultHeight
    }px`;
    document.getElementById("note_input_modal").style.height = `${
      descLines * DescdefaultHeight
    }px`;
    document.getElementById("title_input_modal").value = title.innerText;
    document.getElementById("note_input_modal").value = desc.innerText;
  });
});

//Edit Notes
function UpdateNotes() {
  const Index = localStorage.getItem("Flag");
  const notesObj = JSON.parse(localStorage.getItem("notes"));
  notesObj[Index] = [
    document.getElementById("title_input_modal").value.trim(),
    document.getElementById("note_input_modal").value.trim(),
  ];
  localStorage.setItem("notes", JSON.stringify(notesObj));
  const noteCards = document.querySelectorAll(".noteCard");
  noteCards.forEach((element, index) => {
    if (index == Index) {
      element.querySelector(".card-title").innerText = document
        .getElementById("title_input_modal")
        .value.trim();
      element.querySelector(".card-text").innerText = document
        .getElementById("note_input_modal")
        .value.trim();
    }
  });
}

//modal close event
const modalClose = document.getElementById("Edit-Notes");
modalClose.addEventListener("hidden.bs.modal", function () {
  UpdateNotes();
});

function Lines(text) {
  const lines = text.split("\n");
  return lines.length;
}
//modal open event
const modalOpen = document.getElementById("Edit-Notes");
modalOpen.addEventListener("shown.bs.modal", function () {
  document.getElementById("title_input_modal").focus();
  document.getElementById("note_input_modal").focus();
});

function emptyNotes() {
  return `<div class="col d-flex flex-column align-items-center mt-5 pt-5 pe-5">
  <img
  src="/img/bulb.png"
  width="100"
  height="100"
  alt=""
  srcset=""
  class="mt-4 me-5 opacity-25"
/>
<h4 class="mt-3 me-5" style="color: #808688">
  Notes you add appear here
</h4>

</div>`;
}

function NoteCards(element, index) {
  return `
  <div
  class="card noteCard  mb-2 me-2 pb-0 " data-bs-toggle="modal" data-bs-target="#Edit-Notes" id="i${index}" 

>
  <div class="card-body">
    <h6 class="card-title">${element[0]}</h6>
    <p class="card-text mb-1">${element[1]}</p>
    <img
    src="/img/trash.png"
    width="20"
    height="20"
    alt=""
    srcset=""
    class="delete-option opacity-75"
    id="${index}"
    onclick="deleteNote(this.id)"
  

  />
  </div>
</div>`;
}
