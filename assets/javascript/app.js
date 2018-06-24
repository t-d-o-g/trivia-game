var mdnGlossary = $.ajax({
    url: 'https://developer.mozilla.org/en-US/docs/Glossary$children',
    method: 'GET'
}).then(function (response) {
    return response.subpages;
});

window.onload = function () {
    var correctAnswerId;
    var totalQuestions = 10;

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
                // console.log(answer);
                var filteredTitle = answer.title.replace(/ *\([^)]*\) */g, "").toLowerCase();
                var re = new RegExp(filteredTitle, 'gi');
                var filteredSummary = answer.summary.replace(re, ' ? '); 
                return filteredSummary;
            });

            answerSummary.then(function (summary) {
                $('.summary').html(summary);
            });

            // console.log(answers[0]);
            for (var i = 0; i < answers.length; i++) {
                var answer = $('<input>').attr('type', 'radio').attr('id', 'answer-' + i).attr('name', 'answer');
                var label = $('<label>').attr('for', 'answer-' + i).text(answers[i].title);
                $('.answers').append('<li>').append(answer).append(label);
            }

            // console.log('CORRECT ANSWER: ', correctAnswer.title);
        });
    }

    $('#submit-btn').on('click', function () {
        if (document.getElementById('answer-' + correctAnswerId).checked === true) {
            $('#right-wrong').html('<h2>Correct!<h2>');
            $('#submit-btn').hide();
            setTimeout(function () {
                updateQuestion(20, display, true);
            }, 1000);
        } else {
            $('#right-wrong').html('<h2>Wrong!<h2>');
            $('#submit-btn').hide();
            $('#answer-' + correctAnswerId).attr('checked', true);
            setTimeout(function () {
                updateQuestion(20, display, true);
            }, 1000);
        }
    });

    function updateQuestion (duration, display, answerSubmitted) {
        var start = Date.now(), diff, seconds;
        var intId = setInterval(timer, 1000);
        timer();

                getQuestion();
        function timer() {
            diff = duration - (((Date.now() - start) / 1000) | 0);
            seconds = (diff % 60) | 0;
            console.log('Seconds: ', seconds);

            // seconds = seconds < 10 ? '0' + seconds : seconds;
            if (seconds === 20) {
                // $('.answers').empty();
                // clearInterval(intId);
                // getQuestion();
                // console.log('Total Questions: ', totalQuestions);
                // totalQuestions--;
            } 

            if (seconds === 0) {
                $('.answers').empty();
                clearInterval(intId);
                updateQuestion(20, display, false);
                console.log('Total Questions: ', totalQuestions);
                totalQuestions--;
                console.log('Clearing ID');
            }

            if (answerSubmitted) {
                for (var i = 1; i < intId; i++) {
                    clearInterval(i);
                }
            }
            
            if (totalQuestions <= 0) {
                for (var i = 1; i <= intId; i++) {
                    clearInterval(i);
                }
                return;
            } 

            $('#submit-btn').text("Submit Answer " + seconds);

            if (diff <= 0) {
                start = Date.now() + 1000;
            }
        }; 
        // $('.answers').empty();
        $('#right-wrong').empty();
        $('#submit-btn').show();
    }

    display = document.querySelector('#countdown'); 
    updateQuestion(19, display, false);
}