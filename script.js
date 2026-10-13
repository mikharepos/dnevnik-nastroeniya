const moodButtons = document.querySelectorAll(".mood-buttons button");
const noteField = document.querySelector("#note");
const saveButton = document.querySelector(".save-button");
const entriesBlock = document.querySelector("#entries");
const greeting = document.querySelector("#greeting");
const counter = document.querySelector("#counter");

let selectedMood = null;

function getEntries() {
  const savedEntries = localStorage.getItem("entries");

  if (savedEntries === null) {
    return [];
  }

  return JSON.parse(savedEntries);
}

function saveEntries(entries) {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function showGreeting() {
  const now = new Date();
  const hour = now.getHours();

  let text = "";

  if (hour >= 5 && hour < 12) {
    text = "«Доброе утро! Начните день с одной честной записи»";
  } else if (hour >= 12 && hour < 18) {
    text = "Добрый день! Как проходит ваш день?";
  } else if (hour >= 18 && hour < 23) {
    text = "Добрый вечер! Как вы себя чувствуете?";
  } else {
    text = "Доброй ночи. Если не спится — запишите мысли.";
  }

  greeting.textContent = text;
}

function showCounter() {
  const entries = getEntries();
  const count = entries.length;

  if (count === 0) {
    counter.textContent = "«Начните с первой записи»";
  } else if (count === 1) {
    counter.textContent = "1 запись";
  } else if (count >= 2 && count <= 4) {
    counter.textContent = count + " записи";
  } else {
    counter.textContent = count + " записей";
  }
}

function showEntries() {
  showGreeting();
  showCounter();

  const entries = getEntries();

  entriesBlock.innerHTML = "";

  if (entries.length === 0) {
    entriesBlock.innerHTML = "<p>Пока записей нет.</p>";
    return;
  }

  entries.forEach(function(entry) {
    const entryElement = document.createElement("div");
    entryElement.className = "entry";

    entryElement.innerHTML = `
        <p class="entry-mood">${entry.mood}</p>
        <p class="entry-text">${entry.text}</p>
        <p class="entry-date">${entry.date}</p>
        <button class="delete-button" data-id="${entry.id}">X</button>
    `;

    entriesBlock.appendChild(entryElement);
  });
}

moodButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    moodButtons.forEach(function(otherButton) {
      otherButton.style.borderColor = "#2c3350";
      otherButton.style.background = "#1c2033";
    });

    button.style.borderColor = "#5b6cff";
    button.style.background = "#252b45";

    selectedMood = button.dataset.mood;
  });
});

saveButton.addEventListener("click", function() {
  const text = noteField.value.trim();

  if (selectedMood === null) {
    alert("Сначала выберите настроение.");
    return;
  }

  if (text === "") {
    alert("Напишите короткую заметку.");
    return;
  }

  const now = new Date();

  const newEntry = {
    id: Date.now(),
    mood: selectedMood,
    text: text,
    date: now.toLocaleDateString("ru-RU") + ", " +
          now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
          })
  };

  const entries = getEntries();
  entries.unshift(newEntry);

  saveEntries(entries);
  showEntries();

  noteField.value = "";
  selectedMood = null;

  moodButtons.forEach(function(button) {
    button.style.borderColor = "#2c3350";
    button.style.background = "#1c2033";
  });
});

showEntries();

entriesBlock.addEventListener("click", function(event) {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  const entryId = Number(deleteButton.dataset.id);

  const isConfirmed = confirm("Точно удалить эту запись?");

  if (!isConfirmed) {
    return;
  }

  const entries = getEntries();

  const updatedEntries = entries.filter(function(entry) {
    return entry.id !== entryId;
  });

  saveEntries(updatedEntries);
  showEntries();
});