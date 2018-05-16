!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports){"use strict";function formatColumn(column,cell,rowData,rowHeaders){if(loris.hiddenHeaders.indexOf(column)>-1)return null;var row={};rowHeaders.forEach(function(header,index){row[header]=rowData[index]},this);var hashName,url,log,patientname=row.PatientName,uid=row.SeriesUID;return"Problem"===column&&"Protocol Violation"===row.Problem?React.createElement("td",null,React.createElement("a",{href:"#",onClick:loris.loadFilteredMenuClickHandler("mri_violations/mri_protocol_check_violations",{PatientName:patientname,SeriesUID:uid})},"Protocol Violation")):"Problem"===column&&"Could not identify scan type"===row.Problem?React.createElement("td",null,React.createElement("a",{href:"#",onClick:loris.loadFilteredMenuClickHandler("mri_violations/mri_protocol_violations",{PatientName:patientname,SeriesUID:uid})},"Could not identify scan type")):"Resolution Status"===column?(hashName="resolvable["+row.Hash+"]",React.createElement("td",null,React.createElement("select",{name:hashName,className:"form-control input-sm"},React.createElement("option",{value:"unresolved"},"Unresolved"),React.createElement("option",{value:"reran"},"Reran"),React.createElement("option",{value:"emailed"},"Emailed site/pending"),React.createElement("option",{value:"inserted"},"Inserted"),React.createElement("option",{value:"rejected"},"Rejected"),React.createElement("option",{value:"inserted_flag"},"Inserted with flag"),React.createElement("option",{value:"other"},"Other")))):"MincFile"===column?(log="Could not identify scan type"===row.Problem?1:"Protocol Violation"===row.Problem?2:3,url=loris.BaseURL+"/brainbrowser/?minc_id="+log+"l"+row.JoinID,React.createElement("td",null,React.createElement("a",{href:url,target:"_blank"},cell))):React.createElement("td",null,cell)}Object.defineProperty(exports,"__esModule",{value:!0}),window.formatColumn=formatColumn,exports.default=formatColumn}]);
//# sourceMappingURL=columnFormatterUnresolved.js.map