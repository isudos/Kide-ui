Template.HeaderMenu.events({
	"click [id='Save']": function(event, template) {
		console.log("Saving editor content");
		var cm = $('#EditorPageArea').data('CodeMirrorInstance');
		var codeText = cm.getValue();
		//console.log(codeText);
		Meteor.call('save', Session.get('currentFile'), codeText);
	},
	"click [id='Save_as']": function(event, template) {
		console.log("Saving editor content");
		$('#saveDialog').modal();
	},
	"click [id='Open']": function(event, template) {
		//console.log("Loading file");
		//AntiModals.overlay('OpenDialog')
		//slidePanel.showPanel('OpenDialog');
		$('#openDialog').modal();

	},
	"click [id='New']": function(event, template) {
		

	},
});