$(document).ready(function () {
  var tables = [$("#tableAtlet"), $("#tablePelatih"), $("#tableCabor")];
  var addButtonIds = ["#addAtlet", "#addPelatih", "#addCabor"];

  tables.forEach(function (table, index) {
    table.DataTable({
      dom:
        "<'row'<'col-md-6'B><'col-md-6'f> >" +
        "<'row'<'col-md-12'tr>>" +
        "<'row'<'col-md-6'i><'col-md-6'p>>",
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      buttons: [
        {
          text: "Add",
          action: function (e, dt, node, config) {
            $(addButtonIds[index]).modal("show");
          },
        },
        {
          extend: "print",
          title: "",
          searchBuilder: true, // Aktifkan pencarian filter
        },
        {
          extend: "csv",
          title: "",
        },
        {
          extend: "excel",
          title: "",
        },
        {
          extend: "colvis",
        },
      ],
    });
  });

  tables.forEach(function (table) {
    table
      .DataTable()
      .buttons()
      .container()
      .appendTo("#example_wrapper .col-md-6:eq(0)");
  });
});
