var mdnGlossary = $.ajax({
    url: 'https://developer.mozilla.org/en-US/docs/Glossary$children',
    method: 'GET'
}).then(function (response) {
    return response.subpages;
});

window.onload = function () {
    var correctAnswerId;
    var totalQuestions = 10;

    function question () {
        mdnGlossary.then(function (words) {
            var answers = [];
            var glossaryWord = {};
            var answerSummary = '';
            while (answers.length < 4) {
                glossaryWord = words[Math.floor(Math.random() * Math.floor(words.length - 1))];
                if (!answers.includes(glossaryWord)) {
                    answers.push(glossaryWord);
                }
            }

            correctAnswerId = Math.floor(Math.random() * Math.floor(3));
            var correctAnswer = answers[correctAnswerId];
            var correctAnswerJson = $.ajax({
                url: 'https://developer.mozilla.org/' + correctAnswer.url + '$json',
                method: 'GET' 
            }).then(function (response) {
                return response;
            });

            answerSummary = correctAnswerJson.then(function (answer) {
                console.log(answer);
                var filteredTitle = answer.title.replace(/ *\([^)]*\) */g, "").toLowerCase();
                var re = new RegExp(filteredTitle, 'gi');
                var filteredSummary = answer.summary.replace(re, ' ? '); 
                return filteredSummary;
            });

            answerSummary.then(function (summary) {
                $('.summary').html(summary);
            });

            console.log(answers[0]);
            for (var i = 0; i < answers.length; i++) {
                var answer = $('<input>').attr('type', 'radio').attr('id', 'answer-' + i).attr('name', 'answer');
                var label = $('<label>').attr('for', 'answer-' + i).text(answers[i].title);
                $('.answers').append('<li>').append(answer).append(label);
            }

            console.log('CORRECT ANSWER: ', correctAnswer.title);
        });
    }

    $('#submit-btn').on('click', function () {
        totalQuestions--;
        if (document.getElementById('answer-' + correctAnswerId).checked === true) {
            $('#right-wrong').html('<h2>Correct!<h2>');
            $('#submit-btn').hide();
            setTimeout(function () {
                answerTimeout(true, totalQuestions);
            }, 2000);
        } else {
            $('#right-wrong').html('<h2>Wrong!<h2>');
            $('#submit-btn').hide();
            $('#answer-' + correctAnswerId).attr('checked', true);
            setTimeout(function () {
                answerTimeout(false, totalQuestions);
            }, 2000);
        }
    });

    function answerTimeout (correctAnswer, questionCount) {
        console.log('Total Questions: ', questionCount);
        question();
        var i = setTimeout(function () {
            questionCount--;
            if (questionCount === 0 || correctAnswer) {
                clearTimeout(i);
            }
            answerTimeout();
        }, 20000);
        $('.answers').empty();
        $('#right-wrong').empty();
        $('#submit-btn').show();
        return questionCount - 1;
    }
    answerTimeout(false, totalQuestions);
}