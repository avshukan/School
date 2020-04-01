const uriGroup = "api/group";
const uriTeacher = "api/teacher";

$(document).ready(function() {
  debugger;
  var id = getParamFromUrl('id');
  getTeachersList(id);
});

function getParamFromUrl(param) {
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  return params.get(param);
}

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
    url: uriGroup + "/" + id,
    type: "GET",
    accepts: "application/json",
    contentType: "application/json",
    cache: false,
    success: function(data) {
      var group = data;
      $("#inputID").val(group.id);
      $("#inputGrade").val(group.grade);
      $("#inputLiteral").val(group.literal);
      $("#inputTeacher").val(group.teacherId);
      var studentsList = $("#studentsList");
      $(studentsList).empty();
      group.students.forEach(function(student, key) {
        $(studentsList)
          .append(
            $("<button type=\"button\" class=\"btn btn-sm m-1\">")
            .on("click", function() {
              window.location = 'student.html?id=' + student.id;
            })
            .text(student.name + " " + student.surname)
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
  var group = {
    id        : document.getElementById('inputID').value,
    grade     : document.getElementById('inputGrade').value,
    literal   : document.getElementById('inputLiteral').value,
    teacherID : document.getElementById('inputTeacher').value,
  };
  var id = $("#inputID").val();
  if (id) {
    $.ajax({
      url: uriGroup,
      type: "PUT",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(group),
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
    group.id = 0;
    $.ajax({
      url: uriGroup,
      type: "POST",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(group),
      success: function(result) {
        $("#alertSuccess").alert();
        $('#modalInfoTitle').text("Вы сохранили информацию о новой группе.");
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