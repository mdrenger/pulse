$(document).ready(function () {

  var report_url = $('script[data-agency-report-url]').attr('data-agency-report-url');
  $.get(report_url, function(data) {
    renderTable(data.data);
  });

  var percentBar = function(field) {
    return function(data, type, row) {
      var percent = Utils.percent(
        row.https[field], row.https.eligible
      );

      if (type == "sort")
        return percent;
      return Utils.progressBar(percent);
    };
  };

  // var enforcesSubdomains = function(data, type, row) {
  //   if (row.https.subdomains && row.https.subdomains.eligible > 0) {
  //     var percent = Utils.percent(
  //       row.https.subdomains.enforces, row.https.subdomains.eligible
  //     );
  //     if (type == "sort")
  //       return percent;
  //     return Utils.progressBar(percent);
  //   } else {
  //     if (type == "sort")
  //       return 0;
  //     return "";
  //   }
  // };

  // var subdomains = function(data, type, row) {
  //   if (type == "sort") return null;

  //   if (!row.https.subdomains.eligible || row.https.subdomains.eligible <= 0)
  //     return "";

  //   var pct = Utils.percent(row.https.subdomains.enforces, row.https.subdomains.eligible);
  //   return "" + pct;
  // };

  var renderTable = function(data) {
    var table = $("table").DataTable({
      initComplete: Utils.searchLinks,

      responsive: {
          details: {
              type: "",
              display: $.fn.dataTable.Responsive.display.childRowImmediate
          }
      },

      data: data,

      columns: [
        {data: "name"},
        {
          data: "https.eligible",
          render: Utils.filterAgency("https")
        },
        {data: "https.uses"},
        {data: "https.enforces"},
        {data: "https.hsts"},
        //{data: "https.grade"}
      ],

      // order by number of domains
      order: [[1, "desc"]],

      columnDefs: [
        {
          targets: 0,
          cellType: "th",
          createdCell: function (td) {
            td.scope = "row";
          },
          width: "40%"
        },
        {
          targets: 1,
          width: "55px"
        },
        {
          render: percentBar("uses"),
          targets: 2,
        },
        {
          render: percentBar("enforces"),
          targets: 3,
        },
        {
          render: percentBar("hsts"),
          targets: 4,
        },
        /*{
          render: percentBar("grade"),
          targets: 5,
        }*/
      ],

      pageLength: 25,

      language: {
        search: "Suche:",
        lengthMenu: "Zeige _MENU_ Einträge",
        emptyTable: "Keine Daten in dieser Tabelle verfügbar",
        info: "Zeige _START_ - _END_ von _TOTAL_ Einträgen",
        infoEmpty: "Zeige 0 - 0 von 0 Einträgen",
        infoFiltered: "(von insgesamt _MAX_ Einträgen)",
        paginate: {
          previous: "<<",
          next: ">>"
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
