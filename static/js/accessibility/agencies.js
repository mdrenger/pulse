$(document).ready(function () {

  $.get("/static/data/tables/accessibility/agencies.json", function(data) {
    renderTable(data.data);
  });

  var renderTable = function(data) {
    var table = $("table").DataTable({
      responsive: true,
      initComplete: Utils.searchLinks,

      data: data,

      columns: [
        {
          data: "Agency",
          cellType: "th"
        },
        {
          data: "Color Contrast Errors"
        },
        {
          data: "HTML Attribute Errors"
        },
        {
          data: "Alt Tag Errors"
        }
      ],

      order: [[1, "desc"]],

      columnDefs: [
        {
          targets: 0,
          cellType: "th",
          createdCell: function (td) {
            td.scope = "row";
          }
        }
      ],

      "oLanguage": {
        "sSearch": "Suche:",
        "sLengthMenu": "Zeige _MENU_ Einträge",
        "sInfo": "Zeige _START_ - _END_ von _TOTAL_ Einträgen",
        "sInfoFiltered": "(von insgesamt _MAX_ Einträgen)",
        "oPaginate": {
          "sPrevious": "<<",
          "sNext": ">>"
        }
      },

      dom: 'Lftrip'

    });

    Utils.updatePagination();
    table.on("draw.dt",function(){
      Utils.updatePagination();
    });
  };
  
});
