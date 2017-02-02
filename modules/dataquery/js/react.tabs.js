!function(e){function t(l){if(a[l])return a[l].exports;var r=a[l]={exports:{},id:l,loaded:!1};return e[l].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});/**
	 *  The following file contains the components used for displaying the tab content
	 *
	 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
	 *  @author   Jordan Stirling <jstirling91@gmail.com>
	 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
	 *  @link     https://github.com/mohadesz/Loris-Trunk
	 */
var a=React.createClass({displayName:"Loading",render:function(){return React.createElement("div",{className:"row"},React.createElement("h3",{className:"text-center loading-header"},"We are currently working hard to load your data. Please be patient."),React.createElement("div",{className:"spinner"},React.createElement("div",{className:"bounce1"}),React.createElement("div",{className:"bounce2"}),React.createElement("div",{className:"bounce3"})))}}),l=React.createClass({displayName:"TabPane",mixins:[React.addons.PureRenderMixin],render:function(){var e="tab-pane";return this.props.Active&&(e+=" active"),this.props.Loading?React.createElement("div",{className:e,id:this.props.TabId},React.createElement(a,null)):React.createElement("div",{className:e,id:this.props.TabId},React.createElement("h1",null,this.props.Title),this.props.children)}}),r=React.createClass({displayName:"InfoTabPane",mixins:[React.addons.PureRenderMixin],render:function(){return React.createElement(l,{Title:"Welcome to the Data Query Tool",TabId:this.props.TabId,Active:!0,Loading:this.props.Loading},React.createElement("p",null,"Data was last updated on ",this.props.UpdatedTime,"."),React.createElement("p",null,"Please define or use your query by using the following tabs."),React.createElement("dl",null,React.createElement("dt",null,"Define Fields"),React.createElement("dd",null,"Define the fields to be added to your query here."),React.createElement("dt",null,"Define Filters"),React.createElement("dd",null,"Define the criteria to filter the data for your query here."),React.createElement("dt",null,"View Data"),React.createElement("dd",null,"See the results of your query."),React.createElement("dt",null,"Statistical Analysis"),React.createElement("dd",null,"Visualize or see basic statistical measures from your query here."),React.createElement("dt",null,"Load Saved Query"),React.createElement("dd",null,"Load a previously saved query (by name) by selecting from this menu."),React.createElement("dt",null,"Manage Saved Queries"),React.createElement("dd",null,"Either save your current query or see the criteria of previously saved quer  ies here.")))}}),n=React.createClass({displayName:"FieldSelectTabPane",render:function(){return React.createElement(l,{TabId:this.props.TabId,Loading:this.props.Loading},React.createElement(FieldSelector,{title:"Fields",items:this.props.categories,onFieldChange:this.props.onFieldChange,selectedFields:this.props.selectedFields,Visits:this.props.Visits,fieldVisitSelect:this.props.fieldVisitSelect}))}}),s=React.createClass({displayName:"FilterSelectTabPane",render:function(){return React.createElement(l,{TabId:this.props.TabId,Loading:this.props.Loading},React.createElement(FilterBuilder,{items:this.props.categories,updateFilter:this.props.updateFilter,filter:this.props.filter,Visits:this.props.Visits}))}}),i=React.createClass({displayName:"ViewDataTabPane",getInitialState:function(){return{sessions:[]}},runQuery:function(){this.props.onRunQueryClicked&&this.props.onRunQueryClicked(this.props.Fields,this.props.Sessions)},changeDataDisplay:function(e){this.props.changeDataDisplay(e)},getOrCreateProgressElement:function(e){var t,a=document.getElementById(e);return a?a:(t=document.getElementById("progress"),a=document.createElement("div"),a.setAttribute("id",e),t.appendChild(a),a)},getOrCreateDownloadLink:function(e,t){var a,l,r=document.getElementById("DownloadLink"+e);return r?r:(a=document.getElementById("downloadlinksUL"),r=document.createElement("a"),r.download=e,r.type=t,r.textContent="Zip file: "+e,r.setAttribute("id","DownloadLink"+e),l=document.createElement("li"),l.appendChild(r),a.appendChild(l),r)},downloadData:function(){var e,t=(new JSZip,this.props.FileData),a=(new Array(t.length),[]),l=this;window.dataBlobs=[],(t.length<100||confirm("You are trying to download more than 100 files. This may be slow or crash your web browser.\n\nYou may want to consider splitting your query into more, smaller queries by defining more restrictive filters.\n\nPress OK to continue with attempting to download current files or cancel to abort."))&&(e=new Worker(loris.BaseURL+"/GetJS.php?Module=dataquery&file=workers/savezip.js"),e.addEventListener("message",function(e){var t,r,n,s,i,c;if("SaveFile"===e.data.cmd)r=l.getOrCreateProgressElement("download_progress"),window.dataBlobs[e.data.FileNo-1]=new Blob([e.data.buffer],{type:"application/zip"}),a[e.data.FileNo-1]=window.URL.createObjectURL(window.dataBlobs[e.data.FileNo-1]),t=l.getOrCreateDownloadLink(e.data.Filename,"application/zip"),t.href=a[e.data.FileNo-1],r=l.getOrCreateProgressElement("zip_progress"),r.textContent="";else if("Progress"===e.data.cmd)r=l.getOrCreateProgressElement("download_progress"),r.innerHTML='Downloading files: <progress value="'+e.data.Complete+'" max="'+e.data.Total+'">'+e.data.Complete+" out of "+e.data.Total+"</progress>";else if("Finished"===e.data.cmd){if(1===a.length&&$("#downloadlinksUL li a")[0].click(),a.length>1)for(r=document.getElementById("downloadlinks"),r.style.display="initial",i=$("#downloadlinksUL li a"),c=0;c<a.length;c+=1)n=i[c].id.slice("DownloadLinkFiles-".length,-4),s="files-"+n+"of"+e.data.NumFiles+".zip",i[c].download=s,i[c].href=a[c],i[c].textContent="Zip file: "+s;r=l.getOrCreateProgressElement("download_progress"),r.textContent="Finished generating zip files"}else"CreatingZip"===e.data.cmd&&(r=l.getOrCreateProgressElement("zip_progress"),r.textContent="Creating a zip file with current batch of downloaded files. Process may be slow before proceeding.")}),e.postMessage({Files:t,BaseURL:loris.BaseURL}))},render:function(){var e=React.createElement("div",{className:"row"},React.createElement("div",{className:"commands col-xs-12 form-group"},React.createElement("button",{className:"btn btn-primary",onClick:this.runQuery},"Run Query"),React.createElement("button",{className:"btn btn-primary",onClick:this.downloadData},"Download Data as ZIP")),React.createElement("div",{id:"progress",className:"col-xs-12"}),React.createElement("div",{id:"downloadlinks",className:"col-xs-12"},React.createElement("ul",{id:"downloadlinksUL"}))),t=[];for(var a in this.props.Criteria)if(this.props.Criteria.hasOwnProperty(a)){var r=this.props.Criteria[a];void 0===r?t.push(React.createElement("div",{className:"alert alert-warning",role:"alert"},a," has been added as a filter but not had criteria defined.")):t.push(React.createElement("div",{className:"row"},React.createElement("span",{className:"col-sm-3"},a),React.createElement("span",{className:"col-sm-3"},r.operator),React.createElement("span",{className:"col-sm-3"},r.value)))}return React.createElement(l,{TabId:this.props.TabId,Loading:this.props.Loading},React.createElement("h2",null,"Query Criteria"),t," ",e,React.createElement("div",{className:"form-group form-horizontal row"},React.createElement("label",{for:"selected-input",className:"col-sm-1 control-label"},"Data"),React.createElement("div",{className:"col-sm-4"},React.createElement("div",{className:"btn-group"},React.createElement("button",{id:"selected-input",type:"button",className:"btn btn-default dropdown-toggle","data-toggle":"dropdown"},React.createElement("span",{id:"search_concept"},this.props.displayType),React.createElement("span",{className:"caret"})),React.createElement("ul",{className:"dropdown-menu",role:"menu"},React.createElement("li",{onClick:this.changeDataDisplay.bind(this,0)},React.createElement("div",{className:"col-sm-12"},React.createElement("h5",{className:""},"Cross-sectional"))),React.createElement("li",{onClick:this.changeDataDisplay.bind(this,1)},React.createElement("div",{className:"col-sm-12"},React.createElement("h5",{className:""},"Longitudinal"))))))),React.createElement(StaticDataTable,{Headers:this.props.RowHeaders,RowNumLabel:"Identifiers",Data:this.props.Data,RowNameMap:this.props.RowInfo}))}}),c=React.createClass({displayName:"ScatterplotGraph",lsFit:function(e){var t,a,l,r=0,n=jStat(e).mean(),s=n[0],i=n[1],c=0,o=0;for(r=0;r<e.length;r+=1)a=e[r][0],l=e[r][1],c+=(a-s)*(l-i),o+=(a-s)*(a-s);return t=c/o,[i-t*s,t]},minmaxx:function(e){var t,a,l;for(t=0;t<e.length;t+=1)(e[t][0]<a||void 0===a)&&void 0!==e[t][0]&&null!==e[t][0]&&(a=e[t][0]),(e[t][0]>l||void 0===l)&&void 0!==e[t][0]&&null!==e[t][0]&&(l=e[t][0]);return[a,l]},updateScatterplot:function(){var e,t,a,l,r,n,s,i,c,o=document.getElementById("scatter-xaxis").value,d=document.getElementById("scatter-yaxis").value,u=document.getElementById("scatter-group").value,m=this.props.Data,p=[],h=[],R=[],E={},y=0,f=[],v=function(e){return[e,s+n*e]};for(y=0;y<m.length;y+=1)p.push([m[y][o],m[y][d]]),h.push(m[y][o]),R.push(m[y][d]),u&&(a=m[y][u],E[a]instanceof Array||(E[a]=[]),E[a].push([m[y][o],m[y][d]]));if("ungrouped"===u)l=this.minmaxx(p),e=l[0],t=l[1],r=this.lsFit(p),n=r[1],s=r[0],$.plot("#scatterplotdiv",[{label:"Data Points",data:p,points:{show:!0}},{label:"Least Squares Fit",data:jStat.seq(e,t,3,v),lines:{show:!0}}],{});else{l=this.minmaxx(p),e=l[0],t=l[1],y=0;for(c in E)E.hasOwnProperty(c)&&(i=document.getElementById("scatter-group").selectedOptions.item(0).textContent+" = "+c,f.push({color:y,label:c,data:E[c],points:{show:!0}}),r=this.lsFit(E[c]),n=r[1],s=r[0],f.push({color:y,data:jStat.seq(e,t,3,v),lines:{show:!0}}),y+=1);$.plot("#scatterplotdiv",f,{})}$("#correlationtbl tbody").children().remove(),$("#correlationtbl tbody").append("<tr><td>"+jStat.covariance(h,R)+"</td><td>"+jStat.corrcoeff(h,R)+"</td></tr>")},render:function(){var e=this.props.Fields.map(function(e,t){return console.log(e),React.createElement("option",{value:t},e)});return scatterStyle={width:"500px",height:"500px"},React.createElement("div",null,React.createElement("h2",null,"Scatterplot"),React.createElement("div",{className:"col-xs-4 col-md-3"},"Column for X Axis"),React.createElement("div",{className:"col-xs-8 col-md-3"},React.createElement("select",{id:"scatter-xaxis",onChange:this.updateScatterplot},React.createElement("option",null,"None"),e)),React.createElement("div",{className:"col-xs-4 col-md-3"},"Column for Y Axis"),React.createElement("div",{className:"col-xs-8 col-md-3"},React.createElement("select",{id:"scatter-yaxis",onChange:this.updateScatterplot},React.createElement("option",null,"None"),e)),React.createElement("div",{className:"col-xs-4 col-md-3"},"Group by column"),React.createElement("div",{className:"col-xs-8 col-md-3"},React.createElement("select",{id:"scatter-group",onChange:this.updateScatterplot},React.createElement("option",null,"None"),e)),React.createElement("h3",null,"Scatterplot"),React.createElement("div",{id:"scatterplotdiv",style:scatterStyle}),React.createElement("h3",null,"Statistics"),React.createElement("table",{id:"correlationtbl"},React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",null,"Covariance"),React.createElement("th",null,"Correlation Coefficient"))),React.createElement("tbody",null)))}}),o=React.createClass({displayName:"StatsVisualizationTabPane",getDefaultProps:function(){return{Data:[]}},getInitialState:function(){return{displayed:!1}},render:function(){if(0===this.props.Data.length)var e=React.createElement("div",null,"Could not calculate stats, query not run");else{for(var t=jStat(this.props.Data),a=t.min(),r=t.max(),n=t.stdev(),s=t.mean(),i=t.meandev(),o=t.meansqerr(),d=t.quartiles(),u=[],m=0;m<this.props.Fields.length;m+=1)u.push(React.createElement("tr",null,React.createElement("td",null,this.props.Fields[m]),React.createElement("td",null,a[m]),React.createElement("td",null,r[m]),React.createElement("td",null,n[m]),React.createElement("td",null,s[m]),React.createElement("td",null,i[m]),React.createElement("td",null,o[m]),React.createElement("td",null,d[m][0]),React.createElement("td",null,d[m][1]),React.createElement("td",null,d[m][2])));var p=React.createElement("table",{className:"table table-hover table-primary table-bordered colm-freeze"},React.createElement("thead",null,React.createElement("tr",{className:"info"},React.createElement("th",null,"Measure"),React.createElement("th",null,"Min"),React.createElement("th",null,"Max"),React.createElement("th",null,"Standard Deviation"),React.createElement("th",null,"Mean"),React.createElement("th",null,"Mean Deviation"),React.createElement("th",null,"Mean Squared Error"),React.createElement("th",null,"First Quartile"),React.createElement("th",null,"Second Quartile"),React.createElement("th",null,"Third Quartile"))),React.createElement("tbody",null,u)),e=React.createElement("div",null,React.createElement("h2",null,"Basic Statistics"),p,React.createElement(c,{Fields:this.props.Fields,Data:this.props.Data}))}return React.createElement(l,{TabId:this.props.TabId,Loading:this.props.Loading},e)}}),d=React.createClass({displayName:"SaveQueryDialog",getInitialState:function(){return{queryName:"",shared:!1}},editName:function(e){this.setState({queryName:e.target.value})},editPublic:function(e){this.setState({shared:e.target.checked})},onSaveClicked:function(){this.props.onSaveClicked&&this.props.onSaveClicked(this.state.queryName,this.state.shared)},onDismissClicked:function(){this.props.onDismissClicked&&this.props.onDismissClicked()},render:function(){return React.createElement("div",{className:"modal show"},React.createElement("div",{className:"modal-dialog"},React.createElement("div",{className:"modal-content"},React.createElement("div",{className:"modal-header"},React.createElement("button",{type:"button",className:"close","aria-label":"Close",onClick:this.onDismissClicked},React.createElement("span",{"aria-hidden":"true"},"×")),React.createElement("h4",{className:"modal-title",id:"myModalLabel"},"Save Current Query")),React.createElement("div",{className:"modal-body"},React.createElement("p",null,"Enter the name you would like to save your query under here:"),React.createElement("div",{className:"input-group"},"Query Name: ",React.createElement("input",{type:"text",className:"form-control",placeholder:"My Query",value:this.state.queryName,onChange:this.editName})),React.createElement("p",null,"Make query a publicly shared query? ",React.createElement("input",{type:"checkbox",checked:this.state.shared?"checked":"",onChange:this.editPublic,"aria-label":"Shared Query"}))),React.createElement("div",{className:"modal-footer"},React.createElement("button",{type:"button",className:"btn btn-default",onClick:this.onDismissClicked},"Close"),React.createElement("button",{type:"button",className:"btn btn-primary",onClick:this.onSaveClicked},"Save changes")))))}}),u=React.createClass({displayName:"ManageSavedQueryFilter",render:function(){var e,t=this.props.filterItem;if(t.activeOperator){var a="AND",l=t.children.map(function(e,t){return React.createElement(u,{filterItem:e})});return 1===t.activeOperator&&(a="OR"),React.createElement("li",null,React.createElement("span",null,a),React.createElement("ul",{className:"savedQueryTree"},l))}if(t=this.props.filterItem,t.instrument){var r;switch(t.operator){case"equal":r="=";break;case"notEqual":r="!=";break;case"lessThanEqual":r="<=";break;case"greaterThanEqual":r=">=";break;default:r=t.operator}e=React.createElement("span",null,t.instrument,",",t.field," ",r," ",t.value)}else e=React.createElement("span",null,t.Field," ",t.Operator," ",t.Value);return React.createElement("li",null,e)}}),m=React.createClass({displayName:"ManageSavedQueryRow",getDefaultProps:function(){return{Name:"Unknown",Query:{Fields:[]}}},render:function(){var e,t=[];if(this.props.Query.Fields&&Array.isArray(this.props.Query.Fields))for(var a=0;a<this.props.Query.Fields.length;a+=1)t.push(React.createElement("li",null,this.props.Query.Fields[a]));else if(this.props.Query.Fields)for(var l in this.props.Query.Fields)for(var r in this.props.Query.Fields[l])"allVisits"!==r&&t.push(React.createElement("li",null,l,",",r));if(0===t.length&&t.push(React.createElement("li",null,"No fields defined")),this.props.Query.Conditions){var n,s;this.props.Query.Conditions.activeOperator?this.props.Query.Conditions.children?(n=0===this.props.Query.Conditions.activeOperator?React.createElement("span",null,"AND"):React.createElement("span",null,"OR"),s=this.props.Query.Conditions.children.map(function(e,t){return React.createElement(u,{filterItem:e})})):n=React.createElement("span",null,"No filters defined"):0===this.props.Query.Conditions.length?n=React.createElement("span",null,"No filters defined"):(n=React.createElement("span",null,"AND"),s=this.props.Query.Conditions.map(function(e,t){return React.createElement(u,{filterItem:e})})),e=React.createElement("div",{className:"tree"},React.createElement("ul",{className:"firstUL savedQueryTree"},React.createElement("li",null,n,React.createElement("ul",{className:"savedQueryTree"},s))))}return e||(e=React.createElement("strong",null,"No filters defined")),React.createElement("tr",null,React.createElement("td",null,this.props.Name),React.createElement("td",null,React.createElement("ul",null,t)),React.createElement("td",null,e))}}),p=React.createClass({displayName:"ManageSavedQueriesTabPane",dismissDialog:function(){this.setState({savePrompt:!1})},getInitialState:function(){return{savePrompt:!1,queriesLoaded:!1,queries:{}}},saveQuery:function(){this.setState({savePrompt:!0})},savedQuery:function(e,t){this.props.onSaveQuery&&this.props.onSaveQuery(e,t),this.setState({savePrompt:!1})},getDefaultProps:function(){return{userQueries:[],globalQueries:[],queriesLoaded:!1,queryDetails:{}}},render:function(){var e=[];if(this.props.queriesLoaded)for(var t=0;t<this.props.userQueries.length;t+=1){var a=this.props.queryDetails[this.props.userQueries[t]],r="Unnamed Query: "+this.props.userQueries[t];a.Meta.name&&(r=a.Meta.name),e.push(React.createElement(m,{Name:r,Query:a}))}else e.push(React.createElement("tr",null,React.createElement("td",{colSpan:"3"},"Loading saved query details")));var n="";this.state.savePrompt&&(n=React.createElement(d,{onDismissClicked:this.dismissDialog,onSaveClicked:this.savedQuery}));var s=React.createElement("div",null,React.createElement("h2",null,"Your currently saved queries"),React.createElement("button",{onClick:this.saveQuery},"Save Current Query"),React.createElement("table",{className:"table table-hover table-primary table-bordered colm-freeze"},React.createElement("thead",null,React.createElement("tr",{className:"info"},React.createElement("th",null,"Query Name"),React.createElement("th",null,"Fields"),React.createElement("th",null,"Filters"))),React.createElement("tbody",null,e)),n);return React.createElement(l,{TabId:this.props.TabId,Loading:this.props.Loading},s)}});window.Loading=a,window.TabPane=l,window.InfoTabPane=r,window.FieldSelectTabPane=n,window.FilterSelectTabPane=s,window.ViewDataTabPane=i,window.ScatterplotGraph=c,window.StatsVisualizationTabPane=o,window.SaveQueryDialog=d,window.ManageSavedQueryFilter=u,window.ManageSavedQueryRow=m,window.ManageSavedQueriesTabPane=p,t.default={Loading:a,TabPane:l,InfoTabPane:r,FieldSelectTabPane:n,FilterSelectTabPane:s,ViewDataTabPane:i,ScatterplotGraph:c,StatsVisualizationTabPane:o,SaveQueryDialog:d,ManageSavedQueryFilter:u,ManageSavedQueryRow:m,ManageSavedQueriesTabPane:p}}]);