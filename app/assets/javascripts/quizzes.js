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
  var selectedAnswer;
  var quizId;
  var answersMCTemplate = "<input type='radio' name='answer-choice' class='answer-choice'>";
  var answersTFTemplate;
  var formBody = "<form class='quiz-answers'></form>";
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

  // onClick of "CreateQuiz" show form
  $(".create-quiz").click(function() {
    $(".all-quizzes").hide(1000);
    $(".about-project").hide();
    $(".quiz-info").empty();
    $(".create-quiz-div").attr("style", "display:block");
    var quizCounter = 0;

    $(".add-question").click(function() {
      quizCounter ++;

      var newQ = $(".new-question:last").clone().show();
      // this refers to "Add question" button
      $(this).before(newQ);
      $(".answer-choice").slice(-3).attr("name", "question-type q" + quizCounter);
      // $(".question-num").slice(-1).html(quizCounter);

      $(".answer-choice").change(function(){
        // this is the radio button selected
        var z = $(this).val();
        console.log(this);
        var thisItem = this;

        // if you selected Multiple Choice
        if (z === 'multiple') {
          console.log(this);
          // $(this > ".create-answer").empty();
          // $(this).children(".create-answers").empty();
          var q = $(this).nextAll(".create-answers");
          $(".mc-answer-choices:last").clone().show().appendTo(q[0]);
        } else if (z === 'boolean') {
          $(this).find("> .create-answer").empty();

          // $("input:radio[name='question-type']:checked").children(".create-answers").empty();
          var r = $(this).nextAll(".create-answers");
          $(".tf-answer-choices:last").clone().show().appendTo(r[0]);
        } else if (z === 'fill') {
          $("input:radio[name='question-type']:checked").children(".create-answers").empty();
          var x = $(this).nextAll(".create-answers");
          $(".fill-answer-choice:last").clone().show().appendTo(x[0]);
        } // if, else if...
      }); // on change of question-type

      $(".remove-question").click(function() {
        console.log("clicked");
        $(this).parent(".new-question").empty();
      });

    }); // add-question

  }); // .create-quiz




});

