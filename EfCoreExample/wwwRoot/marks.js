const uriMark = "api/mark";
const uriLesson = "api/lesson";
const uriStudent = "api/student";
const pageSize = 4;

$(document).ready(function() {
  debugger;
  getLessonsList();
});

function getParamFromUrl(param){
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  return params.get(param);
}

function getLessonFromFilter(){
  return document.getElementById("inputLesson").value;
}

function getStudentFromFilter(){
  return document.getElementById("inputStudent").value;
}

function setFilter(lesson, student) {
  $("#inputLesson").val(lesson);
  $("#inputStudent").val(student);
  const filterStack = $("#filterStack");
  $(filterStack).empty();
  filterStack.append($("<i class=\"fa fa-filter fa-stack-1x\"></i>"));
  if ( getLessonFromFilter() > "" || getStudentFromFilter() > "" ) {
    filterStack.append($("<i class=\"fa fa-remove fa-stack-1x text-danger\"></i>"));
    $(filterStack)
      .on("click", function() {
        unsetFilter();
      });
  }
}

function unsetFilter() {
  $("inputLesson").val("");
  $("inputStudent").val("");
  setFilter(1);
}

function useFilter(page) {
  lesson = getLessonFromFilter();
  student = getStudentFromFilter();
  setFilter(lesson, student);
  updateList(lesson, student, page);
  updateCounterAndPagination(lesson, student, page);
}

function getLessonsList() {
  $.ajax({
    url: uriLesson,
    type: "GET",
    accepts: "application/json",
    contentType: "application/json",
    cache: false,
    success: function(data) {
      var inputLesson = $("#inputLesson");
      $(inputLesson).empty();
      data.forEach(function(item, key) {
        $(inputLesson).append($("<option></option>").text(item.name).val(item.id));
      });
      getStudentsList()
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#modalInfoTitle').text("Что-то пошло не так...");
      $('#modalInfo').modal('show');
    }
  });
}

function getStudentsList() {
  $.ajax({
    url: uriStudent,
    type: "GET",
    accepts: "application/json",
    contentType: "application/json",
    cache: false,
    success: function(data) {
      var inputStudent = $("#inputStudent");
      $(inputStudent).empty();
      data.forEach(function(item, key) {
        $(inputStudent).append($("<option></option>").text(item.name).val(item.id));
      });
      lesson = getParamFromUrl("lesson");
      student = getParamFromUrl("student");
      setFilter(lesson, student);
      page = getParamFromUrl("page");
      if (!page) {
        page = 1;
      }
      useFilter(page);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#modalInfoTitle').text("Что-то пошло не так...");
      $('#modalInfo').modal('show');
    }
  });
}

function updateList(lesson, student, page) {
  $.ajax({
    type: "GET",
    url: uriMark + "?lesson=" + lesson + "&student=" + student + "&page=" + page + "&pageSize=" + pageSize,
    cache: false,
    success: function(data) {
      refreshList(data);
    } 
  });
}

function updateCounterAndPagination(lesson, student, page) {
  $.ajax({
    type: "GET",
    url: uriMark + "/count?lesson=" + lesson + "&student=" + student,
    cache: false,
    success: function(data) {
      refreshCounter(data.length);
      refreshPagintaion(lesson, student, page, data.length);
    }
  });
}

function refreshCounter(count) {
  const counter = $("#counter");
  if (count > 0) {
    var last_digital = count % 10;
    var prevlast_digital = Math.floor((count % 100) / 10);
    var name = "Найдены " + count + " отметки";
    if ( (last_digital == 1) && (prevlast_digital != 1) ) {
      name = "Найдена " + count + " отметка";
    }
    if ( (last_digital > 4) || (prevlast_digital == 1) ) {
      name = "Найдено " + count + " отметок";
    }
    counter.text(name);
  } else {
    counter.text("Не найдено ни одной отметки");
  }
}

function refreshPagintaion(lesson, student, page, count) {
  const ul = $("#pagination");
  $(ul).empty();
  for (var i = 0; i * pageSize < count; i++) {
    let liClass = (page == i + 1) ? "page-item active" : "page-item";
    const li = $("<li class=\"" + liClass + "\"></li>")
      .append(
        $("<a class=\"page-link\" href=\"marks.html?lesson=" + lesson + "&student=" + student + "&page=" + (i+1) + "\"></a>").text((i+1))
      );
    li.appendTo(ul);
  }
}

function refreshList(data) {
  const table = $("#table");
  $(table).empty();
  data.forEach(function(item, key) {
    let buttonEdit = $("<button type=\"button\" class=\"btn btn-sm mx-1\">")
      .on("click", function() {
        window.location = 'mark.html?id=' + item.id;
      })
      .append(
        $("<i class=\"fa fa-pencil fa-fw\"></i>")
      );
    let buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1\"><i class=\"fa fa-trash-o fa-fw\"></i></button>")
        .on("click", function() {
          $('#modaldeleteMark div.modal-body div').text("Вы действительно хотите удалить отметку " + item.value + "?");
          $('#modaldeleteGroupSubmit').on("click", function() {
            deleteMark(item.id);
            $('#modaldeleteMark').modal('hide');
          });
          $('#modaldeleteMark').modal('show');
        });
    const tr = $("<tr></tr>")
    .append($("<td></td>").text(item.id))
    .append($("<td></td>")
      .append($("<button type=\"button\" class=\"btn btn-sm m-1\">")
        .on("click", function() {
          window.location = 'lesson.html?id=' + item.lesson.id;
        })
        .text(item.lesson.name)
      )
    )
    .append($("<td></td>")
      .append($("<button type=\"button\" class=\"btn btn-sm m-1\">")
        .on("click", function() {
          window.location = 'student.html?id=' + item.student.id;
        })
        .text(item.student.name + " " + item.student.surname)
      )
    )
    .append($("<td></td>").text(item.value))
    .append($("<td></td>").text(item.date))
    .append(
      $("<td class=\"text-right\"></td>")
        .append(buttonEdit)
        .append(buttonDelete)
    );
    tr.appendTo(table);
  });
}

function deleteMark(id) {
  $.ajax({
    url: uriMark + "/" + id,
    type: "DELETE",
    success: function(result) {
      setFilter(getParamFromUrl("lesson"), getParamFromUrl("student"));
    }
  });
}
