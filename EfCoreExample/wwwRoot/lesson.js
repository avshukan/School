const uriLesson = "api/lesson";
const uriTeacher = "api/teacher";

$(document).ready(function() {
  debugger;
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var id = params.get('id');
  getTeachersList(id);
});

function getTeachersList(id) {
  $.ajax({
    url: uriTeacher,
    type: "GET",
    accepts: "application/json",
    contentType: "application/json",
    cache: false,
    success: function(data) {
      var inputTeacher = $("#inputTeacher");
      $(inputTeacher).empty();
      data.forEach(function(item, key) {
        $(inputTeacher).append($("<option></option>").text(item.name + " " + item.surname).val(item.id));
      });
      if (id) {
        getData(id);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#modalInfoTitle').text("Что-то пошло не так...");
      $('#modalInfo').modal('show');
    }
  });
}

function getData(id) {
  $.ajax({
    url: uriLesson + "/" + id,
    type: "GET",
    accepts: "application/json",
    contentType: "application/json",
    cache: false,
    success: function(data) {
      var lesson = data;
      $("#inputID").val(lesson.id);
      $("#inputName").val(lesson.name);
      $("#inputTeacher").val(lesson.teacherId);
      $("#inputHours").val(lesson.hours);
      document.getElementById('inputRequired').checked = lesson.required;
      divMarks = $("#divMarks");
      $(divMarks).empty();
      data.marks.forEach(function(mark, key) {
        $(divMarks)
          .append(
            $("<button type=\"button\" class=\"btn btn-sm m-1\">")
            .on("click", function() {
              window.location = 'mark.html?id=' + mark.id;
            })
            .text(mark.value + " for " + mark.student.name + " " + mark.student.surname)
          );
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#modalInfoTitle').text("Что-то пошло не так...");
      $('#modalInfo').modal('show');
    }
  });
}

function saveData() {
  var lesson = {
    id        : document.getElementById('inputID').value,
    name      : document.getElementById('inputName').value,
    teacherID : document.getElementById('inputTeacher').value,
    hours     : document.getElementById('inputHours').value,
    required  : document.getElementById('inputRequired').checked,
  };
  var id = $("#inputID").val();
  if (id) {
    $.ajax({
      url: uriLesson,
      type: "PUT",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(lesson),
      success: function(result) {
        $('#modalInfoTitle').text("Изменения сохранены");
        $('#modalInfo').modal('show');
        getData(id);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#modalInfoTitle').text("Что-то пошло не так...");
        $('#modalInfo').modal('show');
      }
    });
  } else {
    lesson.id = 0;
    $.ajax({
      url: uriLesson,
      type: "POST",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(lesson),
      success: function(result) {
        $("#alertSuccess").alert();
        $('#modalInfoTitle').text("Вы сохранили информацию о новом предмете.");
        $('#modalInfo').modal('show');
        getData(result.id);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#modalInfoTitle').text("Что-то пошло не так...");
        $('#modalInfo').modal('show');
      }
    });
  }
}
