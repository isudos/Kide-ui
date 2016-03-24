Template.Tabs.rendered = function() {
	var tabs = this.find("#tabs");
	var lastTab  = this.find("#newTab");

	var addNewTab = function(order, caption, orderActive){
			
			console.log("Tabs: " ,tabs);
			
			var newTab = document.createElement("li");
			if (order == orderActive){
				newTab.setAttribute("class","active editorTab");
			} else {
				newTab.setAttribute("class","passive editorTab");
			}
			newTab.setAttribute("order",order);
			var aNode = document.createElement("a");
			var closeNode = document.createElement("button");
			closeNode.setAttribute("class","close closeTab");
			closeNode.setAttribute("type","button");
			var xNode  = document.createTextNode("x");
			var textNode = document.createTextNode(caption);
			closeNode.appendChild(xNode);	
			aNode.appendChild(closeNode);
			aNode.appendChild(textNode);
			newTab.appendChild(aNode);
			tabs.insertBefore(newTab,lastTab);
	};

    var reload =  function (session) {
    	console.log("Tabs: Arranging session tabs: ", session )
		while (tabs.firstChild.id != "newTab") {
    			tabs.removeChild(tabs.firstChild);
		}
    	for(var i=0; i< session.tabs.length; i++) {
    		console.log("Tabs: Adding new tab", session.tabs[i], i, session.currentTab);
    		addNewTab( i, session.tabs[i].fileName, session.currentTab);
    	}
    };

    Tracker.autorun(function () {
    	if (Meteor.user() && Session.get("inited") == "done"){
    		var session = Sessions.findOne({userId : Meteor.userId()});
    		reload(session);
    	}

    });

};

Template.Tabs.events({
	"click [id='newTab']": function(event, template) {
		Meteor.call("createNewLocalDoc",Meteor.userId(),"/newFile.txt", "");
	},
	"click .closeTab": function(event, template) {
		event.stopPropagation();
		console.log("CLose button parent", event.currentTarget.parentNode);
		Meteor.call("closeTab",Meteor.userId(), event.currentTarget.parentNode.parentNode.getAttribute("order"));
	},
	"click .editorTab": function(event, template){
		var thisOrder = event.currentTarget.getAttribute("order");
		console.log("Tabs: currentTarget:", event.currentTarget);

		var currentOrder = Sessions.findOne({userId:Meteor.userId()}).currentTab;
		console.log("Tabs: switching to order:", thisOrder);
		Meteor.call("switchTab",Meteor.userId(), currentOrder,thisOrder, 
			document.getElementsByClassName("CodeMirror")[0].CodeMirror.getValue());
	}

});