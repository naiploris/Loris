!function(t){function e(r){if(n[r])return n[r].exports;var a=n[r]={exports:{},id:r,loaded:!1};return t[r].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e){"use strict";function n(t,e,n){if("Description"===t){var r=function(t){return function(e){e.stopPropagation();var n=e.target.valueOf().innerText;$.post(loris.BaseURL+"/datadict/ajax/UpdateDataDict.php",{fieldname:t,description:n},function(t){})}};return React.createElement("td",{contentEditable:"true",className:"description",onBlur:r(n[1])},e)}return React.createElement("td",null,e)}Object.defineProperty(e,"__esModule",{value:!0}),window.formatDataDictColumn=n,e.default=n}]);