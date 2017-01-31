!function(t){function e(s){if(a[s])return a[s].exports;var r=a[s]={exports:{},id:s,loaded:!1};return t[s].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var a={};return e.m=t,e.c=a,e.p="",e(0)}([function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=React.createClass({displayName:"ParticipantStatus",getInitialState:function(){return{Data:[],formData:{},updateResult:null,errorMessage:null,isLoaded:!1,loadedData:0}},componentDidMount:function(){var t=this;$.ajax(this.props.dataURL,{dataType:"json",xhr:function e(){var e=new window.XMLHttpRequest;return e.addEventListener("progress",function(e){t.setState({loadedData:e.loaded})}),e},success:function(e){t.setState({Data:e,isLoaded:!0})},error:function(e,a,s){t.setState({error:"An error occurred when loading the form!"})}})},setFormData:function(t,e){var a=this.state.formData;a[t]=e,this.setState({formData:a})},onSubmit:function(t){t.preventDefault()},render:function(){if(!this.state.isLoaded)return void 0!==this.state.error?React.createElement("div",{className:"alert alert-danger text-center"},React.createElement("strong",null,this.state.error)):React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}));var t=!0,e=null;loris.userHasPermission("candidate_parameter_edit")&&(t=!1,e=React.createElement(ButtonElement,{label:"Update"}));var a=this.state.Data.required,s=[],r=!1;for(var n in a)if(a.hasOwnProperty(n)){var i=this.state.formData.participant_status;if(null!==i&&void 0!==i||(i=this.state.Data.participant_status),a[n].ID===i){s=this.state.Data.parentIDs[i],r=!0;break}}var o=[];for(var c in this.state.Data.history)if(this.state.Data.history.hasOwnProperty(c)){var l="";for(var u in this.state.Data.history[c])if(this.state.Data.history[c].hasOwnProperty(u)){var p=this.state.Data.history[c][u];if(null!==p)switch(u){case"data_entry_date":l+="[",l+=p,l+="] ";break;case"entry_staff":l+=p,l+=" ";break;case"status":l+=" Status: ",l+=p,l+=" ";break;case"suboption":l+="Details: ",l+=p,l+=" ";break;case"reason_specify":l+="Comments: ",l+=p,l+=" "}}o.push(React.createElement("p",null,l))}var d="",f="alert text-center hide";if(this.state.updateResult)if("success"===this.state.updateResult)f="alert alert-success text-center",d="Update Successful!";else if("error"===this.state.updateResult){var h=this.state.errorMessage;f="alert alert-danger text-center",d=h?h:"Failed to update!"}return React.createElement("div",{class:"row"},React.createElement("div",{className:f,role:"alert",ref:"alert-message"},d),React.createElement(FormElement,{name:"participantStatus",onSubmit:this.handleSubmit,ref:"form",class:"col-md-6"},React.createElement(StaticElement,{label:"PSCID",text:this.state.Data.pscid}),React.createElement(StaticElement,{label:"DCCID",text:this.state.Data.candID}),React.createElement(SelectElement,{label:"Participant Status",name:"participant_status",options:this.state.Data.statusOptions,value:this.state.Data.participant_status,onUserInput:this.setFormData,ref:"participant_status",disabled:t,required:!0}),React.createElement(SelectElement,{label:"Specify Reason",name:"participant_suboptions",options:s,value:this.state.Data.participant_suboptions,onUserInput:this.setFormData,ref:"participant_suboptions",disabled:!r,required:r}),React.createElement(TextareaElement,{label:"Comments",name:"reason_specify",value:this.state.Data.reason_specify,onUserInput:this.setFormData,ref:"reason_specify",disabled:t,required:!1}),e,o))},handleSubmit:function(t){t.preventDefault();var e=this.state.formData,a=this,s=new FormData;for(var r in e)""!==e[r]&&s.append(r,e[r]);s.append("tab",this.props.tabName),s.append("candID",this.state.Data.candID),$.ajax({type:"POST",url:a.props.action,data:s,cache:!1,contentType:!1,processData:!1,success:function(t){a.setState({updateResult:"success"}),a.showAlertMessage()},error:function(t){if(""!==t.responseText){var e=JSON.parse(t.responseText).message;a.setState({updateResult:"error",errorMessage:e}),a.showAlertMessage()}}})},showAlertMessage:function(){var t=this;if(null!==this.refs["alert-message"]){var e=this.refs["alert-message"];$(e).fadeTo(2e3,500).delay(3e3).slideUp(500,function(){t.setState({updateResult:null})})}}}),s=React.createFactory(a);window.ParticipantStatus=a,window.RParticipantStatus=s,e.default=a}]);
//# sourceMappingURL=participantStatus.js.map