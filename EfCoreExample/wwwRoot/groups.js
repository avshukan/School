const uri = "api/group";
const pageSize = 4;

$(document).ready(function() {
  debugger;
  searchString = getSearchStringFromUrl()
  setSearchString(searchString);
  page = getPageFromUrl();
  setFilter(page);
});

function getPageFromUrl(){
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var page = params.get('page');
  if ((!page) || (page == "")) {
    page = 1;
  }
  return page;
}

function getSearchStringFromUrl(){
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  var page = params.get('page');
  var searchString = params.get('searchString');
  if (!searchString) {
    searchString = "";
  }
  return searchString;
}

function getSearchString(){
  return document.getElementById("filterWord").value;
}

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
        unsetFilter();
      });
  }
}

function setFilter(page) {
  let searchString = getSearchString();
  setSearchString(searchString);
  updateList(searchString, page);
  updateCounterAndPagination(searchString, page);
}

function unsetFilter() {
  $(filterWord).val("");
  setFilter(1);
}

function updateList(searchString, page) {
  $.ajax({
    type: "GET",
    url: uri + "?searchString=" + searchString + "&page=" + page + "&pageSize=" + pageSize,
    cache: false,
    success: function(data) {
      refreshList(data);
    } 
  });
}

function updateCounterAndPagination(searchString, page) {
  $.ajax({
    type: "GET",
    url: uri + "/count?searchString=" + searchString,
    cache: false,
    success: function(data) {
      refreshCounter(data);
      refreshPagintaion(searchString, page, data);
    }
  });
}

function refreshCounter(count) {
  const counter = $("#counter");
  if (count > 0) {
    var last_digital = count % 10;
    var prevlast_digital = Math.floor((count % 100) / 10);
    var name = "Найдены " + count + " группы";
    if ( (last_digital == 1) && (prevlast_digital != 1) ) {
      name = "Найдена " + count + " группа";
    }
    if ( (last_digital > 4) || (prevlast_digital == 1) ) {
      name = "Найдено " + count + " групп";
    }
    counter.text(name);
  } else {
    counter.text("Не найдено ни одной группы");
  }
}

function refreshPagintaion(searchString, page, count) {
  const ul = $("#pagination");
  $(ul).empty();
  for (var i = 0; i * pageSize < count; i++) {
    let liClass = (page == i + 1) ? "page-item active" : "page-item";
    const li = $("<li class=\"" + liClass + "\"></li>")
      .append(
        $("<a class=\"page-link\" href=\"groups.html?searchString=" + searchString + "&page=" + (i+1) + "\"></a>").text((i+1))
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
        window.location = 'group.html?id=' + item.id;
      })
      .append(
        $("<i class=\"fa fa-pencil fa-fw\"></i>")
      );
    let buttonDelete;
    if (item.students.length == 0) {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1\"><i class=\"fa fa-trash-o fa-fw\"></i></button>")
        .on("click", function() {
          $('#modaldeleteGroup div.modal-body div').text("Вы действительно хотите удалить группу " + item.grade + " " + item.literal + "?");
          $('#modaldeleteGroupSubmit').on("click", function() {
            deleteGroup(item.id);
            $('#modaldeleteGroup').modal('hide');
          });
          $('#modaldeleteGroup').modal('show');
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
    var students = $("<td></td>");
    item.students.forEach(function(student){
      students
        .append(
          $("<button type=\"button\" class=\"btn btn-sm m-1\">")
          .on("click", function() {
            window.location = 'student.html?id=' + student.id;
          })
          .text(student.name + " " + student.surname)
        );
    });
    const tr = $("<tr></tr>")
    .append($("<td></td>").text(item.id))
    .append($("<td></td>").text(item.grade + " " + item.literal))
    .append(teacher)
    .append(students)
    .append(
      $("<td class=\"text-right\"></td>")
        .append(buttonEdit)
        .append(buttonDelete)
    );

    tr.appendTo(table);
  });
}

function deleteGroup(id) {
  $.ajax({
    url: uri + "/" + id,
    type: "DELETE",
    success: function(result) {
      setFilter(getPageFromUrl());
    }
  });
}