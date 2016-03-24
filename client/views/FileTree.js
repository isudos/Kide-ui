Template.FileTree.rendered = function() {
    $(function () { $('#fileTreeContainer').jstree(); });


   // this.autorun(function () {

        
  //  });


    this.autorun(function() {
        if (Meteor.user() && Session.get("inited") == "done"){

            Meteor.subscribe("fileTrees", Meteor.userId());
            var fileSystemRoot = null;
            Meteor.subscribe("fileTrees", Meteor.userId());
            fileSystemRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
            if(fileSystemRoot == null){
                AntiModals.alert("File Tree: File Tree Error. Error initializing file system. File system seems to be corrupt.");
            } else {
                $(function() {$('#fileTreeContainer').jstree({ 'core' : {
                  'data' : fileSystemRoot } });});  //jstree({'core' : {'data': fileSystemRoot }});
                console.log("FileTree: setting up jstree");
                $('#fileTreeContainer').on("select_node.jstree", function (e, data) {
                    console.log("Node Selected:",data);
                    
                    var selectedPath = data.instance.get_path(data.node,'/');
                    selectedPath = selectedPath.substring(1,selectedPath.length );
                    console.log("Path to Node Selected:", selectedPath );
                    Meteor.call("getFromCacheOrOpen", Meteor.userId(), selectedPath, 
                            document.getElementsByClassName("CodeMirror")[0].CodeMirror.getValue());
                });
            }

            var fsRoot = FileTrees.findOne({userId: Meteor.userId(), text: '/'});
            console.log("File Tree: refreshed");
            $('#fileTreeContainer').jstree(true).settings.core.data = fsRoot;
            $('#fileTreeContainer').jstree(true).refresh();
            $('#fileTreeContainer').jstree(true).redraw(true);
        }
    });
}