let form = document.querySelector("form");
let orderContainer = document.querySelector('.grid-container');
let api = 'https://dc-coffeerun.herokuapp.com/api/coffeeorders';

let isValidElement = element => element.name && element.value;
let isValidValue = element => !['checkbox', 'radio'].includes(element.type) || element.checked;
let isCheckbox = element => element.type === 'checkbox';

let formToJSON = elements => [].reduce.call(elements, (data, element) => {
  if (isValidElement(element) && isValidValue(element)) {
    if (isCheckbox(element)) {
      data[element.name] = (data[element.name] || []).concat(element.value);
    } else {
      data[element.name] = element.value;
    }
  }
  return data;
}, {});

let handleFormSubmit = event => {
  event.preventDefault();
  console.log(form.elements);
  let data = formToJSON(form.elements);
  console.log(data);
  postData(data).then(getData).then(render);
};

form.addEventListener('submit', handleFormSubmit);

document.addEventListener('DOMContentLoaded', function (event) {
  getData().then(render);
});

let getData = () => {
  let newPromise = fetch(api)
    .then(response => response.json())
    .then(responseJson => Object.values(responseJson))
  return newPromise;
};

let postData = orderData => {
  return fetch(api, {
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
};

let render = orderArry => {
  orderContainer.querySelectorAll(":scope > div").forEach(e => e.remove());
  orderArry.forEach((card, i) => {
    let cardObj = createCard(card);
    orderContainer.appendChild(cardObj.card);

    let isNotLastIdx = i < orderArry.length - 1;
    let isNotFirstIdx = i !== 0;

    cardObj.cta1.addEventListener('click', event => {
      moveCard(isNotLastIdx, 1, i, orderArry);
      getData().then(render);
    });
    cardObj.cta2.addEventListener('click', event => {
      moveCard(isNotFirstIdx, -1, i, orderArry);
      getData().then(render);
    });

    cardObj.cta3.addEventListener('click', event => {
      let deletePromise = deleteCard(cardObj.key);
      delayFor(3000).then(deletePromise).then(getData).then(render)
    });
  })
};

let moveCard = function (condition, direction, index, orderArry) {
  if (condition) {
    console.log(`${direction}  ${index}  ${orderArry}  ${condition}`);
    let currentCard = orderArry.splice(index, 1);
    orderArry.splice(index + direction, 0, currentCard[0]);
  }
}
let delayFor = ms => new Promise(resolve => setTimeout(resolve, ms));

let deleteCard = function (key) {
  fetch(`${api}/${key}`, {
    method: 'DELETE'
  })
};

let createCard = obj => {
  let cardDiv = document.createElement('div');
  let cardWrapperDiv = document.createElement('div');
  let cardContentDiv = document.createElement('div');
  let cardTitle = document.createElement('span');
  let cardContentUl = document.createElement('ul');
  let cardActionDiv = document.createElement('div');
  let cardAction1 = document.createElement('a');
  let cardAction2 = document.createElement('a');
  let cardAction3 = document.createElement('a');

  let lastName = document.createElement('li');
  let email = document.createElement('li');
  let size = document.createElement('li');
  let flavor = document.createElement('li');
  let strength = document.createElement('li');

  cardContentUl.appendChild(lastName);
  cardContentUl.appendChild(email);
  cardContentUl.appendChild(size);
  cardContentUl.appendChild(flavor);
  cardContentUl.appendChild(strength);

  cardContentDiv.appendChild(cardTitle);
  cardContentDiv.appendChild(cardContentUl);
  cardActionDiv.appendChild(cardAction1);
  cardActionDiv.appendChild(cardAction2);
  cardActionDiv.appendChild(cardAction3);
  cardWrapperDiv.appendChild(cardContentDiv);
  cardWrapperDiv.appendChild(cardActionDiv);

  cardTitle.classList.add("card-title");
  cardActionDiv.classList.add("card-action");
  cardContentDiv.classList.add("card-content");
  cardContentDiv.classList.add("white-text");
  cardWrapperDiv.classList.add("card");
  cardWrapperDiv.classList.add("blue-grey");
  cardWrapperDiv.classList.add("darken-1");
  cardDiv.classList.add("grid-item");

  cardTitle.textContent = obj.coffee;
  lastName.textContent = obj.lastName;
  email.textContent = obj.emailAddress;
  size.textContent = obj.size;
  flavor.textContent = obj.flavor;
  strength.textContent = obj.strength;
  cardAction1.textContent = "Delay";
  cardAction2.textContent = "Prioritize";
  cardAction3.textContent = "Delete";

  let cardObj = {
    card: cardWrapperDiv,
    key: obj.emailAddress,
    cta1: cardAction1,
    cta2: cardAction2,
    cta3: cardAction3
  };

  return cardObj;
};