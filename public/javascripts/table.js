// table atlet
$(document).ready(function () {
    var table = $("#tableAtlet").DataTable({
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
            $("#addAtlet").modal("show");
          },
        },
        {
          extend: "print",
          title: "",
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
  
    table.buttons().container().appendTo("#example_wrapper .col-md-6:eq(0)");
  });


//table pelatih 
$(document).ready(function () {
    var table = $("#tablePelatih").DataTable({
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
            $("#addPelatih").modal("show");
          },
        },
        {
          extend: "print",
          title: "",
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
  
    table.buttons().container().appendTo("#example_wrapper .col-md-6:eq(0)");
  });

  //table cabor
$(document).ready(function () {
  var table = $("#tableCabor").DataTable({
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
          $("#addCabor").modal("show");
        },
      },
      {
        extend: "print",
        title: "",
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

  table.buttons().container().appendTo("#example_wrapper .col-md-6:eq(0)");
});