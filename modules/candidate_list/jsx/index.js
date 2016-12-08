/* global DynamicDataTable formatColumn */

$(document).ready(function() {
  $("#cand").DynamicTable({freezeColumn: "pscid"});

  var table = <DynamicDataTable
    DataURL={`${loris.BaseURL}/candidate_list/?format=json`}
    getFormattedCell={formatColumn}
    freezeColumn="PSCID"
  />;

  React.render(table, document.getElementById("datatable"));
});
