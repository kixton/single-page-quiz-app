$(document).ready(function() {

  $(".about-project").show();

  $.get( "/quizzes", function(data) {
    var quizzes = data;
    _.each(quizzes, function(quiz) {     
      var anchor_tag = $("<a></a>").attr("href", "#").attr("quiz-id", quiz.id).html(quiz.title);
      $("<li></li>").append(anchor_tag).appendTo(".all-quizzes");
    });
  });

  var user_id = 1;
  var i = 0; // question counter
  var j = 0; // answer counter
  var k = 0; // correct answers counter
  var answersMCTemplate = "<input type='radio' name='answer-choice' class='answer-choice'>";
  var answersTFTemplate;
  var formBody = "<form class='quiz-answers'></form>";
  var selectedAnswer;
  var quizId;
  var submitButton = "<input type='submit' value='SUBMIT' class='submit'>";

  var displayQuestion = function(data) {

    // clear the div then create a form
    $(".about-project").hide();
    $(".quiz-info").empty();

    var question_span = "<span class='question'></span>";
    $(".quiz-info").append(question_span);
    $(".question").html(data[i].question).append();
    $(formBody).appendTo(".quiz-info");

    // sanitize answers into array
    var answerChoices = data[i].choices.split(";");

    // loop through answers and display as radio buttons
    _.each(answerChoices, function(answer) {
      var x = $(".quiz-info").find(".quiz-answers");
      x.append(answersMCTemplate);
      x.append(answer + "<br>");
      var y = $(".quiz-info").find("input").last().attr("value", answer);
      j++; // increment answer counter

      if (j == answerChoices.length) {
        x.append(submitButton);
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
    }); // input.click

    $(".main-body").find("form").submit(function(e) {
      e.preventDefault();
      var correctAnswer = data[i].answer;

      var questionId = data[i].id;

      // check correct answer for question
      var questionScorePath = "/quizzes/" + quizId + "/questions/" + questionId + "/check?answer=" + selectedAnswer;

      $.get(questionScorePath, function(data) {

        if (data.correct === true) {
          $(".quiz-info").append("<span class='correct'>Correct!</span>");
          k++; // increment question count
        } else if (data.correct === false) {
          $(".quiz-info").append("<span class='incorrect'>Sorry, that is incorrect.</span>");
        }
      }); // get questionScore 

        i++; // increment question count
        nextQuestion(data);

    }); // form.submit
  };

  var nextQuestion = function(data) {

    if (i < data.length) {
      setTimeout(function() {
        displayQuestion(data);
      }, 1000);
    // quiz complete once reached last question 
    } else if (i === data.length) {
      setTimeout(function() {
        var score = Math.floor((k / data.length) * 100);
        console.log(score + "%");

        // $.post("link/to/post", function(datatopost) {

        // });

        $(".quiz-info").empty();
        $(".quiz-info").html("You completed the quiz!<br><br> Score: " + score + "%");
        i = 0; // reset counters
        j = 0;
        k = 0; 
      }, 1000);
    }

  };

  $(".all-quizzes").on("click", "a", function() {

    $(".all-quizzes").show(1000);
    $("a").removeClass("active");
    $(this).addClass("active");
    quizId = $(this).attr("quiz-id");

    $.get("/quizzes/" + quizId + "/questions", function(data) {
      displayQuestion(data);
    }); // .get
  }); // on("click", "a")

  $(".take-quiz").click(function() {
    $(".all-quizzes").show(1000);
    $("a").removeClass("active");
    $(".about-project").show();
    $(".quiz-info").empty();
    $(".create-quiz-div").hide();
  });


  $(".create-quiz").click(function() {
    $(".all-quizzes").hide(1000);
    $(".about-project").hide();
    $(".quiz-info").empty();
    $(".create-quiz-div").show();

    $("input[name='question-type']").change(function(){
      if ($(this).val() === 'multiple') {
        $(".tf-answer-choices").hide();
        $(".fill-answer-choice").hide();
        var mc = $(".mc-answer-choices").show();
        // .append(mc);

        // $(".q1").append(mc);
      } else if ($(this).val() === 'boolean') {
        $(".mc-answer-choices").hide();
        $(".fill-answer-choice").hide();
        var tf = $(".tf-answer-choices").show();
        // $(".q1").append(tf);
      } else if ($(this).val() === 'fill') {
        $(".tf-answer-choices").hide();
        $(".mc-answer-choices").hide();
        var fill = $(".fill-answer-choice").show();
        // $(".q1").append(fill);
      }

    });

  });


});

