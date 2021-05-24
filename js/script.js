{
    'use strict';

    const optArticleSelector = '.post',
          optTitleSelector = '.post-title',
          optTitleListSelector = '.titles',
          optAuthorSelector = '.post .post-title',
          optArticleTagsSelector = '.post-tags .list';

    const titleClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;
        console.log('Link was clicked!');
        console.log(event);

        /* [DONE] remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');
        for (let activeLink of activeLinks){
            activeLink.classList.remove('active');
        }
        /* [DONE] add class 'active' to the clicked link */
        console.log('clickedElement:', clickedElement);
        //console.log('clickedElement (with plus): ' + clickedElement);
        clickedElement.classList.add('active');

        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts article.active');
        for (let activeArticle of activeArticles){
            activeArticle.classList.remove('active');
        }
        /* [DONE] get 'href' attribute from the clicked link */
        const hrefAttribute = clickedElement.getAttribute('href').substr(1);

        /* [DONE] find the correct article using the selector (value of 'href' attribute) */

       // const correctArticle = document.querySelector('.posts article[id=hrefAttribute]');
        const correctArticle = document.getElementById(hrefAttribute);

        /* [DONE] add class 'active' to the correct article */
        correctArticle.classList.add('active');
    }

    const generateTitleLinks = function (customSelector = '') {

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        //console.log('xxxx ', customSelector);
        //console.log('xxxx ', optArticleSelector);
        for (let article of articles){
          /* [DONE] get the article id */
          const articleId = article.getAttribute('id');
          /* [DONE] find the title element and get the title from the title element */
          const articleTitle = article.querySelector(optTitleSelector).innerHTML;
          /* [DONE] create HTML of the link */
          const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
          /* [DONE] insert link into titleList */
          titleList.insertAdjacentHTML("beforeend", linkHTML);
        }

       const links = document.querySelectorAll('.titles a');
       for (let link of links){
           link.addEventListener('click', titleClickHandler);
       }
    }


    const generateTags = function (){
      /* [DONE] find all articles */
      const articles = document.querySelectorAll(optArticleSelector);
      //console.log('Article list ', articles);
      /* [DONE] START LOOP: for every article: */

      for (let article of articles){
        /* [DONE] find tags wrapper */
        const tagsList = article.querySelector(optArticleTagsSelector);
        //console.log('Tag list: ', tagsList);
        /* [DONE] make html variable with empty string */
        let html = '';
        /* [DONE] get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        //console.log('Data tags: ', articleTags);
        /* [DONE] split tags into array */
        const articleTagsSplit = articleTags.split(' ');
        //console.log('Split: ', articleTagsSplit);
        /* [DONE] START LOOP: for each tag */
        for (let articleTag of articleTagsSplit) {
          /* [DONE] generate HTML of the link */
          const linkHTML = '<li><a href="#tag-' + articleTag + '">' + articleTag + '</a></li>';
          /* [DONE] add generated code to html variable */
          html = html + linkHTML;
        /* END LOOP: for each tag */
        }
        //console.log('Link Html: ', html);
        /* insert HTML of all the links into the tags wrapper */
        tagsList.insertAdjacentHTML('beforeend', html);
        //console.log('Wraper: ', tagsList);
      /* END LOOP: for every article: */
      }
    }


    const tagClickHandler = function (event){
      console.log('Klik na tag');
      console.log(event);
      /* [DONE] prevent default action for this event */
      event.preventDefault();
      /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
      const clickedElement = this;
      /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
      const href = clickedElement.getAttribute('href');
      console.log('Href clicked link: ', href);
      /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
      const tag = href.substr(5);
      console.log('Tag: ', tag);
      /* [DONE] find all tag links with class active */
      const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
      console.log('Tag with active links: ', tagLinks);
      /* [DONE] START LOOP: for each active tag link */
      for (let tagLink of tagLinks){
        /* [DONE] remove class active */
        tagLink.classList.remove('active');
      /* [DONE] END LOOP: for each active tag link */
      }
      /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
      const multiTagLinks = document.querySelectorAll('a[href="' + href + '"]');
      console.log('Tags same like clicked: ', multiTagLinks);
      /* [DONE] START LOOP: for each found tag link */
      for (let multiTagLink of multiTagLinks){
        /* [DONE] add class active */
        multiTagLink.classList.add('active');
        console.log('Links with class active: ', multiTagLink);
      /* [DONE] END LOOP: for each found tag link */
      }
      /* execute function "generateTitleLinks" with article selector as argument */
      generateTitleLinks('[data-tags~="' + tag + '"]');
    }

    const addClickListenersToTags = function (){
      /* [DONE] find all links to tags */
      const tagLinks = document.querySelectorAll('.post-tags a');
      /* [DONE] START LOOP: for each link */
      for (let tagLink of tagLinks){
        /* [DONE] add tagClickHandler as event listener for that link */
        tagLink.addEventListener('click',tagClickHandler);
      /* [DONE] END LOOP: for each link */
      }
    }

    const generateAuthors = function() {
      /* [DONE] find author */
      const authors = document.querySelectorAll(optArticleSelector);
      //console.log('Autors ', authors);
      /* [DONE] START LOOP: for every author: */
      for (let author of authors){
        /* [DONE] find author wrapper */
        const authorList = author.querySelector(optAuthorSelector);
        //console.log('Tag list: ', authorList);
        /* [DONE] get author from data-author attribute */
        const articleAuthor = author.getAttribute('data-author');
        //console.log('Data tags: ', articleAuthor);
        /* [DONE] generate HTML of the link */
        const linkHTML = '<p><a href="#' + articleAuthor + '" class="post-author">by ' + articleAuthor + '</a></p>';
        /* insert HTML of all the links into the tags wrapper */
        authorList.insertAdjacentHTML('afterend', linkHTML);
        //console.log('Wraper: ', authorList);
      /* END LOOP: for every author: */
      }
    }

    const authorClickHandler = function (event){
      console.log('Klik na AUTHOR');
      //console.log(event);
      /* [DONE] prevent default action for this event */
      event.preventDefault();
      /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
      const clickedElement = this;
      /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
      const href = clickedElement.getAttribute('href');
      console.log('Href clicked link: ', href);
      /* [DONE] make a new constant "author" and extract tag from the "href" constant */
      const author = href.substr(1);
      console.log('Author: ', author);
      /* [DONE] find all author links with class active */
      const authorLinks = document.querySelectorAll('.post a.active:first-child[href^="#"]');
      console.log('Author with active links: ', authorLinks);
      /* [DONE] START LOOP: for each active author link */
      for (let authorLink of authorLinks){
        /* [DONE] remove class active */
        authorLink.classList.remove('active');
      /* [DONE] END LOOP: for each active author link */
      }
      /* [DONE] find all author links with "href" attribute equal to the "href" constant */
      const multiAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
      console.log('Author same like clicked: ', multiAuthorLinks);
      /* [DONE] START LOOP: for each found author link */
      for (let multiAuthorLink of multiAuthorLinks){
        /* [DONE] add class active */
        multiAuthorLink.classList.add('active');
        console.log('Links with class active: ', multiAuthorLink);
      /* [DONE] END LOOP: for each found author link */
      }
      /* execute function "generateTitleLinks" with author selector as argument */
      generateTitleLinks('[data-author="' + author + '"]');
    }


    const addClickListenersToAuthors = function (){
      /* [DONE] find all links to authors */
      const authorLinks = document.querySelectorAll('.post a');
      //console.log('Author link: ', authorLinks);
      /* [DONE] START LOOP: for each link */
      for (let authorLink of authorLinks){
        /* [DONE] add tagClickHandler as event listener for that link */
        authorLink.addEventListener('click', authorClickHandler);
      /* [DONE] END LOOP: for each link */
      }
    }



    generateTitleLinks();

    generateTags();

    generateAuthors();

    addClickListenersToAuthors();

    addClickListenersToTags();
}
