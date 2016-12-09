/* global ReactDOM, formatColumn */

$(document).ready(function() {
  if (loris.TestName === "user_accounts") {

    if (loris.Subtest === "edit_user") {
      editPage();
      return;
    }

    ReactDOM.render(
      <DynamicDataTable
        DataURL={loris.BaseURL + '/user_accounts/?format=json'}
        getFormattedCell={formatColumn}
        freezeColumn="PSCID"
      />,
      document.getElementById("datatable")
    );
  }
});

function editPage() {
  // define event handler for all the header sections
  $(".perm_header").click(toggleGroup);
  // Get rid of the extra <br /> tag that Quickform element
  // adds at the top of each <div>
  $(".perm_header").each(function(idx, el) {
    let id = el.id;
    let section = id.substring(7);
    let section_el = $("#perms_" + section + " br:nth-child(1)").hide();
  });
}

function toggleGroup(group) {
  if (group) {
    // id is the header that was clicked
    let id = group.target.id;

    // chop off header_ to get section name
    let section = id.substring(7);

    // hide (or show) the appropriate div for that section
    let section_el = $("#perms_" + section);
    section_el.toggle();
  }
}
