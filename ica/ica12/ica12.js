// select button
const newQuoteButton = document.querySelector('#js-new-quote');

// select text areas
const quoteText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

// API endpoint
const endpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

// event listener
newQuoteButton.addEventListener('click', getQuote);

// function to fetch quote
function getQuote() {
  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // display quote
      displayQuote(data.question, data.answer);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Try again.');
    });
}

// function to display quote
function displayQuote(question, answer) {
  quoteText.textContent = question;
  answerText.textContent = ''; // hide answer until button click

  // answer button logic
  const answerButton = document.querySelector('#js-tweet');
  answerButton.onclick = function () {
    answerText.textContent = answer;
  };
}

// FIX: load a quote when page loads
getQuote();