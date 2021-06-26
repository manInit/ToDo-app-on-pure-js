class ItemTask {
  constructor({id, text, completed}) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }

  getElement() {
    const rootItem = document.createElement('li');
    rootItem.classList.add('todo__item');
    rootItem.dataset.id = this.id;
    rootItem.innerHTML = `
    <div class="todo__toggle">
      <input class="todo__check" type="checkbox" ${this.completed ? "checked" : ""}>
      <span class="todo__badge"></span>
    </div>
    <div class="todo__text ${this.completed ? "todo__text_completed" : ""}">${this.text}</div>
    <input class="todo__input todo__input_task" type="text">
    <button class="todo__destroy"></button>`;
    
    return rootItem;
  }
}

export { ItemTask };