let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const storageKey = "tasks";
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const templateElement = document.querySelector("#to-do__item-template");
const itemTemplate = templateElement.content.querySelector(".to-do__item");

function loadTasks() {
  const savedTasks = localStorage.getItem(storageKey);

  if (savedTasks === null) {
    return items;
  }

  try {
    const tasks = JSON.parse(savedTasks);
    return Array.isArray(tasks) &&
      tasks.every((task) => typeof task === "string")
      ? tasks
      : items;
  } catch {
    return items;
  }
}

function createItem(item) {
  const clone = itemTemplate.cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate",
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;
  textElement.setAttribute("contenteditable", "false");

  deleteButton.addEventListener("click", () => {
    clone.remove();
    items = getTasksFromDOM();
    saveTasks(items);
  });

  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    items = getTasksFromDOM();
    saveTasks(items);
  });

  textElement.addEventListener("paste", pasteTaskText);

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((textElement) =>
    tasks.push(textElement.textContent),
  );
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function pasteTaskText(event) {
  event.preventDefault();
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return;
  }
  const range = selection.getRangeAt(0);
  const textNode = document.createTextNode(
    event.clipboardData.getData("text/plain"),
  );
  range.deleteContents();
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const itemName = inputElement.value.trim();
  if (!itemName) {
    inputElement.focus();
    return;
  }
  const newItem = createItem(itemName);
  listElement.prepend(newItem);
  items = getTasksFromDOM();
  saveTasks(items);
  formElement.reset();
}

formElement.addEventListener("submit", handleFormSubmit);
items = loadTasks();
items.forEach((item) => listElement.append(createItem(item)));
