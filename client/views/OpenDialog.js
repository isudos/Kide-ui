Template.OpenDialog.rendered = function() {
    $(function () { $('#openFileTreeContainer').jstree(); });
    /*Meteor.subscribe("fileTrees", Meteor.userId());
    var fileSystemRoot = FileTrees.findOne({userId: Meteor.userId(), text: "/"});
    console.log("Open Dialog fsRoot: ", fileSystemRoot);
    if(fileSystemRoot == null){
        AntiModals.alert("Open Dialog: Error initializing file system. File system seems to be corrupt.");
    } else {
        $(function() {$('#openFileTreeContainer').jstree({ 'core' : {
         'data' : fileSystemRoot
      } });});  //jstree({'core' : {'data': fileSystemRoot }});
*/
    
    Tracker.autorun(function () {
        if (Meteor.user() && Session.get("inited") == "done") {
            Meteor.subscribe("fileTrees", Meteor.userId());
            var fsRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
            $('#openFileTreeContainer').jstree(true).settings.core.data = fsRoot;
            $('#openFileTreeContainer').jstree(true).refresh();
            $('#openFileTreeContainer').jstree(true).redraw(true);
            console.log("Open Dialog: has been refreshed");
        }
    });


};

Template.OpenDialog.events({
	"click [id='openfilebutton']": function(event, template) {
	           var filePath = $("#openFilePath").val();
		       console.log("Open file: " + filePath);
        //var codeText = null;
		//Meteor.call('open', Meteor.userId(), filePath,  function (error, result) {
        //  if (error) {
         //   AntiModals.alert("File is unaccessable.");
        //  } else {
          //      if (result == null){
          //          AntiModals.alert("File doesn't exist.");
          //      } else {
                   // var cm = $('#EditorPageArea').data('CodeMirrorInstance');
                   // console.log(result);
                Session.set('currentFile', filePath);               

            }
            
});

