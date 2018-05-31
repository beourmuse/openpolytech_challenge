var s = Snap('#super');

var cards = [
  s.select('#CatWoman').data("match", "batman"),
  s.select('#WonderWoman').data("match", "wonder"),
  s.select('#LexLuther').data("match", "superman"),
  s.select('#Superman').data("match", "superman"),
  s.select('#Batman').data("match", "batman"),
  s.select('#Cheetah').data("match", "wonder"),
];

var windows = [
  s.select('#window1'),
  s.select('#window2'),
  s.select('#window3'),
  s.select('#window4'),
  s.select('#window5'),
  s.select('#window6'),
];

let $container = $('.container'),
  $scorePanel = $('.score-panel'),
  $moves = $('.moves'),
  $timer = $('.timer'),
  $restart = $('.restart'),
  $deck = $('.deck'),
  nowTime,
  allOpen = [],
  match = 0,
  second = 0,
  moves = 0,
  wait = 420,
  totalCard = cards.length / 2

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function initTime() {
  nowTime = setInterval(function () {
    $timer.text(`${second}`)
    second = second + 1
  }, 1000);
}

function resetTimer(timer) {
  if (timer) {
    clearInterval(timer);
  }
}

function gameOver(moves) {
  $('#winnerText').text(`In ${second} seconds, you did a total of ${moves}. When you think about the best comic book and movie super heroes, you can’t help but think of their villains. How many others do you know?`);
  $('#winnerModal').modal('toggle');
}

$restart.bind('click', function (confirmed) {
  if (confirmed) {
    init();
  }
});

var processCard = function (card) {
  if (card.hasClass('show') || card.hasClass('match')) {
    return true;
  }
  card.addClass('open show');
  allOpen.push(card);

  if (allOpen.length > 1) {
    var other = allOpen[0];
    if (card.data('match') === other.data('match')) {
      other.addClass('match');
      other.attr({ opacity: '0.5' });
      other.data('window').select('.mask').attr({ style: 'opacity: 0;' });
      card.addClass('match');
      card.attr({ opacity: '0.5' });
      card.data('window').select('.mask').attr({ style: 'opacity: 0;' });
      setTimeout(function () {
        other.removeClass('open show');
        card.removeClass('open show');
      }, wait);
      match++;

    } else {
      setTimeout(function () {
        other.removeClass('open show');
        other.transform('');
        other.attr({ opacity: '0.0' });
        closeWindow(other.data('window'));
        card.removeClass('open show');
        card.transform('');
        card.attr({ opacity: '0.0' });
        closeWindow(card.data('window'));
      }, wait);
    }
    allOpen = [];
    moves++;
    $moves.html(moves);
  }

  if (totalCard === match) {
    setTimeout(function () {
      gameOver(moves);
    }, 500);
  }
}

var closeWindow = function (window) {
  window.animate(
    { transform: 's-1,1' }, 
    1000,
    function(){
      this.attr({ transform: 's1,1' });
    }
  );
}

var addCardListener = function (window, card) {
  card.data('window', window); 
  window.unclick();
  window.click(function() {
    window.animate(
      { transform: 's-1,1' }, 
      700,
      function(){
        this.attr({ transform: 's1,1' });
        var bbox1 = window.getBBox();
        var bbox2 = card.getBBox();
        var x = bbox1.x - bbox2.x;
        var y = bbox1.y - bbox2.y;
        card.transform('t'+[x ,y] );
        card.attr({ opacity: '1.0' });
        processCard(card);
      }
    );
  });
}

function init() {
  let allCards = shuffle(cards);
  for (let i = 0; i < cards.length; i++) {
    card = cards[i];
    card.transform('');
    card.removeClass('match');
    card.attr({ opacity: '0.0' });
  }
  s.selectAll('.mask').attr({ style: 'opacity: 1;' });
  
  match = 0;
  moves = 0;
  $moves.text('0');

  for (let i = 0; i < allCards.length; i++) {
    addCardListener(windows[i], allCards[i]);
  }
  
  resetTimer(nowTime);
  second = 0;
  $timer.text(`${second}`)
  initTime();
}

window.onload  = function () {
  init();
}

// TODO: responsive design

$(function() {
  $(window).resize(function(){
    if (Modernizr.mq('(min-width: 600px)')) {
      $("#super").attr("viewBox","0 0 500 500");
    }
    if (Modernizr.mq('(min-width: 900px)')) {
      $("#super").attr("viewBox","0 0 500 500");
    }
    if (Modernizr.mq('(min-width: 1200px)')) {
      $("#super").attr("viewBox","0 0 500 500");
    }
    if (Modernizr.mq('(min-width: 1800px)')) {
      $("#super").attr("viewBox", "0 0 500 500");
    }
  }).resize();
});
