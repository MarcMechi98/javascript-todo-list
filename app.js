//Loading up the page
window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);

    });

    // Getting Json Code from the database
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        }

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        e.target.reset();

        displayTodos();
    });

    displayTodos();
});

//Making the todo list show up
function displayTodos() {
    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';

    //Sorting the todos by date
    todos.sort((a, b) => b.createdAt - a.createdAt);

    todos.forEach(todo => {
        //Creating the elements
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        //Checking if it's already done
        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');

        //Checking the todo category
        if (todo.category === 'personal') {
            span.classList.add('personal');
        }
        span.classList.add('business');

        //Todo content
        content.classList.add('todo-content');
        actions.classList.add('actions');
        editButton.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}"
         readonly>`;
        editButton.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        //Appending the new elements
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);
        todoList.appendChild(todoItem);

        //Crossing out completed todos
        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('click', e => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if (todo.done) {
                todoItem.classList.add('done');
            }
            todoItem.classList.remove('done');
            displayTodos();
        })

        //Making the "edit" button work
        editButton.addEventListener('click', e => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();

            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                displayTodos();
            });
        });

        //Making the "delete" button work
        deleteButton.addEventListener('click', e => {
            todos = todos.filter(t => t !== todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            displayTodos();
        });
    });
}