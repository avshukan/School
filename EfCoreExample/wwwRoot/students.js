const uri = "api/student";
const pageSize = 4;

$(document).ready(function() {
  debugger;
  searchString = getParamFromUrl("searchString")
  if (!searchString) {
    searchString = "";
  }
  setSearchString(searchString);
  page = getParamFromUrl("page");
  if (!page) {
    page = 1;
  }
  setFilter(page);
});

function getParamFromUrl(param){
  urlSearch = location.search;
  if (urlSearch.indexOf("?") == 0) urlSearch = urlSearch.slice(1); // удалить первый символ ? (вопросительный знак), если он есть
  var params = new URLSearchParams(urlSearch);
  return params.get(param);
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
    var name = "Найдены " + count + " ученика";
    if ( (last_digital == 1) && (prevlast_digital != 1) ) {
      name = "Найден " + count + " ученик";
    }
    if ( (last_digital > 4) || (prevlast_digital == 1) ) {
      name = "Найдено " + count + " учеников";
    }
    counter.text(name);
  } else {
    counter.text("Не найдено ни одного ученика");
  }
}

function refreshPagintaion(searchString, page, count) {
  const ul = $("#pagination");
  $(ul).empty();
  for (var i = 0; i * pageSize < count; i++) {
    let liClass = (page == i + 1) ? "page-item active" : "page-item";
    const li = $("<li class=\"" + liClass + "\"></li>")
      .append(
        $("<a class=\"page-link\" href=\"students.html?searchString=" + searchString + "&page=" + (i+1) + "\"></a>").text((i+1))
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
        window.location = 'student.html?id=' + item.id;
      })
      .append(
        $("<i class=\"fa fa-pencil fa-fw\"></i>")
      );
    let buttonDelete;
    if (item.marks.length == 0) {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1\"><i class=\"fa fa-trash-o fa-fw\"></i></button>")
        .on("click", function() {
          $('#modaldeleteGroup div.modal-body div').text("Вы действительно хотите удалить ученика " + item.name + " " + item.surname + "?");
          $('#modaldeleteGroupSubmit').on("click", function() {
            deleteGroup(item.id);
            $('#modaldeleteGroup').modal('hide');
          });
          $('#modaldeleteGroup').modal('show');
        });
    } else {
      buttonDelete = $("<button type=\"button\" class=\"btn btn-danger btn-sm m-1 disabled\"><i class=\"fa fa-trash-o fa-fw\"></i></button>");
    };
    var groups = $("<td></td>")
      .append(
        $("<button type=\"button\" class=\"btn btn-sm m-1\">")
          .on("click", function() {
            window.location = 'group.html?id=' + item.group.id;
          })
          .text(item.group.grade + " " + item.group.literal)
      );
    const tr = $("<tr></tr>")
    .append($("<td></td>").text(item.id))
    .append($("<td></td>").text(item.name))
    .append($("<td></td>").text(item.surname))
    .append($("<td></td>").text(item.birthday))
    .append(groups)
    .append(
      $("<td class=\"text-right\"></td>")
        .append(buttonEdit)
        .append(buttonDelete)
    );

    tr.appendTo(table);
  });
}

function deleteStudent(id) {
  $.ajax({
    url: uri + "/" + id,
    type: "DELETE",
    success: function(result) {
      setFilter(getPageFromUrl());
    }
  });
}
