const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items

let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  console.log('columnEl:', columnEl);
  console.log('column:', column);
  console.log('item:', item);
  console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  columnEl.appendChild(listEl);
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index},${column})`);
}


function updateItem(index, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = itemLists[column].children;

  if(dragging == false){
    if(!selectedColumnEl[index].textContent){
      delete selectedArray[index];
    }
    else{
      selectedArray[index] = selectedColumnEl[index].textContent;
    }
    updateDOM();
  }
}

// Filter array for null elements
function filterArray(array){
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => { 
    createItemEl(backlogList, 0, backlogItem, index)
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => { 
    createItemEl(progressList, 1, progressItem, index)
  });
  progressListArray = filterArray(progressListArray)

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => { 
    createItemEl(completeList, 2, completeItem, index)
  });
  completeListArray = filterArray(completeListArray)

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => { 
    createItemEl(onHoldList, 3, onHoldItem, index)
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updateSavedColumns();
  updatedOnLoad = true;
}

// When Item enters column Area
function dragEnter(column){
  itemLists[column].classList.add('over');
  currentColumn = column;
}

// Column allows for item to drop
function allowDrop(e){
  e.preventDefault();
}

// Dropping Item in column
function drag(e){
  draggedItem = e.target;
  console.log('draggedItem', draggedItem);
  dragging = true;
}

// Dropping Item in column
function drop(e){
  e.preventDefault();
  // Remove background color
  itemLists.forEach((column) => {
      column.classList.remove('over');
  });
  // Add item to column
  const parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
  dragging = false;
}

function rebuildArrays(){
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  for (let i = 0; i < backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent);
  }

  for (let i = 0; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }

  for (let i = 0; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }

  for (let i = 0; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}

function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';

  addToColumn(column);
}

function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

updateDOM();