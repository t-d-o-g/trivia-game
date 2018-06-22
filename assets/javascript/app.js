var mdnGlossary = $.ajax({
    url: 'https://developer.mozilla.org/en-US/docs/Glossary$children',
    method: 'GET'
}).then(function (response) {
    return response.subpages;
});

window.onload = function () {
    var correctAnswerId;

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
        if (document.getElementById('answer-' + correctAnswerId).checked === true) {
            $('#right-wrong').html('<h2>Correct!<h2>');
            $('#submit-btn').hide();
            return 1;
        } else {
            $('#right-wrong').html('<h2>Wrong!<h2>');
            $('#submit-btn').hide();
            $('#answer-' + correctAnswerId).attr('checked', true);
            return 0;
        }
    })

    var counter = 0;
    function timeout () {
        question();
        var i = setTimeout(function () {
            console.log(counter);
            // answer();
            counter++;
            if (counter === 9) {
                clearInterval(i);
                return 'done';
            }
            timeout();
        }, 10000);
        $('.answers').empty();
        $('#right-wrong').empty();
        $('#submit-btn').show();
    }

    timeout();
}