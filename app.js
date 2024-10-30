// Seleciona o elemento do quadro
const board = document.getElementById('board');

// Carrega as listas do Local Storage ao iniciar
document.addEventListener('DOMContentLoaded', loadLists);

// Função para adicionar uma nova lista
function addList() {
    const listName = prompt('Nome da nova lista:');
    if (listName) {
        createList(listName);
        saveLists();
    }
}

// Cria uma nova lista
function createList(name) {
    const listContainer = document.createElement('div');
    listContainer.className = 'list';
    listContainer.setAttribute('draggable', true);
    listContainer.ondragover = (e) => e.preventDefault();
    listContainer.ondrop = (e) => dropTask(e, listContainer);

    const listTitle = document.createElement('h2');
    listTitle.textContent = name;

    const input = document.createElement('input');
    input.placeholder = 'Adicionar tarefa';
    input.id = `taskInput${name}`;

    const addButton = document.createElement('button');
    addButton.textContent = 'Adicionar';
    addButton.onclick = () => addTask(name);

    const taskList = document.createElement('ul');
    taskList.className = 'task-list';

    listContainer.appendChild(listTitle);
    listContainer.appendChild(input);
    listContainer.appendChild(addButton);
    listContainer.appendChild(taskList);

    board.appendChild(listContainer);
}

// Função para adicionar uma tarefa
function addTask(listName) {
    const input = document.getElementById(`taskInput${listName}`);
    const taskText = input.value;

    if (taskText === '') {
        alert('Digite uma tarefa!');
        return;
    }

    const taskItem = createTaskItem(taskText);
    document.querySelector(`.list:has(h2:contains(${listName})) .task-list`).appendChild(taskItem);
    input.value = '';
    saveLists();
}

// Cria um item de tarefa
function createTaskItem(text) {
    const taskItem = document.createElement('li');
    taskItem.textContent = text;
    taskItem.className = 'task';
    taskItem.setAttribute('draggable', true);

    taskItem.ondragstart = (e) => {
        e.dataTransfer.setData('text/plain', text);
    };

    taskItem.ondrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const newTaskItem = createTaskItem(data);
        e.target.appendChild(newTaskItem);
    };

    const completeButton = document.createElement('button');
    completeButton.textContent = '✔';
    completeButton.onclick = () => {
        taskItem.classList.toggle('completed');
        saveLists();
    };

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.onclick = () => editTask(taskItem);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.onclick = () => {
        taskItem.remove();
        saveLists();
    };

    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    return taskItem;
}

// Função para editar uma tarefa
function editTask(taskItem) {
    const newTaskText = prompt('Edite sua tarefa:', taskItem.firstChild.nodeValue);
    if (newTaskText) {
        taskItem.firstChild.nodeValue = newTaskText;
        saveLists();
    }
}

// Função para salvar listas no Local Storage
function saveLists() {
    const lists = [...document.querySelectorAll('.list')].map(list => {
        const name = list.querySelector('h2').innerText;
        const tasks = [...list.querySelectorAll('.task')].map(task => task.firstChild.nodeValue);
        return { name, tasks };
    });
    localStorage.setItem('taskLists', JSON.stringify(lists));
}

// Função para carregar listas do Local Storage
function loadLists() {
    const lists = JSON.parse(localStorage.getItem('taskLists'));
    if (lists) {
        lists.forEach(list => {
            createList(list.name);
            list.tasks.forEach(task => {
                const taskItem = createTaskItem(task);
                document.querySelector(`.list:has(h2:contains(${list.name})) .task-list`).appendChild(taskItem);
            });
        });
    }
}

// Função para mover tarefa entre listas
function dropTask(event, listContainer) {
    event.preventDefault();
    const taskText = event.dataTransfer.getData('text/plain');
    const newTaskItem = createTaskItem(taskText);
    listContainer.querySelector('.task-list').appendChild(newTaskItem);
}
