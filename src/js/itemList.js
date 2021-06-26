import { ItemTask } from "./itemTask";

class ItemList {
  constructor(tasks = []) {
    this._root = document.getElementsByClassName('todo__items')[0];
    this._todoNumberEl = document.getElementsByClassName('todo__number')[0];
    this._clearBtn = document.getElementsByClassName('todo__clear')[0];
    this.tasks = this._getTaskArrFromObjects(tasks);
    
    if (!localStorage.getItem('task-list'))
      this._updateList();
    else 
      this._loadStateFromStorage();
    window.addEventListener('hashchange', this._updateList.bind(this));
  }

  _getTaskArrFromObjects(listObj) {
    return listObj.map((taskObj, number) => new ItemTask({...taskObj, id: number}));
  }

  get completedCount() {
    return this.tasks.length - this.notCompletedCount;
  }

  get notCompletedCount() {
    return this.tasks.filter(taskObj => !taskObj.completed).length;
  }

  isAllCompleted() {
    return this.tasks.every(taskObj => taskObj.completed);
  }

  addTask(task) {
    this.tasks.push(new ItemTask({...task, id: this.tasks.length}));
    this._updateList();
  }

  deleteTask(id) {
    const removeIndex = this.tasks.map(task => task.id).indexOf(id);
    this.tasks.splice(removeIndex, 1);
    this._updateList();
  }

  deleteAllCompleted() {
    const idsCompleted = this.tasks.filter(task => task.completed).map(task => task.id);
    for (const id of idsCompleted)
      this.deleteTask(id);
    this._updateList();
  }

  toggleComplete(id) {
    const taskObj = this.tasks.find(task => task.id === id);
    taskObj.completed = !taskObj.completed;
    this._updateList();
  }

  changeStatusAll(isCompleted) {
    for (const taskObj of this.tasks) {
      taskObj.completed = isCompleted;
    }
    this._updateList();
  }

  makeAllCompleted() {
    this.changeStatusAll(true);
  }

  makeAllUncompleted() {
    this.changeStatusAll(false);
  }

  _checkBoxHandler(id) {
    this.toggleComplete(parseInt(id));
  }

  _deleteHandler(id) {
    this.deleteTask(parseInt(id));
  }

  _saveStateInStorage() {
    const json = JSON.stringify(this.tasks);
    localStorage.setItem('task-list', json);
  }
  
  _loadStateFromStorage() {
    const arrTask = JSON.parse(localStorage.getItem('task-list'));
    this.tasks = this._getTaskArrFromObjects(arrTask);
    this._updateList();
  }

  _updateList() {
    const filter = window.location.hash.slice(2).toLowerCase();
    let tasksList = [];
    switch(filter) {
      case 'all': tasksList = this.tasks; break;
      case 'active': tasksList = this.tasks.filter(task => !task.completed); break;
      case 'completed': tasksList = this.tasks.filter(task => task.completed); break;
      default: tasksList = this.tasks; break;
    }

    this._root.innerHTML = '';
    for (const task of tasksList) {
      const taskEl = task.getElement();
      const idTask = taskEl.dataset.id;
      taskEl.addEventListener('click', e => {
        e.preventDefault();
        const target = e.target;

        if (target.classList.contains('todo__destroy')) 
          this._deleteHandler.call(this, idTask);

        if (target.classList.contains('todo__check'))
          this._checkBoxHandler.call(this, idTask);
      });

      taskEl.addEventListener('dblclick', e => {
        e.preventDefault();
        const target = e.target;
        if (!target.classList.contains('todo__text')) return;
        const input = taskEl.getElementsByClassName('todo__input')[0]; 
        

        input.addEventListener('keypress', e => {
          if (e.key === 'Enter') {
            if (input.value === '') {
              this.deleteTask(idTask);
            } else {
              task.text = input.value;
              input.style.display = 'none';
              target.style.display = 'block';
            }
            this._updateList();
          } 
        });

        input.addEventListener('focusout', e => {
          input.style.display = 'none';
          target.style.display = 'block';
        });

        input.value = target.innerText;
        input.style.display = 'block';
        target.style.display = 'none';
        input.focus();
      });
      this._root.appendChild(taskEl);
    }
    this._todoNumberEl.innerText = this.notCompletedCount;
    if (this.completedCount > 0) this._clearBtn.style.display = 'block';
    else this._clearBtn.style.display = '';

    this._saveStateInStorage();
  }
}

export { ItemList };