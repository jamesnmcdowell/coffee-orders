let form = document.querySelector("form");
let orderContainer = document.querySelector('.grid-container');
let api = 'https://dc-coffeerun.herokuapp.com/api/coffeeorders';

let getFormData = function () {
  let formData = {};
  for (element of form.elements) {
    if (element.type === "radio" && element.checked === true) {
      formData[element.name] = element.value;
    } else if (element.type !== 'radio' && element.nodeName !== "BUTTON" && !element.classList.contains('select-dropdown')) {
      formData[element.name] = element.value;
    }
  }
  return formData;
}

let postData = function (orderData) {
  $.post(api, orderData, function (response) {});
}

let getData = function (callback) {
  $.get(api, function (response) {
    let arryBackend =  Object.values(response);
    callback(arryBackend);    
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let formData = getFormData();
  postData(formData);
  getData(render);
});

let render = function (orderArry) { 
  orderContainer.querySelectorAll(":scope > div").forEach(e => e.remove());
  orderArry.forEach((card, i) => {
    let cardObj = createCard(card);
    orderContainer.appendChild(cardObj.card);

    let isNotLastIdx = i < orderArry.length - 1;
    let isNotFirstIdx = i !== 0;

    cardObj.cta1.addEventListener('click', function (event) {
      moveCard(isNotLastIdx, 1, i, orderArry);
      render(orderArry);
    });
    cardObj.cta2.addEventListener('click', function (event) {
      moveCard(isNotFirstIdx, -1, i, orderArry);
      render( orderArry);
    });

    cardObj.cta3.addEventListener('click', function (event) {
      setTimeout(deleteCard, 3000, cardObj.key, getData);
    });
  })
}

let deleteCard = function (key, callback) {
  console.log(callback);
  console.log(key);
  $.ajax({
    url: `${api}/${key}`,
    type: 'DELETE',
    success: function (result) {
      callback(render);
      console.log('deleted')
    }
  });
}

let moveCard = function (condition, direction, index, orderArry) {
  if (condition) {
    let currentCard = orderArry.splice(index, 1);
    orderArry.splice(index + direction, 0, currentCard[0]);
  }
}

let createCard = function (obj) {
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
}

document.addEventListener('DOMContentLoaded', function (event) {
  getData(render);
});


//  saveOrders();

//let saveOrders = function () {
//  localStorage.setItem("orderArr", JSON.stringify(orderArr));
//}
//document.addEventListener( 'DOMContentLoaded', function( event ) {
//  var getArray = localStorage.getItem("orderArr");
//  orderArr = (getArray) ? JSON.parse(getArray) : [];
//  render();
//});
