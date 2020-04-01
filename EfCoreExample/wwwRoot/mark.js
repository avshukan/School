const uriStudents = "api/students";
const uriLessons = "api/lessons";
var idStudent;
var idMark;

$(document).ready(function() {
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  idStudent = params.get('idStudent');
  idMark = params.get('idMark');
  $("#toStudent")
  .on("click", function() {
    window.location = 'student.html?id=' + idStudent;
  });
  var _getData = function() {
    if (idMark != "") {
      getData(idStudent, idMark);
    }
  };
  getListLessons(_getData);
});

function getListLessons(callback) {
  $.ajax({
    type: "GET",
    url: uriLessons,
    cache: false,
    success: function(data) {
      var select_lessons = $("#inputLesson");
      $(select_lessons)
      .empty();
      data.forEach(function(item, key) {
        $(select_lessons)
        .append(
          $("<option></option>").text(item.name).val(item.name)
        );
      });
      callback();
    }
  });
}

function getData(idStudent, idMark) {
  $.ajax({
    type: "GET",
    url: uriStudents + "/" + idStudent + "/marks/" + idMark,
    cache: false,
    success: function(data) {
      var mark = data;
      $("#inputID").val(mark.id);
      $("#inputLesson").val(mark.lesson);
      $("#inputValue").val(mark.value);
      $("#inputDate").val(mark.date.substring(0,10));
    }
  });
}

function saveData() {
  const uriStudents = "api/students";
  var id = $("#inputID").val();
  if (id) {
    var mark = {
      id     : document.getElementById('inputID').value,
      lesson : document.getElementById('inputLesson').value,
      value  : document.getElementById('inputValue').value,
      date   : document.getElementById('inputDate').value,
    };
    $.ajax({
      url: uriStudents + "/" + idStudent + "/marks/" + idMark,
      type: "PUT",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(mark),
      success: function(result) {
        $('#modalInfoTitle').text("Изменения сохранены");
        $('#modalInfo').modal('show');
        getData(idStudent, idMark);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#modalInfoTitle').text("Что-то пошло не так...");
        $('#modalInfo').modal('show');
      }
    });
  } else {
    var mark = {
      lesson : document.getElementById('inputLesson').value,
      value  : document.getElementById('inputValue').value,
      date   : document.getElementById('inputDate').value,
    };
    $.ajax({
      url: uriStudents + "/" + idStudent + "/marks/",
      type: "POST",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(mark),
      success: function(result) {
        $("#alertSuccess").alert();
        $('#modalInfoTitle').text("Вы сохранили информацию о новой отметке.");
        $('#modalInfo').modal('show');
        getData(idStudent, result.id);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#modalInfoTitle').text("Что-то пошло не так...");
        $('#modalInfo').modal('show');
      }
    });
  }
}
