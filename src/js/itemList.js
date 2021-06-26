import { ItemTask } from "./itemTask";

class ItemList {
  constructor(tasks = []) {
    this._root = document.getElementsByClassName('todo__items')[0];
    this._todoNumberEl = document.getElementsByClassName('todo__number')[0];
    this._clearBtn = document.getElementsByClassName('todo__clear')[0];
    this.tasks = tasks.map((taskObj, number) => new ItemTask({...taskObj, id: number}));
    this._updateList();

    window.addEventListener('hashchange', this._updateList.bind(this));
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

  _updateList() {
    const filter = window.location.hash.slice(2).toLowerCase();
    let tasksList = [];
    switch(filter) {
      case 'all': tasksList = this.tasks; break;
      case 'active': tasksList = this.tasks.filter(task => !task.completed); break;
      case 'completed': tasksList = this.tasks.filter(task => task.completed); break;
    }

    this._root.innerHTML = '';
    for (const task of tasksList) {
      const taskEl = task.getElement();
      taskEl.addEventListener('click', e => {
        e.preventDefault();
        const idTask = taskEl.dataset.id;
        const target = e.target;

        if (target.classList.contains('todo__destroy')) 
          this._deleteHandler.call(this, idTask);

        if (target.classList.contains('todo__check'))
          this._checkBoxHandler.call(this, idTask);
      });
      this._root.appendChild(taskEl);
    }
    this._todoNumberEl.innerText = this.notCompletedCount;
    if (this.completedCount > 0) this._clearBtn.style.display = 'block';
    else this._clearBtn.style.display = '';
  }
}

export { ItemList };