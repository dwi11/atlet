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
            $("#addPBB").modal("show");
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