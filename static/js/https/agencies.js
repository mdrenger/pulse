$(document).ready(function () {
  var domain_type = $('script[data-domain-type]').attr('data-domain-type');

  var report_url = $('script[data-agency-report-url]').attr('data-agency-report-url');
  var report_csv_url = $('script[data-agency-report-csv-url]').attr('data-agency-report-csv-url');

  $.get(report_url, function(data) {
    Tables.initAgency(data.data, {

      csv: report_csv_url,

      columns: [
        {
          cellType: "th",
          createdCell: function (td) {td.scope = "row";},
          data: "name"
        },
        {
          data: "https.eligible", // sort on this, but
          render: eligibleHttps,
          type: "num"
        },
        {
          data: "https.compliant",
          type: "numeric",
          render: Tables.percent("https", "compliant"),
          className: "compliant",
          width: "100px"
        },
        {
          data: "https.enforces",
          type: "numeric",
          render: Tables.percent("https", "enforces")
        },
        {
          data: "https.hsts",
          type: "numeric",
          render: Tables.percent("https", "hsts")
        },
        {
          data: "crypto.bod_crypto",
          type: "numeric",
          render: Tables.percent("crypto", "bod_crypto")
        },
        {
          data: "preloading.preloaded",
          type: "numeric",
          render: Tables.percent("preloading", "preloaded")
        }
      ]

    });
  });

  var eligibleHttps = function(data, type, row) {
    var services = row.https.eligible;
    var domains = row.total_domains;
    if (type == "sort") return services;

    var link = function(text) {
      return "" +
        "<a href=\"/https/" + domain_type + "/domains/#" +
          QueryString.stringify({q: row["name"]}) + "\">" +
           text +
        "</a>";
    }

    return link("" + services);
  };


});
