/* Making sure my code runs after the page is loaded */
$(document).ready(function() {

  /* Array of images to be shuffled into the matching game */
  var images = ['<img class="card-front" id="0" src="imgs/card_front_1.png" alt="card front: A simple outline of an eye">',
    '<img class="card-front" id="1" src="imgs/card_front_2.png" alt="card front: A simple outline of a camera">',
    '<img class="card-front" id="2" src="imgs/card_front_3.png" alt="card front: A simple outline of a clock">',
    '<img class="card-front" id="3" src="imgs/card_front_4.png" alt="card front: A simple outline of a music note">',
    '<img class="card-front" id="4" src="imgs/card_front_5.png" alt="card front: A simple bee">',
    '<img class="card-front" id="5" src="imgs/card_front_6.png" alt="card front: A simple tube television">',
    '<img class="card-front" id="6" src="imgs/card_front_7.png" alt="card front: A simple suitcase">',
    '<img class="card-front" id="7" src="imgs/card_front_8.png" alt="card front: A simple game controller">',
    '<img class="card-front" id="8" src="imgs/card_front_1.png" alt="card front: A simple outline of an eye">',
    '<img class="card-front" id="9" src="imgs/card_front_2.png" alt="card front: A simple outline of a camera">',
    '<img class="card-front" id="10" src="imgs/card_front_3.png" alt="card front: A simple outline of a clock">',
    '<img class="card-front" id="11" src="imgs/card_front_4.png" alt="card front: A simple outline of a music note">',
    '<img class="card-front" id="12" src="imgs/card_front_5.png" alt="card front: A simple bee">',
    '<img class="card-front" id="13" src="imgs/card_front_6.png" alt="card front: A simple tube television">',
    '<img class="card-front" id="14" src="imgs/card_front_7.png" alt="card front: A simple suitcase">',
    '<img class="card-front" id="15" src="imgs/card_front_8.png" alt="card front: A simple game controller">'
  ]

  /* below is the Fisher-Yates Shuffle, which was the primary result
  when I looked up the most efficient means to shuffle an array. */
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  /* below places the now randomized images into my DOM */
  function addImages() {
    shuffle(images);
    $('.card-slot').each(function(i) {
      $(this).append(images[i]);
    });
  };

  /* mask to appear behind popup windows */
  function popupMask() {
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    $('.mask').css({
      'width': maskWidth,
      'height': maskHeight
    });
    $('.mask').fadeIn(500);
    $('.mask').fadeTo("slow", 0.9);
  };

  /* popup window with mask behind it at start to instruct user on how to
   play the game */
  function startPopup() {
    var popupStart = '#start-popup';
    popupMask();
    $(popupStart).fadeIn(1000);
    /* closes the popup and hides mask when start button or mask is clicked */
    $('.start').click(function(startButton) {
      startButton.preventDefault();
      $('.mask').hide();
      $('#start-popup').hide();
      $('.title').addClass('h1-flicker');
      $('.game-board').addClass('game-board-flicker');
      gameStart();
      listener();
    });
    $('.mask').click(function() {
      $(this).hide();
      $('#start-popup').hide();
      $('.title').addClass('h1-flicker');
      $('.game-board').addClass('game-board-flicker');
      gameStart();
      listener();
    });
  };

  /* key difference between winPopup and startPopup besides information displayed
  is that the win popup cannot be closed by clicking the mask */
  function winPopup() {
    var popupWin = '#winner-popup';
    popupMask();
    clearInterval(interval);
    $(popupWin).fadeIn(1000);
    $('#final-star').text($('.star').text());
    $('#final-moves').text($('#counter').text());
    $('#final-time').text($('.timer').text());
    $('.replay').click(function(replayButton) {
      replayButton.preventDefault();
      $('.mask').hide();
      $('#winner-popup').hide();
      reset();
    });
    $('.mask').click(function() {
      $(this).hide();
      $('#winner-popup').hide();
      $('.title').addClass('h1-flicker');
      $('.game-board').addClass('game-board-flicker');
      reset();
    });
  };

  /* increments the move counter in the HTML */
  function counter() {
    $("#counter").html(function(i, val) {
      if (val < 9) {
        return val * 1 + 1
      }
      $('#tens-place').hide();
      return val * 1 + 1
    });
  };

  /* Plays the game.
  Variables are outside of function to ensure the restart function works.
  Not included in game start function as the listener needs to run once only. */
  var clicked = [];
  var winCount = 0;

  function listener() {
    $('.card-slot').click(handleClick);
  };

  var processing = false;

  function handleClick() {
    if (processing === true) {
      return;
    }
    /* prevents further action if card is already up */
    if ($(this).find('.card-front').is(':visible')) {
      return;
    }
    processing = true;
    var id = $(this).find('.card-front').attr('id');
    /* checks if this card is already in the 'clicked' array, adds to arrray
    if it isn't */
    if (($.inArray(id, clicked)) === -1) {
      $(this).find('.card-front').toggle();
      $(this).find('.card-back').toggle();
      clicked.push(id);
    } else {
      processing = false;
      return;
    }
    if (clicked.length === 2) {
      let [first, second] = clicked;
      /* increments move counter only after second card is clicked,
      checks if the two cards match, increments the 'win' condition if they do match
      or flips the cards again if they don't */
      if ($('#' + first).attr('src') === $('#' + second).attr('src')) {
        clicked = [];
        winCount += 1;
      } else {
        clicked = [];
        setTimeout(function() {
          $('#' + first).siblings().addClass('whoops');
          $('#' + second).siblings().addClass('whoops');
          $('#' + first).toggle();
          $('#' + first).siblings().toggle();
          $('#' + second).toggle();
          $('#' + second).siblings().toggle();
        }, 400);
      }
      counter();
      starRating();
    }
    if (winCount === 8) {
      $('.card-front').addClass('yay');
      setTimeout(function() {
        winPopup();
      }, 500);
    }
    processing = false;
  };

  /* things that happen when the game starts under any circumstance */
  function gameStart() {
    addImages();
    timer();
    $('span.star').replaceWith('<span class="star" id="star">&#9733;&#9733;&#9733;</span>');
    $('.card-back').removeClass('whoops');
  };

  /* changes user's star rating based on move count */
  function starRating() {
    var count = Number($('#counter').text());
    if (count > 15 && count <= 20) {
      $('span.star').replaceWith('<span class="star" id="2star">&#9734;&#9733;&#9733;</span>');
    } else if (count > 20 && count <= 30) {
      $('span.star').replaceWith('<span class="star" id="1star">&#9734;&#9734;&#9733;</span>');
    } else if (count > 30) {
      $('span.star').replaceWith('<span class="star" id="0star">&#9734;&#9734;&#9734;</span>');
    } else {
      return
    }
  };

  /* really basic timer */
  var sec1s = 0;
  var sec10s = 0;
  var min1s = 0;
  var min10s = 0;
  var interval = '';

  function timer() {
    $('.game-board').one('click', function() {
      interval = setInterval(function() {
        if (sec1s === 9 && sec10s < 6) {
          sec10s += 1;
          sec1s = 0;
        } else {
          sec1s += 1;
        }
        if (sec10s === 6 && min1s < 9) {
          min1s += 1;
          sec10s = 0;
        }
        if (min1s === 9) {
          min10s += 1;
          min1s = 0;
        }
        $('#seconds1s').html(sec1s);
        $('#seconds10s').html(sec10s);
        $('#minutes1s').html(min1s);
        $('#minutes10s').html(min10s);
      }, 1000);
    });
  };

  /* resets the game without refreshing the page */
  function reset() {
    clearInterval(interval);
    $('.card-front').remove();
    $('.card-back').show();
    $('#tens-place').show();
    sec1s = 0;
    sec10s = 0;
    min1s = 0;
    min10s = 0;
    $('#seconds1s').html(sec1s);
    $('#seconds10s').html(sec10s);
    $('#minutes1s').html(min1s);
    $('#minutes10s').html(min10s);
    $('#counter').html(0);
    clicked = [];
    winCount = 0;
    gameStart();
  };

  /* resets the game when reset button is clicked */
  $('#reset-button').click(function() {
    reset();
  });

  /* runs start popup only on page load */
  startPopup();

});
