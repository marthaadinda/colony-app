app.section('scrapper');

viewModel.application = {}; var apl = viewModel.application;
apl.templateConfigScrapper = {
	_id: "",
	AppsName: "",
	Enable: true,
	AppPath: ko.observable()
	//AppPath:""
};

apl.configScrapper = ko.mapping.fromJS(apl.templateConfigScrapper);
apl.scrapperMode = ko.observable('');
apl.scrapperData = ko.observableArray([]);
apl.scrapperColumns = ko.observableArray([
	{ field: "_id", title: "ID", width: 80 },
	{ field: "AppsName", title: "Application Name", width: 130},
	{ title: "", width: 80, attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<button class='btn btn-sm btn-default btn-text-success btn-start tooltipster' title='Start Transformation Service' onclick='apl.runTransformation(\"" + d._id + "\")()'><span class='glyphicon glyphicon-play'></span></button>",
			"<button class='btn btn-sm btn-default btn-text-primary tooltipster' title='Edit Application' onclick='apl.editScrapper(\"" + d._id + "\")'><span class='fa fa-pencil'></span></button>",
			"<button class='btn btn-sm btn-default btn-text-danger tooltipster' title='Delete Application' onclick='apl.removeScrapper(\"" + d._id + "\")'><span class='glyphicon glyphicon-remove'></span></button>"
		].join(" ");
	} },
	{ title: "Status", width: 80, attributes: { class:'scrapper-status' }, template: "<span></span>", headerTemplate: "<center>Status</center>" }
	
]);

apl.getApplications = function() {
	apl.scrapperData([]);
	app.ajaxPost("/application/getapps", {}, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		apl.scrapperData(res.data);
	});
};

apl.editScrapper = function(_id) {
	ko.mapping.fromJS(apl.templateConfigScrapper, apl.configScrapper);
	app.ajaxPost("/application/selectapps", { _id: _id }, function(res) {
		if (!app.isFine(res)) {
			return;
		}

		app.mode('editor');
		apl.scrapperMode('edit');
		//apl.textFile('Upload zip file here');
		ko.mapping.fromJS(res.data, apl.configScrapper);
	});
};

apl.createNewScrapper = function () {
	//alert("masuk create");
	app.mode("editor");
	apl.scrapperMode('');
	ko.mapping.fromJS(apl.templateConfigScrapper, apl.configScrapper);
	//apl.addMap();
};

apl.refreshScapper = function () {
	// var data = ko.mapping.toJS(apl.configScrapper);
	app.ajaxPost("/application/searchapps", {}, function(res) {
		if (!app.isFine(res)) {
			return;
		}
	});
};

apl.saveScrapper = function() {
	if (!app.isFormValid(".form-application")) {
		return;
	}
	// var filedata = new FormData($('#files')[0]);
	// $.each($('#files')[0].files, function(i, file) {
	//     filedata.append('file-'+i, file);
	// });

	var data = ko.mapping.toJS(apl.configScrapper);
	console.log(data)
	app.ajaxPost("/application/saveapps", data, function(res) {
		if (!app.isFine(res)) {
			return;
		}
		apl.backToFront()
	});

 //    $.post($('#files').attr("action"), formData, function(form-add-scrapper) {
 //        alert(form-add-scrapper);
 //    });

};

apl.removeScrapper = function(_id) {
	swal({
		title: "Are you sure?",
		text: 'Application with id "' + _id + '" will be deleted',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Delete",
		closeOnConfirm: false
	},
	function() {
		setTimeout(function () {
			app.ajaxPost("/application/deleteapps", { _id: _id }, function () {
				if (!app.isFine) {
					return;
				}

				apl.backToFront()
				swal({title: "Application successfully deleted", type: "success"});
			});
		},1000);
	});
};

// <<<<<<< HEAD
// =======
apl.getUploadFile = function() {
	$("#files").kendoUpload(/*{
		async: {
        saveUrl: 'application/saveapps',
        autoUpload: false
    },
    multiple: false,
    localization: {
        select: "Select a file",
        uploadSelectedFiles: "Send"
    }
	}*/);
    $("#files").closest(".k-upload").find("span").text("Upload zip file here");
    $(".k-button.k-upload-button").addClass("btn btn-primary");
};
/*>>>>>>> 149a59c9cbf0d7bd02d74441cb01b12e43732180*/

apl.backToFront = function () {
	app.mode('');
	apl.getApplications();
};

ko.bindingHandlers.fileSrc = {
    init: function (element, valueAccessor) {
        ko.utils.registerEventHandler(element, "change", function () {
            var reader = new FileReader();
        
            reader.onload = function (e) {
                var value = valueAccessor();
                value(e.target.result);
            }
    
            reader.readAsDataURL(element.files[0]);
        });
    }
};

$(function () {
	apl.getApplications();
	// apl.refreshScapper();
	apl.getUploadFile();
});