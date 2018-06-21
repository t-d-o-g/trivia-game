var mdnGlossary = $.ajax({
    url: 'https://developer.mozilla.org/en-US/docs/Glossary$children',
    method: 'GET'
}).then(function (response) {
    return response.subpages;
});

window.onload = function () {
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

        var correctAnswer = answers[Math.floor(Math.random() * Math.floor(3))];
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
            var label = $('<label>').attr('for', 'answer-' + 1).text(answers[i].title);
            $('.answers').append('<li>').append(answer).append(label);
        }
    });
}