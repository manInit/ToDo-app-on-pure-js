import '../styles/_todo.sass';
import { ItemList } from './itemList';

const input = document.getElementsByClassName('todo__input')[0];
const list = new ItemList();
const selectAllBtn = document.getElementsByClassName('todo__selectAll')[0];

selectAllBtn.addEventListener('click', e => {
  if (list.isAllCompleted())
    list.makeAllUncompleted(); 
  else 
    list.makeAllCompleted();
});

input.addEventListener('keypress', e => {
  if (input.value.trim() === '') return;
  if (e.key === 'Enter') {
    const newTask = {
      text: input.value.trim(),
      completed: false
    };
    list.addTask(newTask);
    input.value = '';
  }
});
