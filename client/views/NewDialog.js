Template.NewDialog.rendered = function() {
    //$(function () { $('#fileTreeContainer').jstree(); });
    //Meteor.subscribe("fileSystem");
    Meteor.subscribe("fileTrees", Meteor.userId());
    var fileSystemRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
    console.log(fileSystemRoot);
    if(fileSystemRoot == null){
        AntiModals.alert("Error initializing file system. File system seems to be corrupt.");
    } else {
        $(function() {$('#newFileTreeContainer').jstree({ 'core' : {
          'data' : fileSystemRoot
      } });});  //jstree({'core' : {'data': fileSystemRoot }});
    }

    this.autorun(function() {
        Meteor.subscribe("fileTrees", Meteor.userId());
        var fsRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
        console.log("refreshed");
        $('#saveFileTreeContainer').jstree(true).settings.core.data = fsRoot;
        $('#saveFileTreeContainer').jstree(true).refresh();
        $('#saveFileTreeContainer').jstree(true).redraw(true);
    });
};

Template.NewDialog.events({
	"click [id='newfilebutton']": function(event, template) {
		var filePath = $("#newFilePath").val();
		console.log("Creating file: " + filePath);
		var cm = $('#EditorPageArea').data('CodeMirrorInstance');
		var codeText = cm.getValue();
		Meteor.call('saveAs',Meteor.userId(), filePath, codeText);
	}
});