const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tasks.json');

// === helper ===
function loadTasks() { // ngambil semua task dari file tasks.json
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function saveTasks(tasks) { // nyimpen semua task ke file tasks.json
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// === CLI Args ===
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
    console.log('Please provide a command: add, list, update, delete, mark-done, mark-in-progress');
    process.exit(0);
}

let tasks = loadTasks();

// === Commands === 
switch (command) {
    case 'add':
        addTask(args);
        break;
    case 'list':
        listTasks(args);
        break;
    case 'update':
        updateTask(args);
        break;
    case 'delete':
        deleteTask(args);
        break;
    case 'mark-done':
        markTaskStatus(args, 'done');
        break;
    case 'mark-in-progress':
        markTaskStatus(args, 'in-progress');
        break;
    default:
        console.log('Unknown command. Available commands: add, list, update, delete, mark-done, mark-in-progress');
}

saveTasks(tasks);

// === Command Implementations ===
function addTask(args) {
    if (args.length < 2) {
        console.log('Contoh : node index.js add "Beli Cemilan"');
        return;
    }
    const description = args[1];
    const newId = tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;

    const now = new Date().toISOString();
    const newTask = {
        id: newId,
        description: description,
        status: "todo",
        created_at: now,
        updated_at: now
    };

    tasks.push(newTask);
    console.log(`Task added successfully (ID: ${newId})`);
}

function listTasks(args) {
    const filter = args[1]; // done | todo | in-progress

    let filteredTasks = tasks;
    if (filter) {
        filteredTasks = tasks.filter(t => t.status === filter);
    }

    if (filteredTasks.length === 0) {
        console.log('No tasks found.');
        return;
    }

    filteredTasks.forEach(t => {
        console.log(`[${t.id}] ${t.description} - ${t.status} (Created: ${t.created_at}, Updated: ${t.updated_at})`);
    });
}

function updateTask(args) {
    const id = parseInt(args[1]);
    const newDesc = args[2];

    if(!id || !newDesc) {
        console.log('Contoh : node index.js update 1 "Membeli Cemilan dan Minuman"');
        return;
    }

    const task = tasks.find(t => t.id === id);
    if (!task) {
        console.log(`Task with ID ${id} not found.`);
        return;
    }

    task.description = newDesc;
    task.updated_at = new Date().toISOString();

    console.log(`Task ID ${id} updated successfully.`);
}

function deleteTask(args) {
    const id = parseInt(args[1]);

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        console.log(`Task with ID ${id} not found.`);
        return;
    }

    tasks.splice(index, 1);
    console.log(`Task ID ${id} deleted successfully.`);
}

function markTaskStatus(args, status) {
    const id = parseInt(args[1]);

    const task = tasks.find(t => t.id === id    );
    if (!task) {
        console.log(`Task with ID ${id} not found.`);
        return;
    }   

    task.status = status;
    task.updated_at = new Date().toISOString();

    console.log(`Task ID ${id} marked as ${status}.`);
}