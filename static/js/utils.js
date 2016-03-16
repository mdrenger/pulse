
var Utils = {
  // ignores the 'type' and 'row' args if sent as datatables callback

  percent: function(num, denom) {
    return Math.round((num / denom) * 100);
  },

  progressBar: function(data) {

    return '' +
      '<p class="progress">' + data + '%</p>' +
      '<div class="progress-bar-indication">' +
        '<span class="meter width' + data + '" style="width: ' + data + '%">' +
        '&nbsp;' +
        '</span>' +
      '</div>';
  },

  linkDomain: function(data, type, row) {
    if (type == "sort")
      return data;
    else
      return "" +
        "<a href=\"" + row['canonical'] + "\" target=\"blank\">" +
          data +
        "</a>";
  },

  // used to make "71" say "71 domains" and link to filtered domains
  filterAgency: function(page) {
    return function(data, type, row) {
      if (type == "sort")
        return data;
      else
        return "" +
          "<a href=\"" + Utils.rootUrl() + page + "/domains/#" +
            QueryString.stringify({q: row["name"]}) + "\">" +
            data +
          "</a>";
    }
  },

  searchLinks: function() {
    var api = this.api();
    var query = QueryString.parse(location.hash).q;

    if (query) {
      $("input[type=search]").val(query);
      api.search(query).draw();
    }
  },

  rootUrl: function() {
    return $("meta[name=root_url]").attr("content") || "/";
  }
};
