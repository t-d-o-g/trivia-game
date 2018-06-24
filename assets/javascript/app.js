var mdnGlossary = $.ajax({
    url: 'https://developer.mozilla.org/en-US/docs/Glossary$children',
    method: 'GET'
}).then(function (response) {
    return response.subpages;
});

window.onload = function () {
    var correctAnswerId;
    var totalQuestions = 10;
    var answersRight = 0;
    var answersWrong = 0;

    $('#submit-btn').on('click', function () {
        totalQuestions--;
        if (document.getElementById('answer-' + correctAnswerId).checked === true) {
            answersRight++;
            $('#right-wrong').html('<h2>Correct!<h2>');
            $('#submit-btn').hide();
            setTimeout(function () {
                updateQuestion(19, true);
                $('.answers').empty();
            }, 1000);
        } else {
            answersWrong++;
            $('#right-wrong').html('<h2>Wrong!<h2>');
            $('#submit-btn').hide();
            $('#answer-' + correctAnswerId).attr('checked', true);
            setTimeout(function () {
                updateQuestion(19, true);
                $('.answers').empty();
            }, 1000);
        }
    });

    function getQuestion () {
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
                var filteredTitle = answer.title.replace(/ *\([^)]*\) */g, "").toLowerCase();
                var re = new RegExp(filteredTitle, 'gi');
                var filteredSummary = answer.summary.replace(re, ' ? '); 
                return filteredSummary;
            });

            answerSummary.then(function (summary) {
                $('.summary').html(summary);
            });

            for (var i = 0; i < answers.length; i++) {
                var answer = $('<input>').attr('type', 'radio').attr('id', 'answer-' + i).attr('name', 'answer');
                var label = $('<label>').attr('for', 'answer-' + i).text(answers[i].title);
                $('.answers').append('<li>').append(answer).append(label);
            }
        });
    }

    function results () {
        $('.answers').hide();
        var playAgainBtn = $('<button id="play-btn">').text('Play Again!');
        $('#right-wrong').hide();
        $('.summary').html('<h2>Answers Right: ' + answersRight + '</h2><br><h2>Answers Wrong: ' + answersWrong + '</h2>');
        $('.summary').append(playAgainBtn);
        $('#play-btn').on('click', function () {
            $(this).hide();
            $('.answers').show();
            totalQuestions = 10;
            answersRight = 0;
            answersWrong = 0;
            updateQuestion(19, true);
            $('#right-wrong').show();
        });
    }

    function updateQuestion (duration, answerSubmitted) {
        var start = Date.now(), diff, seconds;
        var intId = setInterval(timer, 1000);
        timer();

        if (totalQuestions > 0) {
            getQuestion();
        } else {
            for (var i = 1; i <= intId; i++) {
                clearInterval(i);
            }
            setTimeout(function () {
                results();
            }, 1000);
            return;
        }

        function timer() {
            diff = duration - (((Date.now() - start) / 1000) | 0);
            seconds = (diff % 60) | 0;

            if (seconds === 0) {
                answersWrong++;
                totalQuestions--;
                $('#right-wrong').html('<h2>Time Up!<h2>');
                $('#submit-btn').hide();
                $('#answer-' + correctAnswerId).attr('checked', true);
                setTimeout(function () {
                    updateQuestion(19, true);
                    $('.answers').empty();
                }, 1000);
                clearInterval(intId);
            } else if (answerSubmitted) {
                for (var i = 1; i < intId; i++) {
                    clearInterval(i);
                }
            }

            $('#seconds').remove();
            $('#submit-btn').append('<span id="seconds">' + seconds + '</span>');

            if (diff <= 0) {
                start = Date.now() + 1000;
            }
        }; 

        $('#right-wrong').empty();
        $('#submit-btn').show();
    }

    updateQuestion(19, false);
}