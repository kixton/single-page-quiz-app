$(document).ready(function() {

  $(".about-project").show();

  $.get( "/quizzes", function(data) {
    var quizzes = data;
    _.each(quizzes, function(quiz) {     
      var anchor_tag = $("<a></a>").attr("href", "#").attr("quiz-id", quiz.id).html(quiz.title);
      $("<li></li>").append(anchor_tag).appendTo(".all-quizzes");
    });
  });

  $(".take-quiz").click(function() {
    $(".all-quizzes").show(1000);
    $("a").removeClass("active");
    $(".about-project").show();
    $(".quiz-info").empty();
    $(".create-quiz-div").hide();
  });




});