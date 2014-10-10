$(document).ready(function() {

  $.get( "/quizzes", function(data) {
    console.log(data);
    var quizzes = data;
    _.each(quizzes, function(quiz) {
      
      var title = quiz.title;
      var id = quiz.id;
      var quiz_path = "/quizzes/" + id;
      
      console.log( quiz.title );
      console.log( quiz_path );

      $("<a>").attr("href", quiz_path)

      // render quiz template here with quiz info in the quiz var
    });

  })

});