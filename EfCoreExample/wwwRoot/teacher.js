var Marks;
const uriTeachers = "api/teacher";

$(document).ready(function() {
  debugger;
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var id = params.get('id');
  if ((id) && (id != "")) {
    getData(id);
  }
});

function getData(id) {
  $.ajax({
    type: "GET",
    url: uriTeachers + "/" + id,
    cache: false,
    success: function(data) {
      var teacher = data;
      $("#inputID").val(teacher.id);
      $("#inputName").val(teacher.name);
      $("#inputSurname").val(teacher.surname);
      $("#inputBirthday").val(teacher.birthday.substring(0,10));
      $("#inputSex").val(teacher.sex);
      $("#inputSalary").val(teacher.salary);
      let teacherGroups = $("#teacherGroups");
      $(teacherGroups).empty();
      teacher.groups.forEach(function(group){
        $(teacherGroups)
          .append(
            $("<button type=\"button\" class=\"btn btn-sm m-1\">")
            .on("click", function() {
              window.location = 'group.html?id=' + group.id;
            })
            .text(group.grade + " " + group.literal)
          );
      });
      let teacherLessons = $("#teacherLessons");
      $(teacherLessons).empty();
      teacher.lessons.forEach(function(lesson){
        $(teacherLessons)
          .append(
            $("<button type=\"button\" class=\"btn btn-sm m-1\">")
            .on("click", function() {
              window.location = 'lesson.html?id=' + lesson.id;
            })
            .text(lesson.name)
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
  var teacher = {
    id       : document.getElementById('inputID').value,
    name     : document.getElementById('inputName').value,
    surname  : document.getElementById('inputSurname').value,
    birthday : document.getElementById('inputBirthday').value,
    sex      : document.getElementById('inputSex').value,
    salary   : document.getElementById('inputSalary').value,
  };
  var id = $("#inputID").val();
  if (id) {
    $.ajax({
      //url: uriTeachers + "/" + id,
      url: uriTeachers,
      type: "PUT",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(teacher),
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
    teacher.id = 0;
    $.ajax({
      url: uriTeachers,
      type: "POST",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(teacher),
      success: function(result) {
        $("#alertSuccess").alert();
        $('#modalInfoTitle').text("Вы сохранили информацию о новом преподавателе.");
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