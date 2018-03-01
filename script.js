let form = document.querySelector("form");
let gridContainer = document.querySelector('.grid-container');
let orderArr = [];

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let orderObj = {};
  for (element of form.elements) {
    if (element.type === "radio" && element.checked === true) {
      orderObj[element.name] = element.value;
    } else if (element.type !== 'radio' && element.nodeName !== "BUTTON" && !element.classList.contains('select-dropdown')) {
      orderObj[element.name] = element.value;
    }
  }
  orderArr.push(orderObj);
  render();
});

let render = function () {
  document.querySelectorAll(".grid-item").forEach(e => e.remove());
  orderArr.forEach((obj, i) => {
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
    cardDiv.appendChild(cardWrapperDiv);

    cardTitle.classList.add("card-title");
    cardActionDiv.classList.add("card-action");
    cardContentDiv.classList.add("card-content");
    cardContentDiv.classList.add("white-text");
    cardWrapperDiv.classList.add("card");
    cardWrapperDiv.classList.add("blue-grey");
    cardWrapperDiv.classList.add("darken-1");
    cardDiv.classList.add("grid-item");

    cardTitle.textContent = obj.order;
    lastName.textContent = obj.lastName;
    email.textContent = obj.email;
    size.textContent = obj.size;
    flavor.textContent = obj.flavor;
    strength.textContent = obj.strength;
    cardAction1.textContent = "Delay";
    cardAction2.textContent = "Prioritize";
    cardAction3.textContent = "Delete";

    gridContainer.appendChild(cardDiv);

    cardAction1.addEventListener('click', function (event) {
      if (i < orderArr.length - 1) {
        let currentCard = orderArr.splice(i, 1);
        orderArr.splice(i + 1, 0, currentCard[0]);
        render();
      }
    });
      cardAction2.addEventListener('click', function (event) {
      if (i !== 0) {
        let currentCard = orderArr.splice(i, 1);
        orderArr.splice(i - 1, 0, currentCard[0]);
        render();
        console.log('yo!');
      }
    });
     cardAction3.addEventListener('click', function (event) {
      orderArr.splice(i, 1);
      render();
    });
  });
  saveOrders();
}

let saveOrders = function () {
  localStorage.setItem("orderArr", JSON.stringify(orderArr));
}

document.addEventListener( 'DOMContentLoaded', function( event ) {
  var getArray = localStorage.getItem("orderArr");
  orderArr = (getArray) ? JSON.parse(getArray) : [];
  render();
});
  