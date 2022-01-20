{
  'use strict';

  const select = {
    template : {
      bookTemplate: '#template-book',
    },
    booksPanel : {
      booksList :'.books-list',
      bookImage : 'book__image',
      filters : '.filters',
    }
  };

  const templates = {
    bookList: Handlebars.compile(document.querySelector(select.template.bookTemplate).innerHTML),
  };
  
  class BooksList {
    constructor() {
      const thisBooksList = this;
      thisBooksList.initData();
      thisBooksList.render();
      thisBooksList.initActions();
      
    }
      
  
    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
      thisBooksList.filters = [];
      thisBooksList.favoriteBooks = [];
    }

    render () {
      const thisBooksList = this;
      
      for (let book of thisBooksList.data){
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.bookList(book);
        //console.log(generatedHTML);
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        const list = document.querySelector(select.booksPanel.booksList);
        list.appendChild(generatedDOM);
      }
    }
 
    initActions() {
      const thisBooksList = this;     
      const list = document.querySelector(select.booksPanel.booksList);

      list.addEventListener('dblclick', function(event){
        event.preventDefault();

        const clickedElementParent = event.target.offsetParent;
        if(clickedElementParent.classList.contains(select.booksPanel.bookImage)){
          const clickId = clickedElementParent.getAttribute('data-id');
          if(!thisBooksList.favoriteBooks.includes(clickId)){
            clickedElementParent.classList.add('favorite');
            thisBooksList.favoriteBooks.push(clickId);
          }
          else{
            clickedElementParent.classList.remove('favorite');
            const elem = thisBooksList.favoriteBooks.indexOf(clickId);
            thisBooksList.favoriteBooks.splice(elem, 1);
          }
        }
      });

      const formFilter = document.querySelector(select.booksPanel.filters);
      formFilter.addEventListener('click',function(event){
        const clickedElement = event.target;
        if(clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter'){
          console.log(clickedElement.value);
          if(clickedElement.checked){
            thisBooksList.filters.push(clickedElement.value);
            console.log(thisBooksList.filters);
          }
          else{
            const elem = thisBooksList.filters.indexOf(clickedElement.value);
            thisBooksList.filters.splice(elem, 1);
          }
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks() {
      const thisBooksList = this; 
      for (let book of dataSource.books){
        let shouldBeHidden = false;
        for (const filter of thisBooksList.filters){
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden == true){
          document.querySelector(`.book__image[data-id="${book.id}"]`).classList.add('hidden');
        } else {
          document.querySelector(`.book__image[data-id="${book.id}"]`).classList.remove('hidden');
        }
      }
    }

    determineRatingBgc (rating) {
      let background = '';
      if (rating<=6) background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      else if (rating > 6 && rating <= 8) background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      else if (rating > 8 && rating <= 0) background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      else if (rating > 9) background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      return background;
    }
  }
  const app = new BooksList();
}