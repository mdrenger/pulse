$(document).ready(function () {

  var report_url = $('script[data-domain-report-url]').attr('data-domain-report-url');
  $.get(report_url, function(data) {
    renderTable(data.data);
  });

  /**
  * I don't like this at all, but to keep the presentation synced
  * between the front-end table, and the CSV we generate, this is
  * getting replicated to the /data/update script in this repository,
  * and needs to be manually synced.
  *
  * The refactor that takes away from DataTables should also prioritize
  * a cleaner way to DRY (don't repeat yourself) this mess up.
  */

  var names = {
    uses: {
      "-1": "Nein",
      0: "Nein",
      1: "Ja", // (with certificate chain issues)
      2: "Ja"
    },

    enforces: {
      0: "", // N/A (no HTTPS)
      1: "Nein", // Present, not default
      2: "Ja", // Defaults eventually to HTTPS
      3: "Ja" // Defaults eventually + redirects immediately
    },

    hsts: {
      "-1": "", // N/A
      0: "Nein", // No
      1: "Ja", // HSTS on only that domain
      2: "Ja", // HSTS on subdomains
      3: "Ja, preload-ready", // HSTS on subdomains + preload flag
      4: "Ja, preloaded" // In the HSTS preload list
    },

    grade: {
      "-1": "",
      0: "F",
      1: "T",
      2: "C",
      3: "B",
      4: "A-",
      5: "A",
      6: "A+"
    }
  };

  var display = function(set) {
    return function(data, type, row) {
      if (type == "sort")
        return data;
      else
        return set[data.toString()];
    }
  };

  var linkGrade = function(data, type, row) {
    var grade = display(names.grade)(data, type);
    if (type == "sort")
      return grade;
    else if (grade == "")
      return ""
    else
      return "" +
        "<a href=\"" + labsUrlFor(row.domain) + "\" target=\"blank\">" +
          grade +
        "</a>";
  };

  var labsUrlFor = function(domain) {
    return "https://www.ssllabs.com/ssltest/analyze.html?d=" + domain;
  };


  // Construct a sentence explaining the HTTP situation.
  var httpDetails = function(data, type, row) {
    if (type == "sort")
      return null;

    var https = row.https.uses;
    var behavior = row.https.enforces;
    var hsts = row.https.hsts;
    var hsts_age = row.https.hsts_age;

    var details;

    if (https >= 1) {
      if (behavior >= 2)
        details = "Diese Domain erzwingt HTTPS. ";
      else
        details = "Diese Domain unterstützt HTTPS, aber erzwingt es nicht. ";

      if (hsts == 0) {
        // HSTS is considered a No *because* its max-age is too weak.
        if ((hsts_age > 0) && (hsts_age < 10886400))
          details += "Das " + l("hsts", "HSTS") + " Maximalalter (" + hsts_age + " Sekunden) ist zu kurz und sollte auf mindestens 1 Jahr (31536000 Sekunden) erhöht werden.";
        else
          details += l("hsts", "HSTS") + " ist nicht aktiviert.";
      }
      else if (hsts == 1)
        details += l("hsts", "HSTS") + " ist aktiviert, aber nicht für Subdomains und nicht für eine " + l("preload", "Hinterlegung in Browsern (preloading)") + "  bereit.";
      else if (hsts == 2)
        details += l("hsts", "HSTS") + " ist für alle Subdomains aktiviert, aber nicht für eine " + l("preload", "Hinterlegung in Browsern (preloading)") + " bereit.";
      else if (hsts == 3)
        details += l("hsts", "HSTS") + " ist für alle Subdomains aktiviert und " + l("preload", "in Browsern hinterlegt (preload)") + ".";

      // HSTS is strong enough to get a yes, but still less than a year.
      if (hsts > 0 && (hsts_age < 31536000))
        details += " Das HSTS Maximalalter (" + hsts_age + " Sekunden) sollte auf mindestens 1 Jahr (31536000 Sekunden) erhöht werden.";

    } else if (https == 0)
      details = "Diese Domain leitet Besucher von HTTPS auf HTTP um.";
    else if (https == -1)
      details = "Diese Domain unterstützt kein HTTPS.";

    return details;
  };

  var links = {
    rc4: "https://https.cio.gov/technical-guidelines/#rc4",
    hsts: "https://https.cio.gov/hsts/",
    sha1: "https://https.cio.gov/technical-guidelines/#signature-algorithms",
    ssl3: "https://https.cio.gov/technical-guidelines/#ssl-and-tls",
    tls: "https://https.cio.gov/technical-guidelines/#ssl-and-tls",
    fs: "https://https.cio.gov/technical-guidelines/#forward-secrecy",
    preload: "https://https.cio.gov/hsts/#hsts-preloading"
  };

  var l = function(slug, text) {
    return "<a href=\"" + (links[slug] || slug) + "\" target=\"blank\">" + text + "</a>";
  };

  // Mention a few high-impact TLS issues that will have affected
  // the SSL Labs grade.
  var tlsDetails = function(data, type, row) {
    if (type == "sort")
      return null;

    if (row.https.grade < 0)
      return "Keine Daten.";

    var config = [];

    if (row.https.uses == 1)
      config.push("benutzt eine Zertifikatskette, die für manche Besucher nicht valide ist");

    if (row.https.sig == "SHA1withRSA")
      config.push("benutzt ein Zertifikat mit einer " + l("sha1", "schwachen SHA-1-Signatur"));

    if (row.https.ssl3 == true)
      config.push("unterstützt das " + l("ssl3", "unsichere SSLv3 Protokoll"));

    if (row.https.rc4 == true)
      config.push("unterstützt die " + l("rc4", "veraltete RC4-Verschlüsselung"));

    if (row.https.tls12 == false)
      config.push("fehlt die Unterstützung für die " + l("tls", "aktuellste Version von TLS"));

    // Don't bother remarking if FS is Modern or Robust.
    if (row.https.fs <= 1)
      config.push("sollte " + l("fs", "forward secrecy", true) + " aktivieren");

    var issues = "";
    if (config.length > 0)
      issues += "Diese Domain " + config.join(", ") + ". ";

    issues += "Für mehr Details den " + l(labsUrlFor(row["Domain"]), "vollen SSL Labs-Report") + " lesen.";

    return issues;
  };

  var detailsKeyboardCtrl = function(){
      $('table tbody tr td:first-child').attr('tabindex','0')
      .attr('aria-label','Select for additional details')
      .on('keydown',function(e){
        if (e.keyCode == 13)
          $(this).click();
          $(this).parent().next('tr.child').focus();
      })
    };

  var renderTable = function(data) {
    var csv_url = $('script[data-domain-report-csv-url]').attr('data-domain-report-csv-url');
    var table = $("table").DataTable({

      responsive: true,

      data: data,

      initComplete: Utils.searchLinks,

      columns: [
        {
          data: "domain",
          width: "210px",
          render: Utils.linkDomain
        },
        {data: "canonical"},
        {data: "agency_name"},
        {
          data: "https.uses",
          render: display(names.uses)
        },
        {
          data: "https.enforces",
          render: display(names.enforces)
        },
        {
          data: "https.hsts",
          render: display(names.hsts)
        },
        /*{
          data: "https.grade",
          render: linkGrade
        },*/
        {
          data: "Details",
          render: httpDetails
        },
        /*
        {
          data: "TLS Issues",
          title: "TLS-Probleme",
          render: tlsDetails
        }*/
      ],

      columnDefs: [
        {
          targets: 0,
          cellType: "td",
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

      csv: csv_url,

      dom: 'LCftrip'

    });


    /**
    * Make the row expand when any cell in it is clicked.
    *
    * DataTables' child row API doesn't appear to work, likely
    * because we're getting child rows through the Responsive
    * plugin, not directly. We can't put the click event on the
    * whole row, because then sending the click to the first cell
    * will cause a recursive loop and stack overflow.
    *
    * So, we put the click on every cell except the first one, and
    * send it to its sibling. The first cell is already wired.
    */
    $('table tbody').on('click', 'td:not(.sorting_1)', function(e) {
      $(this).siblings("td.sorting_1").click();
    });


    //Adds keyboard control to first cell of table
    detailsKeyboardCtrl();

    table.on("draw.dt",function(){
       detailsKeyboardCtrl();
    });

  }

})