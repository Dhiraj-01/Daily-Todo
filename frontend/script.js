$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})

let todoEle = {
    titleEle: document.getElementById("todo-title"),
    descriptionEle: document.getElementById("todo-description"),
    dateEle: document.getElementById("todo-date"),
};
todoEle.dateEle.valueAsDate = new Date();

let searchEle = document.getElementById("todo-search");
let listEle = document.getElementById("todo-list");

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1">$1</a>')
}

const url = "http://localhost:3000/api/todo";
const urls = {
    get: `${url}/get`,
    create: `${url}/create`,
    update: `${url}/update`,
    delete: `${url}/delete`,
};

function deleteTODO(id) {
    let date = todoEle.dateEle.value;
    deleteTodo(`${urls.delete}/${date}/${id}`).then(data => {
        getTodoByDate();
    });
}
function updateTODO(id, isCompleted) {
    let data = {
        data: {
            date: `${todoEle.dateEle.value}`,
            todo: {
                id: id,
                isCompleted: isCompleted
            }
        }
    };
    console.log(data);
    if (data.data.todo.title != "") {
        updateTodo(`${urls.update}`, data).then(data => {
            getTodoByDate();
        });
    }
}

function generateTodos(todo) {
    let res = "";
    if(todo) {
        todo.forEach(t => {
            if (t.isCompleted) {
                res += `
                <li class="list-group-item op-60">
                    <div class="row">
                        <div class="ml-2 mr-2">
                            <input type="checkbox" class="checkbox-round"
                            data-toggle="tooltip" data-placement="top" title="completed ?" id="${t.id}" onchange="updateTODO(this.id, this.checked)" checked>
                        </div>
                        <div class="col">
                            ${urlify(t.title)}
                            <div>
                                <small>
                                    ${urlify(t.description)}
                                </small>
                            </div>
                        </div>
                        <div class="text-right">
                            <label>
                                <i class="fas fa-trash fa-lg ml-3 mr-2" data-toggle="tooltip" data-placement="top" title="delete" class="pointer" id=${t.id} onclick="deleteTODO(this.id)"> </i>
                            </label>
                        </div>
                    </div>
                </li>
                `;
            }
            else {
                res += `
                <li class="list-group-item">
                    <div class="row">
                        <div class="ml-2 mr-2">
                            <input type="checkbox" class="checkbox-round"
                            data-toggle="tooltip" data-placement="top" title="completed ?" id="${t.id}" onchange="updateTODO(this.id, this.checked)">
                        </div>
                        <div class="col">
                            ${urlify(t.title)}
                            <div>
                                <small>
                                    ${urlify(t.description)}
                                </small>
                            </div>
                        </div>
                        <div class="text-right">
                            <label>
                                <i class="fas fa-trash fa-lg ml-3 mr-2" data-toggle="tooltip" data-placement="top" title="delete" class="pointer" id=${t.id} onclick="deleteTODO(this.id)"> </i>
                            </label>
                        </div>
                    </div>
                </li>
                `;
            }
        });
        listEle.innerHTML = res;
    }
}

function getTodoByDate() {
    let date = todoEle.dateEle.value;
    getTodo(`${urls.get}/${date}`).then(data => {
        generateTodos(data);
    });
}
getTodoByDate();

function addTodo() {
    let data = {
        data: {
            date: `${todoEle.dateEle.value}`,
            todo: {
                title: `${todoEle.titleEle.value}`,
                description: `${todoEle.descriptionEle.value}`,
            }
        }
    };
    todoEle.titleEle.value = "";
    todoEle.descriptionEle.value = "";

    if(data.data.todo.title != "") {
        createTodo(urls.create, data).then(data => {
            getTodoByDate();
        });
    }
}

function filter() {
    let query = searchEle.value;
    query = query.toLowerCase().trim();
    let terms = query.split(' ');

    let date = todoEle.dateEle.value;
    getTodo(`${urls.get}/${date}`).then(data => {
        let searchData = [];
        data.forEach(todo => {
            terms.forEach(term => {
                if (todo.title.toLowerCase().includes(term)) {
                    searchData.push(todo);
                    return;
                }
            });
        });
        generateTodos(searchData);
    });
}