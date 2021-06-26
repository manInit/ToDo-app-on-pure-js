import { ItemTask } from "./itemTask";

class ItemList {
  constructor(tasks = []) {
    this._root = document.getElementsByClassName('todo__items')[0];
    this.tasks = tasks.map((taskObj, number) => new ItemTask({...taskObj, id: number}));
    this._updateList();
  }

  get notCompletedCount() {
    return this.tasks.filter(taskObj => taskObj.completed).length;
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
    this._root.innerHTML = '';
    for (const task of this.tasks) {
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
  }
}

export { ItemList };