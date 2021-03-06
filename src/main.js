//query selectors / global variables
var body = document.querySelector('body');
var inputTitle = document.querySelector('.idea-form-title');
var inputBody = document.querySelector('.idea-form-body');
var ideaCardsGrid = document.querySelector('.idea-cards');
var ideaForm = document.querySelector('form');
var saveButton = document.querySelector('.idea-form-button');
var hamburgerIcon = document.querySelector('.hamburger-icon');
var menuCloseIcon = document.querySelector('.menu-close-icon');
var menuDropDown = document.querySelector('.menu-dropdown')
var blanket = document.querySelector('.blanket')

var list = [];
//eventlisteners
body.addEventListener('click', clickHandler);
body.addEventListener('keyup', keyupHandler);
window.onload = function() {
  disableEnableButton();
  displayIdeaCards();
}
//functions
function clickHandler(event){
    if(event.target.classList.contains('idea-form-button')){
      saveIdea();
    }
    if (event.target.classList.contains('hamburger-icon')){
      displayDropDown();
    }
    if(event.target.classList.contains('menu-close-icon')){
      closeDropDown();
    }
    if(event.target.classList.contains('delete-icon')){
      deleteIdea();
    }
    if(event.target.classList.contains('star-icon')){
      toggleFavoriteCard();
    }
};

function keyupHandler(event){
  if(event.target === inputTitle || event.target === inputBody){
    disableEnableButton();
  }
};

function saveIdea(){
  event.preventDefault();
  var currentIdea = new Idea(inputTitle.value, inputBody.value);
  list.push(currentIdea);
  currentIdea.saveToStorage(currentIdea);
  displayIdeaCards();
  ideaForm.reset();
  disableEnableButton();
}

function deleteIdea(){
  if(event.target.closest(".idea-card")){
    var target = event.target.closest(".idea-card");
    ideaCardsGrid.removeChild(target);
    for(var i = 0; i < list.length; i++){
      if (target.getAttribute("id") == list[i].id) {
        list[i].deleteFromStorage(target);
        list.splice(i, 1);
      };
    };
  };
};

function toggleFavoriteCard(){
  var target = event.target.closest(".idea-card")
  if(event.target.src.includes('star.svg')) {
    event.target.src = './src/icons/star-active.svg';
    for(var i = 0; i < list.length; i++){
      if(target.getAttribute("id") == list[i].id) {
        var updateIdeaCard = new Idea(list[i].title, list[i].body, true);
        updateIdeaCard.id = list[i].id;
        list[i].star = true;
        list[i].updateIdea(updateIdeaCard);
      }
    }
  } else {
    event.target.src = './src/icons/star.svg'
    for(var i = 0; i < list.length; i++){
      if(target.getAttribute("id") == list[i].id) {
        var updateIdeaCard = new Idea(list[i].title, list[i].body);
        updateIdeaCard.id = list[i].id;
        list[i].star = false;
        list[i].updateIdea(updateIdeaCard);
      }
    }
  }
}

function displayIdeaCards(){
  if (localStorage.length > 0) {
    list = [];
    for (var i = 0; i < localStorage.length; i++) {
      var retrievedIdeaCard = localStorage.getItem(`${Object.keys(localStorage)[i]}`);
      var parsedIdeaCard = JSON.parse(retrievedIdeaCard);
      var rebuildIdeaCard = new Idea(parsedIdeaCard.title, parsedIdeaCard.body, parsedIdeaCard.star);
      rebuildIdeaCard.id = parsedIdeaCard.id;
      console.log(rebuildIdeaCard);
      list.push(rebuildIdeaCard);
    }
  }
  ideaCardsGrid.innerHTML = '';
  for (var i = 0; i < list.length; i++){
    var imgCardSrc = "";
    if(list[i].star == true){
      imgCardSrc = `src="./src/icons/star-active.svg"`
    } else {
      imgCardSrc = `src="./src/icons/star.svg"`
    }
    var ideaCard = `
      <article id="${list[i].id}" class="idea-card">
        <section class="idea-card-header">
          <img class="star-icon" ${imgCardSrc} alt="favorite Card">
          <img class="delete-icon" src="./src/icons/delete.svg" alt="Delete Card">
        </section>
        <section class="idea-card-body">
          <h3 class="idea-title">
            ${list[i].title}
          </h3>
          <p class="idea-body">
            ${list[i].body}
          </p>
        </section>
        <section class="idea-card-footer">
          <img class="add-icon" src="./src/icons/comment.svg" alt="Comment Icon">
          <p class="comment">Comment</p>
        </section>
      </article>
    `;
    ideaCardsGrid.insertAdjacentHTML("afterbegin", ideaCard);
  }
}

function disableEnableButton(){
  if (!inputTitle.value.trim() || !inputBody.value.trim()){
    saveButton.disabled = true;
  } else {
    saveButton.disabled = false;
  }
};

function displayDropDown(){
  menuDropDown.classList.remove('hidden');
  blanket.classList.remove('hidden');
}

function closeDropDown(){
  menuDropDown.classList.add('hidden');
  blanket.classList.add('hidden');
}
