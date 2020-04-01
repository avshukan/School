const uriLesson = "api/lesson";
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
  setSearchString(searchString);
  page = getPage();
  setFilter(page);
});

function setSearchString(searchString) {
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

function getSearchString(){
  return document.getElementById("filterWord").value;
}

function getPage(){
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var page = params.get('page');
  if ((!page) || (page == "")) {
    page = 1;
  }
  return page;
}

function setFilter(page) {
  let searchString = getSearchString();
  setSearchString(searchString);
  updateLessonsList(searchString, page);
  updateCounterAndPagination(searchString, page);
}

function updateLessonsList(searchString, page) {
  $.ajax({
    type: "GET",
    url: uriLesson + "?searchString=" + searchString + "&page=" + page + "&pageSize=" + pageSize,
    cache: false,
    success: function(data) {
      refreshLessonsList(data);
    } 
  });
}

function updateCounterAndPagination(searchString, page) {
  $.ajax({
    type: "GET",
    url: uriLesson + "/count?searchString=" + searchString,
    cache: false,
    success: function(data) {
      updateCounter(data);
      updatePagintaion(searchString, page, data);
    }
  });
}

function updateCounter(count) {
  const lessonsCounter = $("#lessonsCounter");
  if (count > 0) {
    var last_digital = count % 10;
    var prevlast_digital = Math.floor((count % 100) / 10);
    var name = "Найдены " + count + " предмета";
    if ( (last_digital == 1) && (prevlast_digital != 1) ) {
      name = "Найден " + count + " предмет";
    }
    if ( (last_digital > 4) || (prevlast_digital == 1) ) {
      name = "Найдено " + count + " предметов";
    }
    lessonsCounter.text(name);
  } else {
    lessonsCounter.text("Не найдено ни одного предмета");
  }
}

function updatePagintaion(searchString, page, count) {
  const ul = $("#lessonsPagination");
  $(ul).empty();
  for (var i = 0; i * pageSize < count; i++) {
    let liClass = (page == i + 1) ? "page-item active" : "page-item";
    const li = $("<li class=\"" + liClass + "\"></li>")
      .append(
        $("<a class=\"page-link\" href=\"lessons.html?searchString=" + searchString + "&page=" + (i+1) + "\"></a>").text((i+1))
      );
    li.appendTo(ul);
  }
}

function refreshLessonsList(data) {
  const lessonsTable = $("#lessonsTable");
  $(lessonsTable).empty();
  data.forEach(function(item, key) {
    let buttonEdit = $("<button type=\"button\" class=\"btn btn-sm m-1\">")
      .on("click", function() {
        window.location = 'lesson.html?id=' + item.id;
      })
      .append(
        $("<i class=\"fa fa-pencil fa-fw\"></i>")
      );
    let buttonDelete;
    if (item.marks.length == 0) {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1\"><i class=\"fa fa-trash-o fa-fw\"></i></button>")
        .on("click", function() {
          $('#modaldeleteLesson div.modal-body div').text("Вы действительно хотите удалить предмет " + item.name + "?");
          $('#modaldeleteLessonSubmit').on("click", function() {
            deleteLesson(item.id);
            $('#modaldeleteLesson').modal('hide');
          });
          $('#modaldeleteLesson').modal('show');
        });
    } else {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1 disabled\"><i class=\"fa fa-trash-o fa-fw\"></i></button>");
    };
    var teacher = $("<td></td>")
      .append(
        $("<button type=\"button\" class=\"btn btn-sm m-1\">")
          .on("click", function() {
            window.location = 'teacher.html?id=' + item.teacher.id;
          })
          .text(item.teacher.name + " " + item.teacher.surname)
      );
    let checkboxRequired = (item.required) ? "checked" : "";
    const tr = $("<tr></tr>")
    .append($("<td></td>").text(item.id))
    .append($("<td></td>").text(item.name))
    .append(teacher)
    .append($("<td></td>").text(item.hours))
    .append(
      $("<td></td>")
      .append($("<input type=\"checkbox\" " + checkboxRequired + " disable></input>"))
    )
    .append(
      $("<td class=\"text-right\"></td>")
        .append(buttonEdit)
        .append(buttonDelete)
    );

    tr.appendTo(lessonsTable);
  });
}

function deleteLesson(id) {
  $.ajax({
    url: uriLesson + "/" + id,
    type: "DELETE",
    success: function(result) {
      setFilter(1);
    }
  });
}