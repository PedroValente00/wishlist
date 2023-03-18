const form = document.querySelector('#form') as HTMLFormElement;
const formInputs = form?.querySelectorAll('input');
const title = document.querySelector('#title') as HTMLInputElement;
const description = document.querySelector('#description') as HTMLInputElement;
const displaySection = document.querySelector('#display-section');

const removeCard = (e:Event) => {
  e.stopPropagation();
  const btn = e.target as HTMLInputElement;
  const card = btn.parentElement?.parentElement;
  const cardTitle = card?.firstChild?.firstChild?.textContent;
  card?.remove();
  const stateObj = JSON.parse(localStorage.getItem('list') || '[]');
  if (cardTitle) {
    delete stateObj[cardTitle];
    localStorage.setItem('list', JSON.stringify(stateObj));
  }
};

const markDone = (e:Event) => {
  const card = e.target as HTMLElement;
  const button = card.children[1].children[0] as HTMLInputElement;
  if (card.classList.contains('list__item--not-completed')) {
    card.classList.add('list__item--completed');
    card.classList.remove('list__item--not-completed');
    button.classList.toggle('button--not-done');
  } else {
    card.classList.add('list__item--not-completed');
    card.classList.remove('list__item--completed');
    button.classList.toggle('button--not-done');
  }
};

const appendData = (titleVal:string, descriptionVal:string) => {
  const article = document.createElement('article');
  const leftSideDiv = document.createElement('div');
  const rightSideDiv = document.createElement('div');
  const newItem = document.createElement('p');
  const newDescription = document.createElement('p');
  const deleteButton = document.createElement('button');
  article.classList.add('card');
  article.setAttribute('data-testid', 'cardItem');
  article.classList.add('list__item--not-completed');
  newItem.classList.add('card__item');
  newDescription.classList.add('card__description');
  deleteButton.classList.add('card__button');
  newItem.textContent = titleVal;
  deleteButton.textContent = 'remove';
  newDescription.textContent = descriptionVal;
  displaySection?.appendChild(article);
  article.appendChild(leftSideDiv);
  article.appendChild(rightSideDiv);
  leftSideDiv.classList.add('card__div-left');
  rightSideDiv.classList.add('card__div-right');
  leftSideDiv.appendChild(newItem);
  leftSideDiv.appendChild(newDescription);
  rightSideDiv.appendChild(deleteButton);
  article.addEventListener('click', e => markDone(e));
  deleteButton.classList.add('button--not-done');
  deleteButton.setAttribute('data-testid', 'btnDeleteCard');
  deleteButton.addEventListener('click', e => removeCard(e));
};

const displayData = () => {
  const rawData = localStorage.getItem('list');
  const data = JSON.parse(rawData || '{}');
  Object.entries(data).forEach(el => {
    const titleVal = el[0];
    const descriptionVal = String(el[1]);
    appendData(titleVal, descriptionVal);
  });
};

const resetForm = () => {
  formInputs.forEach(input => {
    const resetInput = input;
    resetInput.value = '';
    input.blur();
  });
};
form?.addEventListener('submit', e => {
  e.preventDefault();
  const rawData = localStorage.getItem('list');
  const dataObj = JSON.parse(rawData || '{}');
  dataObj[title.value] = description.value;
  localStorage.setItem('list', JSON.stringify(dataObj));
  // if the item already exists, it will update the previous one
  const cardTitles = document.querySelectorAll('.card__item');
  const arr = [...cardTitles];
  const match = arr.find(p => p.textContent === title.value);
  if (match) {
    match.nextElementSibling!.textContent = description.value;
  } else {
    appendData(title.value, description.value);
  }
  resetForm();
});

window.addEventListener('load', displayData);