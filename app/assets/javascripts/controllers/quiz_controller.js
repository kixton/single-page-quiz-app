var QuizController = function() {
  this.quizDiv = '.quiz';
  this.quizListDiv = '.quiz-list';

  this.quizView = new QuizView(this.quizDiv);
  this.quizListView = new TaskListView(this.quizListDiv);

  $(document).on('quizSelected', function(e, ))

}

