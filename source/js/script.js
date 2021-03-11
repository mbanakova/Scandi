(function () {
  var phones = document.querySelectorAll('[data-mask]');

  if (phones) {
    phones.forEach(function (elem) {
      elem.addEventListener('input', function (event) {
        showMask(event);
      });
    });
  }

  function showMask(event) {
    var input = event.target;
    var mask = input.dataset.mask;
    var value = input.value;
    var literalPattern = /[0\*]/;
    var numberPattern = /[0-9]/;
    var newValue = '';

    try {
      var maskLength = mask.length;
      var valueIndex = 0;
      var maskIndex = 0;

      for (; maskIndex < maskLength;) {
        if (maskIndex >= value.length) {
          break;
        }

        if (mask[maskIndex] === '0' && value[valueIndex].match(numberPattern) === null) {
          break;
        }

        // Found a literal
        while (mask[maskIndex].match(literalPattern) === null) {
          if (value[valueIndex] === mask[maskIndex]) {
            break;
          }

          newValue += mask[maskIndex++];
        }

        newValue += value[valueIndex++];
        maskIndex++;
      }

      input.value = newValue;
    } catch (evt) {
      phones.removeEventListener();
    }
  }
})();

let slides = document.querySelectorAll('.feedback__item');
let inner = document.querySelector('.feedback__inner');
let count = 0; // шаг
let position = 0;
let width = 834;
let next = document.querySelector('.feedback__button--next');
let prev = document.querySelector('.feedback__button--prev');

checkBtns();

function init() {
  inner.style.width = width * slides.length + 'px';
  slides.forEach( slide => {
    slide.style.width = width + 'px';
  })
}
init();

prev.addEventListener('click', function () {
  let itemsLeft = Math.abs(position) / width; // сколько слева
  if (itemsLeft >= 1) {
    position += width;
  } else {
    position += itemsLeft * width;
  }
  roll();
  checkBtns();
})

next.addEventListener('click', function () {
  let itemsLeft = slides.length - (Math.abs(position) + width) / width; // сколько справа
  if (itemsLeft >= 1) {
    position -= width;
  } else {
    position -= itemsLeft * width;
  }
  roll();
  checkBtns();
})

function roll() {
  inner.style.transform = `translateX(${position}px)`
}

function checkBtns () {
  prev.disabled = position === 0;
  next.disabled = position <= -(slides.length - 1) * width;
}
