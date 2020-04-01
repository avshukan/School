const uriStudent = "api/student";
const uriGroup = "api/group";

$(document).ready(function() {
  debugger;
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var id = params.get('id');
  getGroupsList(id);
});

function getGroupsList(id) {
  $.ajax({
    url: uriGroup,
    type: "GET",
    accepts: "application/json",
    contentType: "application/json",
    cache: false,
    success: function(data) {
      var inputGroup = $("#inputGroup");
      $(inputGroup).empty();
      data.forEach(function(item, key) {
        $(inputGroup).append($("<option></option>").text(item.grade + " " + item.literal).val(item.id));
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
    type: "GET",
    url: uriStudent + "/" + id,
    cache: false,
    success: function(data) {
      var student = data;
      $("#inputID").val(student.id);
      $("#inputName").val(student.name);
      $("#inputSurname").val(student.surname);
      $("#inputBirthday").val(student.birthday.substring(0,10));
      $("#inputGroup").val(student.groupId);
      Marks = student.marks;
      divMarks = $("#divMarks");
      $(divMarks).empty();
      student.marks.forEach(function(mark, key) {
        $(divMarks)
          .append(
            $("<button type=\"button\" class=\"btn btn-sm m-1\">")
            .on("click", function() {
              window.location = 'mark.html?id=' + mark.id;
            })
            .text(mark.value + " in " + mark.lesson.name)
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
  var student = {
    id       : document.getElementById('inputID').value,
    name     : document.getElementById('inputName').value,
    surname  : document.getElementById('inputSurname').value,
    birthday : document.getElementById('inputBirthday').value,
    group    : document.getElementById('inputGroup').value,
    marks    : Marks,
  };
  var id = $("#inputID").val();
  if (id) {
    $.ajax({
      url: uriStudent,
      type: "PUT",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(student),
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
    student.id = 0;
    $.ajax({
      url: uriStudent,
      type: "POST",
      accepts: "application/json",
      contentType: "application/json",
      cache: false,
      data: JSON.stringify(student),
      success: function(result) {
        $("#alertSuccess").alert();
        $('#modalInfoTitle').text("Вы сохранили информацию о новом ученике.");
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