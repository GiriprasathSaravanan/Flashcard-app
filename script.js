// Load cards from localStorage or empty array
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

const cardContainer = document.getElementById("cardContainer");
const cardForm = document.getElementById("cardForm");
const frontTextInput = document.getElementById("frontText");
const backTextInput = document.getElementById("backText");
const editIndexInput = document.getElementById("editIndex");
const searchInput = document.getElementById("search");

// Render flashcards on screen
function renderCards(filter = "") {
  cardContainer.innerHTML = "";

  flashcards.forEach((card, index) => {
    const frontLower = card.front.toLowerCase();
    const backLower = card.back.toLowerCase();
    const filterLower = filter.toLowerCase();

    if (
      frontLower.includes(filterLower) ||
      backLower.includes(filterLower) ||
      filterLower === ""
    ) {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="flashcard" data-index="${index}">
          <div class="flashcard-inner">
            <div class="flashcard-front">${escapeHTML(card.front)}</div>
            <div class="flashcard-back">${escapeHTML(card.back)}
              <div class="mt-3 text-center">
                <button class="btn btn-sm btn-outline-secondary btn-edit">Edit</button>
                <button class="btn btn-sm btn-outline-danger btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;

      cardContainer.appendChild(col);
    }
  });
}

// Escape HTML special chars to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

// Save flashcards to localStorage
function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

// Clear form inputs
function clearForm() {
  frontTextInput.value = "";
  backTextInput.value = "";
  editIndexInput.value = "";
}

// Handle form submit for add/edit
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const front = frontTextInput.value.trim();
  const back = backTextInput.value.trim();
  const editIndex = editIndexInput.value;

  if (editIndex === "") {
    // Add new card
    flashcards.push({ front, back });
  } else {
    // Edit existing card
    flashcards[editIndex] = { front, back };
  }

  saveFlashcards();
  renderCards(searchInput.value);
  clearForm();

  // Close modal (Bootstrap 5)
  const modalEl = document.getElementById("cardModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

// Handle card clicks (flip, edit, delete)
cardContainer.addEventListener("click", (e) => {
  const cardEl = e.target.closest(".flashcard");
  if (!cardEl) return;

  // Edit button
  if (e.target.classList.contains("btn-edit")) {
    const index = cardEl.getAttribute("data-index");
    const card = flashcards[index];
    frontTextInput.value = card.front;
    backTextInput.value = card.back;
    editIndexInput.value = index;

    // Show modal
    const modalEl = document.getElementById("cardModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    return;
  }

  // Delete button
  if (e.target.classList.contains("btn-delete")) {
    const index = cardEl.getAttribute("data-index");
    if (confirm("Are you sure you want to delete this card?")) {
      flashcards.splice(index, 1);
      saveFlashcards();
      renderCards(searchInput.value);
    }
    return;
  }

  // Otherwise, flip the card
  cardEl.classList.toggle("flipped");
});

// Handle search input
searchInput.addEventListener("input", (e) => {
  renderCards(e.target.value);
});

// Initial render
renderCards();
