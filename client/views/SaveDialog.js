Template.SaveDialog.rendered = function() {
    $(function () { $('#saveFileTreeContainer').jstree(); });
    //Meteor.subscribe("fileSystem");
    /*Meteor.subscribe("fileTrees", Meteor.userId());
    var fileSystemRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
    console.log(fileSystemRoot);
    if(fileSystemRoot == null){
        AntiModals.alert("Save Dialog: Error initializing file system. File system seems to be corrupt.");
    } else {
        $(function() {$('#saveFileTreeContainer').jstree({ 'core' : {
          'data' : fileSystemRoot
      } });});  //jstree({'core' : {'data': fileSystemRoot }});
    } */

    Tracker.autorun(function () {
        if (Meteor.user() && Session.get("inited") == "done") {
            Meteor.subscribe("fileTrees", Meteor.userId());
            var fsRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
            $('#saveFileTreeContainer').jstree(true).settings.core.data = fsRoot;
            $('#saveFileTreeContainer').jstree(true).refresh();
            $('#saveFileTreeContainer').jstree(true).redraw(true);
            console.log("Save dialog: refreshed");
        }
    });

};

Template.SaveDialog.events({
	"click [id='savefilebutton']": function(event, template) {
		var filePath = $("#saveFilePath").val();
		console.log("Saving file: " + filePath);
		var cm = $('#EditorPageArea').data('CodeMirrorInstance');
		var codeText = cm.getValue();
		Meteor.call('saveAs',Meteor.userId(), filePath, codeText);
	}
});