$(document).ready(function() {

  $.get( "/quizzes", function(data) {
    var quizzes = data;
    _.each(quizzes, function(quiz) {
      
      var anchor_tag = $("<a></a>").attr("href", "#").attr("quiz-id", quiz.id).html(quiz.title);
      $("<li></li>").append(anchor_tag).appendTo(".all-quizzes");
    });
  });

  
  var i = 0; // question counter
  var j = 0; // answer counter
  var answersMCTemplate = "<input type='radio' name='answer-choice' class='answer-choice'>";
  var answersTFTemplate;
  var formBody = "<form class='quiz-answers'></form>";
  var selectedAnswer;
  var quizId;

  var displayQuestion = function(data) {

    // clear the div then create a form
    $(".main-body").empty();
    var question_span = "<span class='question'></span>";
    $(".main-body").append(question_span);
    $(".question").html(data[i].question).append();
    $(formBody).appendTo(".main-body");

    // sanitize answers into array
    var answerChoices = data[i].choices.split(";");

    // loop through answers and display as radio buttons
    _.each(answerChoices, function(answer) {
      var x = $(".main-body").find(".quiz-answers");
      x.append(answersMCTemplate);
      x.append(answer + "<br>");
      var y = $(".main-body").find("input").last().attr("value", answer);
      j++; // increment answer counter

      if (j == answerChoices.length) {
        x.append("<input type='submit' value='SUBMIT' class='submit'>");
        j = 0; // reset answer counter
      }
    }); // _.each 

    // send data along with submitAnswer function
    submitAnswer(data); 

  };

  var submitAnswer = function(data) {

    // get selectedAnswer
    $("input:radio[name=answer-choice]").click(function() {
      selectedAnswer = $(this).val();
      // console.log("selected answer: " + selectedAnswer);
    }); // input.click

    // compare to correctAnswer
    $(".main-body").find("form").submit(function(e) {
      e.preventDefault();
      var correctAnswer = data[i].answer;

      // GET /quizzes/:id/questions/:id/check?answer=your_answer_here

      var questionId = data[i].id;
      // console.log("question ID " + questionId);

      $.get("/quizzes/" + quizId + "/questions/" + questionId + "check?answer=" + selectedAnswer, function(data) {
        console.log("getting answer");
        console.log(data);

        $.get("/quizzes/" + quizId + "/scores", function(data) {
          console.log(data);
        });

      }); 

      // if ( selectedAnswer === correctAnswer) {
      //   $(".main-body").append("<span class='correct'>Correct!</span>");
      //   // increment question count
      //   i++;
      //   // display nextQuestion
      //   nextQuestion(data);
      // } else {
      //   $(".main-body").append("<span class='incorrect'>Sorry, that is incorrect.</span>");
      //   i++;
      //   nextQuestion(data);
      // }
    }); // form.submit
  };

  var nextQuestion = function(data) {

    if (i < data.length) {
      setTimeout(function() {
        displayQuestion(data);
        console.log("next question displayed");
      }, 1000);
    // if last question in the quiz, quiz complete
    } else if (i === data.length) {
      setTimeout(function() {
        $(".main-body").empty();
        $(".main-body").html("You completed the quiz!");
        i = 0; // reset question counter
      }, 1000);
    }

  };

  $(".all-quizzes").on("click", "a", function() {

    $("a").removeClass("active");
    $(this).addClass("active");
    quizId = $(this).attr("quiz-id");
    console.log("quiz ID " + quizId);

    $.get("/quizzes/" + quizId + "/questions", function(data) {
      displayQuestion(data);
    }); // .get
  }); // on("click", "a")



});

