const express = require('express');
const router = express.Router();
const fs = require('fs');
var path = require('path');

function fileExist(filepath) {
    try {
        return fs.existsSync(filepath);
    } catch (err) {
        console.log(err);
        return false;
    }
}
function FileContent(filepath) {
    try {
        if (fileExist(filepath)) {
            let content = fs.readFileSync(filepath, 'utf8');
            if(content == "") content = "[]";
            return content;
        }
        else {
            return "[]";
        }
    } catch (err) {
        console.log(err);
        return "[]";
    }
}
function updateFile(filepath, content) {
    try {
        return fs.writeFileSync(filepath, content);
    } catch (err) {
        console.error(err);
        return [];
    }
}
function deleteFile(filepath) {
    try {
        if(fileExist(filepath)) {
            fs.unlinkSync(filepath);
        }
    } catch (err) {
        console.error(err)
    }
}

function getPath(date) {
    return path.join(__dirname, '..', 'data', `${date}.json`);
}
async function getTodo(date) {
    return JSON.parse(FileContent(getPath(date)));
}
async function getTodoById(date, id) {
    let todoData = JSON.parse(FileContent(getPath(date)));
    for (let i = 0; i < todoData.length; i++) {
        if(todoData[i].id === id) {
            return todoData[i];
        }
    }
    return {};
}
async function createTodo(data) {
    let todo = {
        id: new Date(),
        title: data.todo.title,
        description: data.todo.description,
        isCompleted: false,
    };
    let todoData = JSON.parse(FileContent(getPath(data.date)));
    todoData.push(todo);
    updateFile(getPath(data.date), JSON.stringify(todoData, null, 4));
    return todo;
}
async function updateTodo(data) {
    let todoData = JSON.parse(FileContent(getPath(data.date)));
    for(let i = 0; i < todoData.length; i++) {
        if (todoData[i].id == data.todo.id) {
            if (data.todo.title != undefined) {
                todoData[i].title = data.todo.title;
            }
            if (data.todo.description != undefined) {
                todoData[i].description = data.todo.description;
            }
            if (data.todo.isCompleted != undefined) {
                todoData[i].isCompleted = data.todo.isCompleted;
            }
            updateFile(getPath(data.date), JSON.stringify(todoData, null, 4));
            return todoData[i];
        }
    }
    return {};
}
async function deleteTodo(date, id) {
    let todoData = JSON.parse(FileContent(getPath(date)));
    for (let i = 0; i < todoData.length; i++) {
        if (todoData[i].id == id) {
            todoData.splice(i, 1);
            updateFile(getPath(date), JSON.stringify(todoData, null, 4));
            if(todoData.length == 0) {
                deleteFile(getPath(date));
            }
            break;
        }
    }
    return {};
}

// get all todo
router.get('/get/:date', async (req, res) => {
    return res.json(await getTodo(req.params.date));
});

// get todo by id
router.get('/get/:date/:id', async (req, res) => {
    return res.json(await getTodoById(req.params.date, req.params.id));
});

// create todo
router.post('/create', async (req, res) => {
    return res.json(await createTodo(req.body.data));
});

// update todo by id
router.put('/update', async (req, res) => {
    return res.json(await updateTodo(req.body.data));
});

// delete todo by id
router.delete('/delete/:date/:id', async (req, res) => {
    return res.json(await deleteTodo(req.params.date, req.params.id));
});

module.exports.todoRouter = router;

/**
 * GET retrieves the representation of the resource at a specified URI. ...
 * PUT updates a resource at a specified URI. ...
 * POST creates a new resource. ...
 * DELETE deletes a resource at a specified URI.
 */