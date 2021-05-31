{
    'use strict';
    const templates = {
      articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
      tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
      authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
      tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
      authorRightBarLink: Handlebars.compile(document.querySelector('#template-author-right-bar-link').innerHTML),
    };

    const opts = {
      tagSize: {
        count: 5,
        classPrefix: 'tag-size-',
      },
    };

    const select = {
      all:{
        articles: '.post',
        articlesActive: '.posts article.active',
        linksTo:{
          tagsActive: 'a.active[href^="#tag-"]',
          tags: '.post-tags a',
          tagsRightBar: '.sidebar .tags a',
          authors: '.post a',
          authorsRight: '.sidebar .authors a',
          authorsActive: '.post .post-author a.active',
          authorsActiveRight: '.sidebar .authors a.active',
          titles: '.titles a',
        },
      },
      article:{
        tags: '.post-tags .list',
        author: '.post .post-title',
        title: '.post-title',
      },
      listOf:{
        activeTitles: '.titles a.active',
        titles: '.titles',
        tags: '.sidebar .tags',
        authors: '.sidebar .authors',
      },
    };

    const titleClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;
        /* [DONE] remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll(select.listOf.activeTitles);
        for (let activeLink of activeLinks){
            activeLink.classList.remove('active');
        }
        /* [DONE] add class 'active' to the clicked link */
        clickedElement.classList.add('active');
        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll(select.all.articlesActive);
        for (let activeArticle of activeArticles){
            activeArticle.classList.remove('active');
        }
        /* [DONE] get 'href' attribute from the clicked link */
        const hrefAttribute = clickedElement.getAttribute('href');
        /* [DONE] find the correct article using the selector (value of 'href' attribute) */
        const correctArticle = document.querySelector(hrefAttribute);
        /* [DONE] add class 'active' to the correct article */
        correctArticle.classList.add('active');
    }

    const generateTitleLinks = function (customSelector = '') {
        /* remove contents of titleList */
        const titleList = document.querySelector(select.listOf.titles);
        titleList.innerHTML = '';
        /* for each article */
        const articles = document.querySelectorAll(select.all.articles + customSelector);
        for (let article of articles){
          /* [DONE] get the article id */
          const articleId = article.getAttribute('id');
          /* [DONE] find the title element and get the title from the title element */
          const articleTitle = article.querySelector(select.article.title).innerHTML;
          /* [DONE] create HTML of the link */
          const linkHTMLData = {
            id: articleId,
            title: articleTitle,
          };
          const linkHTML = templates.articleLink(linkHTMLData);
          /* [DONE] insert link into titleList */
          titleList.insertAdjacentHTML("beforeend", linkHTML);
        }
       const links = document.querySelectorAll(select.all.linksTo.titles);
       for (let link of links){
           link.addEventListener('click', titleClickHandler);
       }
    }

    const calculateTagsParams = function(allTags){
      const param = {min: 999999, max:0};
      for (let tag in allTags){
        param.min = Math.min(param['min'], allTags[tag]);
        param.max = Math.max(param['max'], allTags[tag]);
      }
      return param;
    }
    const calculateTagClass = function(count, params){
      const range = params.max - params.min,
            distance = count - params.min;
      for (let i = 1; i <= opts.tagSize.count; i++){
        if ((distance/range) <= (i/opts.tagSize.count)) {
          return opts.tagSize.classPrefix + i;
        }
      }
    }

    const generateTags = function (){
      /* [NEW] create a new variable allTags with an empty object */
      let allTags = {};
      /* [DONE] find all articles */
      const articles = document.querySelectorAll(select.all.articles);
      /* [DONE] START LOOP: for every article: */
      for (let article of articles){
        /* [DONE] find tags wrapper */
        const tagsList = article.querySelector(select.article.tags);
        /* [DONE] make html variable with empty string */
        let html = '';
        /* [DONE] get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        /* [DONE] split tags into array */
        const articleTagsSplit = articleTags.split(' ');
        /* [DONE] START LOOP: for each tag */
        for (let articleTag of articleTagsSplit) {
          /* [DONE] generate HTML of the link */
          const linkHTMLData = {
            tag: articleTag,
          };
          const linkHTML = templates.tagLink(linkHTMLData);
          /* [DONE] add generated code to html variable */
          html = html + linkHTML;
          /* [NEW] check if this link is NOT already in allTags */
          if(!allTags[articleTag]){
            /* [NEW] add generated code to allTags array */
            allTags[articleTag] = 1;
          } else {
            allTags[articleTag]++;
          }
        /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        tagsList.insertAdjacentHTML('beforeend', html);
      /* END LOOP: for every article: */
      }
      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector(select.listOf.tags);
      /* [NEW] calculate min and max amount of tags  */
      const tagsParams = calculateTagsParams(allTags);
      /* [NEW] create variable for all links HTML code */
      let allTagsData = {tags: []};
      /* [NEW] START LOOP: for each tag in allTags: */
      for (let tag in allTags) {
        /* [NEW] generate code of a link and add it to allTagsHTML */
          allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams),
        });
      }
      /* [NEW] END LOOP: for each tag in allTags: */

      /*[NEW] add HTML from allTagsHTML to tagList */
      tagList.innerHTML = templates.tagCloudLink(allTagsData);
    }

    const tagClickHandler = function (event){
      /* [DONE] prevent default action for this event */
      event.preventDefault();
      /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
      const clickedElement = this;
      /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
      const href = clickedElement.getAttribute('href');
      /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
      const tag = href.substr(5);
      /* [DONE] find all tag links with class active */
      const tagLinks = document.querySelectorAll(select.all.linksTo.tagsActive);
      /* [DONE] START LOOP: for each active tag link */
      for (let tagLink of tagLinks){
        /* [DONE] remove class active */
        tagLink.classList.remove('active');
      /* [DONE] END LOOP: for each active tag link */
      }
      /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
      const multiTagLinks = document.querySelectorAll('a[href="' + href + '"]');
      /* [DONE] START LOOP: for each found tag link */
      for (let multiTagLink of multiTagLinks){
        /* [DONE] add class active */
        multiTagLink.classList.add('active');
      /* [DONE] END LOOP: for each found tag link */
      }
      /* execute function "generateTitleLinks" with article selector as argument */
      generateTitleLinks('[data-tags~="' + tag + '"]');
    }

    const addClickListenersToTags = function (){
      /* [DONE] find all links to tags */
      const tagLinks = document.querySelectorAll(select.all.linksTo.tags);
      const tagLinksRight = document.querySelectorAll(select.all.linksTo.tagsRightBar);
      /* [DONE] START LOOP: for each link */
      for (let tagLink of tagLinks){
        /* [DONE] add tagClickHandler as event listener for that link */
        tagLink.addEventListener('click',tagClickHandler);
      /* [DONE] END LOOP: for each link */
      }
      for (let tagLinkRight of tagLinksRight){
        /* [DONE] add tagClickHandler as event listener for that link */
        tagLinkRight.addEventListener('click',tagClickHandler);
      /* [DONE] END LOOP: for each link */
      }
    }

    const generateAuthors = function() {
      /* [NEW] create a new variable allAuthors with an empty object */
      let allAuthors = {};
      /* [DONE] find author */
      const authors = document.querySelectorAll(select.all.articles);
      /* [DONE] START LOOP: for every author: */
      for (let author of authors){
        /* [DONE] find author wrapper */
        const authorList = author.querySelector(select.article.author);
        /* [DONE] get author from data-author attribute */
        const articleAuthor = author.getAttribute('data-author');
        /* [DONE] generate HTML of the link */
        const linkHTMLData = {
          author: articleAuthor,
        };
        const linkHTML = templates.authorLink(linkHTMLData);
        /* [NEW] check if this link is NOT already in allTags */
        if(!allAuthors[articleAuthor]){
          /* [NEW] add generated code to allTags array */
          allAuthors[articleAuthor] = 1;
        } else {
          allAuthors[articleAuthor]++;
        }
        /* insert HTML of all the links into the tags wrapper */
        authorList.insertAdjacentHTML('afterend', linkHTML);
      /* END LOOP: for every author: */
      }
      /* [NEW] find list of authors in right column */
      const authorList = document.querySelector(select.listOf.authors);
      /* [NEW] create variable for all links HTML code */
      const allAuthorsData = {authors: []};
      /* [NEW] START LOOP: for each tag in allTags: */
      for (let author in allAuthors){
      /* [NEW] generate code of a link and add it to allTagsHTML */
        allAuthorsData.authors.push({
          author: author,
          count: allAuthors[author],
        });
      }
      /* [NEW] END LOOP: for each tag in allTags: */

      /*[NEW] add HTML from allTagsHTML to tagList */
      authorList.innerHTML = templates.authorRightBarLink(allAuthorsData);
    }

    const authorClickHandler = function (event){
      /* [DONE] prevent default action for this event */
      event.preventDefault();
      /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
      const clickedElement = this;
      /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
      const href = clickedElement.getAttribute('href');
      /* [DONE] make a new constant "author" and extract tag from the "href" constant */
      const author = href.substr(1);
      /* [DONE] find all author links with class active */
      const authorLinks = document.querySelectorAll(select.all.linksTo.authorsActive);
      const authorLinksRight = document.querySelectorAll(select.all.linksTo.authorsActiveRight);
      /* [DONE] START LOOP: for each active author link */
      for (let authorLink of authorLinks){
        /* [DONE] remove class active */
        authorLink.classList.remove('active');
      /* [DONE] END LOOP: for each active author link */
      }
      for (let authorLink of authorLinksRight){
        /* [DONE] remove class active */
        authorLink.classList.remove('active');
      /* [DONE] END LOOP: for each active author link */
      }
      /* [DONE] find all author links with "href" attribute equal to the "href" constant */
      const multiAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
      /* [DONE] START LOOP: for each found author link */
      for (let multiAuthorLink of multiAuthorLinks){
        /* [DONE] add class active */
        multiAuthorLink.classList.add('active');
      /* [DONE] END LOOP: for each found author link */
      }
      /* execute function "generateTitleLinks" with author selector as argument */
      generateTitleLinks('[data-author="' + author + '"]');
    }

    const addClickListenersToAuthors = function (){
      /* [DONE] find all links to authors */
      const authorLinks = document.querySelectorAll(select.all.linksTo.authors);
      const authorLinksRight = document.querySelectorAll(select.all.linksTo.authorsRight);
      /* [DONE] START LOOP: for each link */
      for (let authorLink of authorLinks){
        /* [DONE] add tagClickHandler as event listener for that link */
        authorLink.addEventListener('click', authorClickHandler);
      /* [DONE] END LOOP: for each link */
      }
      for (let authorLink of authorLinksRight){
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
