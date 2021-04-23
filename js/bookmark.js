(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* global CONFIG */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  var doSaveScroll = () => {
    localStorage.setItem('bookmark' + location.pathname, window.scrollY);
  };

  var scrollToMark = () => {
    var top = localStorage.getItem('bookmark' + location.pathname);
    top = parseInt(top, 10); // If the page opens with a specific hash, just jump out

    if (!isNaN(top) && location.hash === '') {
      // Auto scroll to the position
      window.anime({
        targets: document.scrollingElement,
        duration: 200,
        easing: 'linear',
        scrollTop: top
      });
    }
  }; // Register everything


  var init = function (trigger) {
    // Create a link element
    var link = document.querySelector('.book-mark-link'); // Scroll event

    window.addEventListener('scroll', () => link.classList.toggle('book-mark-link-fixed', window.scrollY === 0)); // Register beforeunload event when the trigger is auto

    if (trigger === 'auto') {
      // Register beforeunload event
      window.addEventListener('beforeunload', doSaveScroll);
      window.addEventListener('pjax:send', doSaveScroll);
    } // Save the position by clicking the icon


    link.addEventListener('click', () => {
      doSaveScroll();
      window.anime({
        targets: link,
        duration: 200,
        easing: 'linear',
        top: -30,
        complete: () => {
          setTimeout(() => {
            link.style.top = '';
          }, 400);
        }
      });
    });
    scrollToMark();
    window.addEventListener('pjax:success', scrollToMark);
  };

  init(CONFIG.bookmark.save);
});

},{}]},{},[1]);
