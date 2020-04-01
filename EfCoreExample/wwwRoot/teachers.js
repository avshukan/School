const uri = "api/teacher";
const pageSize = 4;

$(document).ready(function() {
  debugger;
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var searchString = params.get('searchString');
  if (!searchString) {
    searchString = "";
  }
  var page = params.get('page');
  if ((!page) || (page == "")) {
    page = 1;
  }
  showTeachersFilter(searchString);
  updateTeachersList(searchString, page);
  updateCountAndPagination(searchString, page);
});

function setFilter(page) {
  let searchString = document.getElementById("filterWord").value;
  showTeachersFilter(searchString);
  updateTeachersList(searchString, page);
  updateCountAndPagination(searchString, page);
}

function showTeachersFilter(searchString) {
  const filterWord = $("#filterWord");
  $(filterWord).val(searchString);
  const filterStack = $("#filterStack");
  $(filterStack).empty();
  filterStack.append($("<i class=\"fa fa-filter fa-stack-1x\"></i>"));
  if ( searchString.length > 0 ) {
    filterStack.append($("<i class=\"fa fa-remove fa-stack-1x text-danger\"></i>"));
    $(filterStack)
      .on("click", function() {
        $(filterWord).val("");
        setFilter(1);
      });
  }
}

function updateTeachersList(searchString, page) {
  $.ajax({
    type: "GET",
    url: uri + "?searchString=" + searchString + "&page=" + page + "&pageSize=" + pageSize,
    cache: false,
    success: function(data) {
      showTeachersList(data);
    } 
  });
}

function updateCountAndPagination(searchString, page) {
  $.ajax({
    type: "GET",
    url: uri + "/count?searchString=" + searchString,
    cache: false,
    success: function(data) {
      showTeachersCount(data);
      showTeachersPagintaion(searchString, page, data);
    }
  });
}

function showTeachersCount(count) {
  const counter = $("#counter");
  if (count > 0) {
    var last_digital = count % 10;
    var prevlast_digital = Math.floor((count % 100) / 10);
    var name = "Найдены " + count + " преподавателя";
    if ( (last_digital == 1) && (prevlast_digital != 1) ) {
      name = "Найден " + count + " преподаватель";
    }
    if ( (last_digital > 4) || (prevlast_digital == 1) ) {
      name = "Найдено " + count + " преподавателей";
    }
    counter.text(name);
  } else {
    counter.text("Не найдено ни одного преподавателя");
  }
}

function showTeachersPagintaion(searchString, page, count) {
  const ul = $("#teachers_pagination");
  $(ul).empty();
  for (var i = 0; i * pageSize < count; i++) {
    let liClass = (page == i + 1) ? "page-item active" : "page-item";
    const li = $("<li class=\"" + liClass + "\"></li>")
      .append(
        $("<a class=\"page-link\" href=\"teachers.html?searchString=" + searchString + "&page=" + (i+1) + "\"></a>").text((i+1))
      );
    li.appendTo(ul);
  }
}

function showTeachersList(data) {
  const tBody = $("#teachers");
  $(tBody).empty();
  data.forEach(function(item, key) {
    let buttonEdit = $("<button type=\"button\" class=\"btn btn-sm m-1\">")
      .on("click", function() {
        window.location = 'teacher.html?id=' + item.id;
      })
      .append(
        $("<i class=\"fa fa-pencil fa-fw\"></i>")
      );
    let buttonDelete;
    if ((item.groups.length == 0) && (item.lessons.length == 0)) {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1\"><i class=\"fa fa-trash-o fa-fw\"></i></button>")
        .on("click", function() {
          $('#modaldeleteTeacher div.modal-body div').text("Вы действительно хотите удалить преподавателя " + item.name + " " + item.surname + "?");
          $('#modaldeleteTeacherSubmit').on("click", function() {
            deleteTeacher(item.id);
            $('#modaldeleteTeacher').modal('hide');
          });
          $('#modaldeleteTeacher').modal('show');
        });
    } else {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1 disabled\"><i class=\"fa fa-trash-o fa-fw\"></i></button>");
    };
    var item_groups = $("<td></td>");
    item.groups.forEach(function(group){
      item_groups
        .append(
          $("<button type=\"button\" class=\"btn btn-sm m-1\">")
          .on("click", function() {
            window.location = 'group.html?id=' + group.id;
          })
          .text(group.grade + " " + group.literal)
        );
    });
    var item_lessons = $("<td></td>");
    item.lessons.forEach(function(lesson){
      item_lessons
        .append(
          $("<button type=\"button\" class=\"btn btn-sm m-1\">")
          .on("click", function() {
            window.location = 'lesson.html?id=' + lesson.id;
          })
          .text(lesson.name)
        );
    });
    const tr = $("<tr></tr>")
    .append($("<td></td>").text(item.id))
    .append($("<td></td>").text(item.name))
    .append($("<td></td>").text(item.surname))
    .append($("<td></td>").text(item.birthday.substring(0,10)))
    .append($("<td></td>").text(item.salary))
    .append(item_groups)
    .append(item_lessons)
    .append(
      $("<td class=\"text-right\"></td>")
        .append(buttonEdit)
        .append(buttonDelete)
    );

    tr.appendTo(tBody);
  });
}

function deleteTeacher(id) {
  $.ajax({
    url: uri + "/" + id,
    type: "DELETE",
    success: function(result) {
      urlSearch = location.search;
      if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
      var params = new URLSearchParams(urlSearch);
      var page = params.get('page');
      if ((!page) || (page == "")) {
        page = 1;
      }
      setFilter(page);
    }
  });
}