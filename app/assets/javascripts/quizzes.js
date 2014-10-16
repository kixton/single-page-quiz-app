$(document).ready(function() {

  // show div with info about project
  $(".about-project").show();

  // get all quizzes; loop thru quiz append link to quiz in navbar
  $.get( "/quizzes", function(data) {
    var quizzes = data;
    _.each(quizzes, function(quiz) {     
      var anchor_tag = $("<a></a>").attr("href", "#").attr("quiz-id", quiz.id).html(quiz.title);
      $("<li></li>").append(anchor_tag).appendTo(".all-quizzes");
    });
  });

  // variables defined 
  var user_id = 1; // for demo purposes
  var i = 0; // question counter
  var j = 0; // answer counter
  var k = 0; // correct answers counter
  var selectedAnswer;
  var quizId;

  // NOTE: to update with underscore template
  var answersMCTemplate = "<input type='radio' name='answer-choice' class='answer-choice'>";
  var answersTFTemplate;
  var formBody = "<form class='quiz-answers'></form>";
  var submitButton = "<input type='submit' value='SUBMIT' class='submit'>";

  var displayQuestion = function(data) {
    // clear views
    $(".about-project").hide();
    $(".quiz-info").empty();

    // create form
    var question_span = "<span class='question'></span>";
    $(".quiz-info").append(question_span);
    $(".question").html(data[i].question).append();
    $(formBody).appendTo(".quiz-info");

    // sanitize answers into array
    var answerChoices = data[i].choices.split(";");

    // loop through MC answers and display as radio buttons
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
    submitAnswer(data); 
  }; // end displayQuestion

  // check if answer is correct, then proceed to nextQuestion
  var submitAnswer = function(data) {
    $("input:radio[name=answer-choice]").click(function() {
      selectedAnswer = $(this).val();
    }); 

    $(".main-body").find("form").submit(function(e) {
      e.preventDefault();
      var correctAnswer = data[i].answer;
      var questionId = data[i].id;
      var questionScorePath = "/quizzes/" + quizId + "/questions/" + questionId + "/check?answer=" + selectedAnswer;

      // check user's answer against correct answer
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
    }); // end form.submit
  }; // end submitAnswer

  // display next question *OR* "Quiz Complete" message
  var nextQuestion = function(data) {
    if (i < data.length) {
      setTimeout(function() {
        displayQuestion(data);
      }, 1000);
    // quiz complete once reached last question 
    } else if (i === data.length) {
      setTimeout(function() {
        var score = Math.floor((k / data.length) * 100);
        $(".quiz-info").empty();
        $(".quiz-info").html("You completed the quiz!<br><br> Score: " + score + "%");
        i = 0; j = 0; k = 0; // reset counters
      }, 1000); // end setTimeout
    } // end if, else 
  }; // end nextQuestion

  // even handler when user clicks "Take Quiz" in navbar
  $(".take-quiz").click(function() {
    $(".all-quizzes").show(1000);
    $("a").removeClass("active");
    $(".about-project").show();
    $(".quiz-info").empty();
    $(".create-quiz-div").hide();
  }); // end ".take-quiz" event handler

  // on click of quiz link in navbar, show first quiz question
  $(".all-quizzes").on("click", "a", function() {
    $(".all-quizzes").show(1000);
    $("a").removeClass("active");
    $(this).addClass("active");
    quizId = $(this).attr("quiz-id");

    // get quiz questions based on quiz ID
    $.get("/quizzes/" + quizId + "/questions", function(data) {
      // display first question
      displayQuestion(data);
    }); // end $.get
  }); // end ".all-quizzes" event handler


  // onClick of "Create Quiz" navlink, show new quiz form
  $(".create-quiz").click(function() {
    $(".all-quizzes").hide(1000);
    $(".about-project").hide();
    $(".quiz-info").empty();
    $(".create-quiz-div").attr("style", "display:block");
    var quizCounter = 0;

    // add another question to "Create Quiz" form
    $(".add-question").click(function() {
      quizCounter ++; 

      var newQ = $(".new-question:last").clone().show();

      // 'this' refers to "Add question" button
      $(this).before(newQ);
      $(".answer-choice").slice(-3).attr("name", "question-type q" + quizCounter);

      // select the type of question (Multiple Choice, True/False, Fill In Blank)
      $(".answer-choice").change(function(){
        // this is the radio button selected
        var z = $(this).val();
        console.log(this);
        var thisItem = this;
        var createAnswersDiv = $(this).nextAll(".create-answers");

        // if you selected Multiple Choice
        if (z === 'multiple') {
          createAnswersDiv.empty();
          $(".mc-answer-choices:last").clone().show().appendTo(createAnswersDiv[0]);
        } else if (z === 'boolean') {
          createAnswersDiv.empty();
          $(".tf-answer-choices:last").clone().show().appendTo(createAnswersDiv[0]);
        } else if (z === 'fill') {
          createAnswersDiv.empty();
          $(".fill-answer-choice:last").clone().show().appendTo(createAnswersDiv[0]);
        } // end if/else if
      }); // end ".answer-choice" change

      // remove question from "Create Quiz" form
      $(".remove-question").click(function() {
        console.log("clicked");
        $(this).parent(".new-question").empty();
      });

    }); // add-question click handler
  }); // end create-quiz click handler

  // function variable to define what happens when user creates new quiz
  var submitNewQuiz = function(data) {
    // select quiz name from input box and create quiz object
    var quizObject = {
      quiz: { title: $(".quiz-name").val()} 
    };
    
    $.post("/quizzes", quizObject, function(callback) {
      var newQuizId = data.entity.title;
    });

    var questionsObject = {
      question: {
        question: "",
        answer: "",
        choices: "",
        type: ""
      }
    };

    $.post("/quizzes/" + newQuizID)
  };

    $(".create-quiz-btn").click(function() {
      var quizName = $(".quiz-name").val();
      console.log(quizName);

      var quizData = {
        quiz: { title: quizName }
      };
      
      $.post("/quizzes", quizData, function(data) {
        var quizId = data.entity.title;
        console.log("posted quiz");
        console.log(data);
      });

    });


});

