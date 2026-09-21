document.addEventListener('DOMContentLoaded', function() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) return;

  if (typeof quizData === 'undefined') {
    console.error('quizData is not defined. Make sure the quiz data file is loaded before script.js.');
    return;
  }

  renderQuiz(quizData, quizContainer);

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitQuiz);
  }
});

function renderQuiz(quizData, container) {
  if (!quizData || !Array.isArray(quizData.questions)) {
    console.error('Invalid quiz data format. Expected quizData.questions to be an array.');
    return;
  }

  container.innerHTML = '';

  quizData.questions.forEach((questionData, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.dataset.questionIndex = index;

    const type = String(questionData.type || '').toLowerCase();
    if (type.includes('single')) {
      questionElement.classList.add('single-answer');
    } else if (type.includes('multiple')) {
      questionElement.classList.add('multiple-answer');
    } else if (type.includes('free')) {
      questionElement.classList.add('free-form');
    }

    const questionTitle = document.createElement('h3');
    questionTitle.textContent = questionData.text || questionData.question || `Question ${index + 1}`;
    questionElement.appendChild(questionTitle);

    const optionList = Array.isArray(questionData.options) ? questionData.options : [];
    const rawCorrectAnswers = questionData.correctAnswer !== undefined
      ? questionData.correctAnswer
      : questionData.answers !== undefined
        ? questionData.answers
        : questionData.answer;

    if (type.includes('single')) {
      optionList.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = option;
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        questionElement.appendChild(label);
      });

      questionElement.dataset.correctAnswer = Array.isArray(rawCorrectAnswers)
        ? rawCorrectAnswers.join(',')
        : String(rawCorrectAnswers || '');
    } else if (type.includes('multiple')) {
      optionList.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = `question-${index}`;
        input.value = option;
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        questionElement.appendChild(label);
      });

      const normalizedAnswers = Array.isArray(rawCorrectAnswers)
        ? rawCorrectAnswers
        : rawCorrectAnswers === undefined || rawCorrectAnswers === null || rawCorrectAnswers === ''
          ? []
          : [rawCorrectAnswers];
      questionElement.dataset.correctAnswer = normalizedAnswers
        .map(answer => String(answer).trim())
        .filter(Boolean)
        .join(',');
    } else if (type.includes('free')) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `question-${index}`;
      questionElement.appendChild(input);

      const normalizedAnswers = Array.isArray(rawCorrectAnswers)
        ? rawCorrectAnswers
        : rawCorrectAnswers === undefined || rawCorrectAnswers === null || rawCorrectAnswers === ''
          ? []
          : [rawCorrectAnswers];
      questionElement.dataset.correctAnswer = normalizedAnswers
        .map(answer => String(answer).trim())
        .filter(Boolean)
        .join(',');
    }

    container.appendChild(questionElement);
  });
}

function areAllQuestionsAnswered() {
  const questions = document.querySelectorAll('.question');
  for (const question of questions) {
    const inputs = question.querySelectorAll('input');
    if (inputs.length === 0) return false;

    let answered = false;
    for (const input of inputs) {
      if (input.type === 'radio' && input.checked) {
        answered = true;
        break;
      }
      if (input.type === 'checkbox' && input.checked) {
        answered = true;
        break;
      }
      if (input.type === 'text' && input.value.trim() !== '') {
        answered = true;
        break;
      }
    }

    if (!answered) return false;
  }

  return true;
}

function isSingleAnswerCorrect(question) {
  const selectedAnswer = Array.from(question.querySelectorAll('input[type="radio"]'))
    .find(input => input.checked);

  if (!selectedAnswer) return false;

  return selectedAnswer.value === (question.dataset.correctAnswer || '').trim();
}

function isMultipleAnswerCorrect(question) {
  const inputs = question.querySelectorAll('input[type="checkbox"]');
  const correctAnswers = (question.dataset.correctAnswer || '')
    .split(',')
    .map(answer => answer.trim())
    .filter(Boolean);

  for (const input of inputs) {
    if (input.checked && !correctAnswers.includes(input.value)) {
      return false;
    }
  }

  for (const answer of correctAnswers) {
    const matchingInput = question.querySelector(`input[type="checkbox"][value="${answer}"]`);
    if (!matchingInput || !matchingInput.checked) {
      return false;
    }
  }

  return true;
}

function isFreeFormAnswerCorrect(question) {
  const input = question.querySelector('input[type="text"]');
  if (!input) return false;

  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswers = (question.dataset.correctAnswer || '')
    .split(',')
    .map(answer => answer.trim().toLowerCase())
    .filter(Boolean);

  return correctAnswers.includes(userAnswer);
}

function submitQuiz() {
  if (!areAllQuestionsAnswered()) {
    alert('Please answer all questions before submitting the quiz.');
    return;
  }

  const questions = document.querySelectorAll('.question');
  let score = 0;

  for (const question of questions) {
    question.classList.remove('correct', 'incorrect');

    let isCorrect = false;

    if (question.classList.contains('single-answer')) {
      isCorrect = isSingleAnswerCorrect(question);
    } else if (question.classList.contains('multiple-answer')) {
      isCorrect = isMultipleAnswerCorrect(question);
    } else if (question.classList.contains('free-form')) {
      isCorrect = isFreeFormAnswerCorrect(question);
    }

    if (isCorrect) {
      score++;
      question.classList.add('correct');
    } else {
      question.classList.add('incorrect');
    }
  }

  const wrongAnswers = questions.length - score;
  const result = document.getElementById('result');
  const scoreText = `Your score: ${score} / ${questions.length}. You got ${wrongAnswers} question${wrongAnswers === 1 ? '' : 's'} wrong.`;

  if (result) {
    result.textContent = scoreText;
    result.classList.add('show-result');
  } else {
    const scoreDisplay = createScoreDisplay();
    scoreDisplay.textContent = scoreText;
    scoreDisplay.classList.add('show-result');
    document.body.appendChild(scoreDisplay);
  }

  const firstIncorrect = document.querySelector('.question.incorrect');
  if (firstIncorrect) {
    firstIncorrect.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function createScoreDisplay() {
  const scoreDisplay = document.createElement('div');
  scoreDisplay.classList.add('score-display');
  return scoreDisplay;
}
