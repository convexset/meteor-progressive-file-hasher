/* global ProgressiveFileHasher: true */

if (Meteor.isClient) {
	Template.ProgressiveFileHasherDemo.onCreated(function () {
		this.file = null;
		this.haveFile = new ReactiveVar(false);
	});

	Template.ProgressiveFileHasherDemo.helpers({
		file: function() {
			return Template.instance().file;
		},
		haveFile: function() {
			return Template.instance().haveFile.get();
		}
	});

	Template.ProgressiveFileHasherDemo.events({
		"change #picker": function() {
			var instance = Template.instance();
			var fileList = $("#picker")[0].files;
			$("#picker").prop('disabled', true);

			if (fileList.length > 0) {
				instance.haveFile.set(true);
				instance.file = fileList[0];
			}
		}
	});


	Template.SingleFile.onRendered(function () {
		var instance = this;
		new ProgressiveFileHasher(instance.data, {
			completionCallBack: function(err, res) {
				if (!!res) {
					console.info("[" + instance.data.name + "] Done: ", res);
					$("#hash-md5").text(res.md5);
					$("#hash-sha1").text(res.sha1);
					$("#hash-sha256").text(res.sha256);
				} else {
					console.error("[" + instance.data.name + "] Failed: ", err);
					$("#hash-md5").text("Failed.");
					$("#hash-sha1").text("Failed.");
					$("#hash-sha256").text("Failed.");
				}
			},
			updateCallBack: function(progress) {
				console.info("[" + instance.data.name + "] Progress: ", progress);
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 65536,
		});
	});

}