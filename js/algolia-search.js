(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* global instantsearch, algoliasearch, CONFIG */
document.addEventListener('DOMContentLoaded', () => {
  const algoliaSettings = CONFIG.algolia;
  const {
    indexName,
    appID,
    apiKey
  } = algoliaSettings;
  let search = instantsearch({
    indexName,
    searchClient: algoliasearch(appID, apiKey),
    searchFunction: helper => {
      let searchInput = document.querySelector('.search-input');

      if (searchInput.value) {
        helper.search();
      }
    }
  });
  window.pjax && search.on('render', () => {
    window.pjax.refresh(document.getElementById('algolia-hits'));
  }); // Registering Widgets

  search.addWidgets([instantsearch.widgets.configure({
    hitsPerPage: algoliaSettings.hits.per_page || 10
  }), instantsearch.widgets.searchBox({
    container: '.search-input-container',
    placeholder: algoliaSettings.labels.input_placeholder,
    // Hide default icons of algolia search
    showReset: false,
    showSubmit: false,
    showLoadingIndicator: false,
    cssClasses: {
      input: 'search-input'
    }
  }), instantsearch.widgets.stats({
    container: '#algolia-stats',
    templates: {
      text: data => {
        let stats = algoliaSettings.labels.hits_stats.replace(/\$\{hits}/, data.nbHits).replace(/\$\{time}/, data.processingTimeMS);
        return `${stats}
            <span class="algolia-powered">
              <img src="${CONFIG.root}images/algolia_logo.svg" alt="Algolia">
            </span>
            <hr>`;
      }
    }
  }), instantsearch.widgets.hits({
    container: '#algolia-hits',
    templates: {
      item: data => {
        let link = data.permalink ? data.permalink : CONFIG.root + data.path;
        return `<a href="${link}" class="algolia-hit-item-link">${data._highlightResult.title.value}</a>`;
      },
      empty: data => {
        return `<div id="algolia-hits-empty">
              ${algoliaSettings.labels.hits_empty.replace(/\$\{query}/, data.query)}
            </div>`;
      }
    },
    cssClasses: {
      item: 'algolia-hit-item'
    }
  }), instantsearch.widgets.pagination({
    container: '#algolia-pagination',
    scrollTo: false,
    showFirst: false,
    showLast: false,
    templates: {
      first: '<i class="fa fa-angle-double-left"></i>',
      last: '<i class="fa fa-angle-double-right"></i>',
      previous: '<i class="fa fa-angle-left"></i>',
      next: '<i class="fa fa-angle-right"></i>'
    },
    cssClasses: {
      root: 'pagination',
      item: 'pagination-item',
      link: 'page-number',
      selectedItem: 'current',
      disabledItem: 'disabled-item'
    }
  })]);
  search.start(); // Handle and trigger popup window

  document.querySelectorAll('.popup-trigger').forEach(element => {
    element.addEventListener('click', () => {
      document.body.style.overflow = 'hidden';
      document.querySelector('.search-pop-overlay').classList.add('search-active');
      document.querySelector('.search-input').focus();
    });
  }); // Monitor main search box

  const onPopupClose = () => {
    document.body.style.overflow = '';
    document.querySelector('.search-pop-overlay').classList.remove('search-active');
  };

  document.querySelector('.search-pop-overlay').addEventListener('click', event => {
    if (event.target === document.querySelector('.search-pop-overlay')) {
      onPopupClose();
    }
  });
  document.querySelector('.popup-btn-close').addEventListener('click', onPopupClose);
  window.addEventListener('pjax:success', onPopupClose);
  window.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      onPopupClose();
    }
  });
});

},{}]},{},[1]);
