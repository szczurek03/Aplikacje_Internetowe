class Todo {
    constructor() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        } else {
            this.tasks = [
                { text: "chocolate", date: "" },
                { text: "macaroon", date: "" },
                { text: "chupa chups", date: "2026-10-03" },
                { text: "candy canes", date: "2026-01-05" },
                { text: "bon bons", date: "" }
            ];
        }

        this.listElement = document.getElementById('tasks');
        this.addbtn = document.getElementById('addbtn');
        this.newTaskInput = document.getElementById('task-text');
        this.dateInput = document.getElementById('task-date');
        this.searchbox = document.getElementById('searchbox');
        this.term = '';
        if (this.searchbox) {
            this.searchbox.addEventListener('input', (e) => {
                this.term = e.target.value || '';
                this.draw();
            });
        }

        this.addbtn.addEventListener('click', () => this.addTask());
        this.draw();
    }

    get filteredTasks() {
        const q = (this.term || '').toLowerCase().trim();
        if (q.length < 2) {
            return this.tasks.map((task, idx) => ({ task, index: idx }));
        }
        return this.tasks
            .map((task, idx) => ({ task, index: idx }))
            .filter(({ task }) => {
                return task.text && task.text.toLowerCase().includes(q);
            });
    }

    valid(text, date) {
        if (text.length < 3 || text.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków');
            return false;
        }
        if (date) {
            const today = new Date();
            const chosenDate = new Date(date);
            if (chosenDate <= today) {
                alert('Data musi być pusta albo w przyszłości');
                return false;
            }
        }
        return true;
    }

    addTask() {
        const text = this.newTaskInput.value.trim();
        const date = this.dateInput.value;

        if (this.valid(text, date)) {
            this.tasks.push({ text, date });
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.draw();
            this.newTaskInput.value = '';
            this.dateInput.value = '';
        }
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.draw();
    }

    modifyTask(index, textElement) {
        const task = this.tasks[index];
        const input = document.createElement('input');

        input.type = 'text';
        input.value = task.text;
        input.classList.add('edit-input');
        textElement.replaceWith(input);
        input.focus();
        input.addEventListener('blur', () => this.saveTask(index, input.value));
    }

    modifyDate(index, dateDisplay) {
        const task = this.tasks[index];
        const input = document.createElement('input');

        input.type = 'date';
        input.value = task.date || '';
        input.classList.add('edit-input');
        dateDisplay.replaceWith(input);
        input.focus();
        input.addEventListener('blur', () => this.saveDate(index, input.value));
    }

    saveTask(index, updatedText) {
        updatedText = updatedText.trim();

        if (this.valid(updatedText, this.tasks[index].date)) {
            this.tasks[index].text = updatedText;
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.draw();

        } else {
            this.draw();
        }
    }

    saveDate(index, updatedDate) {
        if (this.valid(this.tasks[index].text, updatedDate)) {
            this.tasks[index].date = updatedDate;
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.draw();
        } else {
            this.draw();
        }
    }

    draw() {
        this.listElement.innerHTML = '';
        const items = this.filteredTasks;
        
        for (let i = 0; i < items.length; i++) {
            const { task, index } = items[i];
            const li = document.createElement('li');
            li.className = 'task';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            li.appendChild(checkbox);

            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            let displayText = task.text;

            if (this.term.length >= 2) {
                const regex = new RegExp(`(${this.term})`, 'gi');
                displayText = task.text.replace(regex, '<b>$1</b>');
            }

            taskText.innerHTML = displayText;
            taskText.addEventListener('click', (e) => {
                e.stopPropagation();
                this.modifyTask(index, taskText);
            });
            li.appendChild(taskText);
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('task-date');

            if (task.date) {
                dateSpan.textContent = ` (${new Date(task.date).toLocaleDateString()})`;
            } else {
                dateSpan.textContent = '';
            }

            dateSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                this.modifyDate(index, dateSpan);
            });
            li.appendChild(dateSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delbtn';
            deleteBtn.type = 'button';
            deleteBtn.innerText = '🗑️';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(index);
            });
            li.appendChild(deleteBtn);

            this.listElement.appendChild(li);
        }
    }
}

const todo = new Todo();