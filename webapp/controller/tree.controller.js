sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageBox',

], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("PlantGrowth.CoreLabs.controller.tree", {

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf PlantGrowth.CoreLabs.view.tree
			 */
			onInit: function () {

			},

			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf PlantGrowth.CoreLabs.view.tree
			 */
			//	onBeforeRendering: function() {
			//
			//	},

			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf PlantGrowth.CoreLabs.view.tree
			 */

			traverseArray: function (data) {
				if (data != undefined) {
					if (Array.isArray(data) == false) {
						var mainData1 = [];
						mainData1.push(data);
						// this.traverseArray(mainData1);	
						data = mainData1;
					}

					for (var i = 0; i < data.length; i++) {
						var children = this.traverseArray(data[i].children);
						if (children != "") {
							data[i].children = children;
						}
					}
					return data;

				} else {
					return "";
				}
			},
			onSavePress: function () {
				// var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				var serviceUrlsModel = this.getOwnerComponent().getServiceUrl();
				var postData = this.getView().getModel("InputValue").getData();
				if (this.responseDto != undefined) {
					postData['resourceId'] = this.responseDto.resourceId;
					postData['categoryCode'] = this.responseDto.categoryCode;
					postData['categoryParentId'] = this.responseDto.categoryParentId;
					postData['resourceName'] = this.responseDto.resourceName;
					postData['resourceNameSearch'] = this.responseDto.resourceNameSearch;
					postData['resourcePath'] = this.responseDto.resourcePath;
				}

				postData = JSON.stringify(postData);
				var ModelData = this.getOwnerComponent().genericAjax(serviceUrlsModel.updateResource, "POST", postData);
				if (ModelData.success == "true") {
					MessageBox.information(
						"Information Saved Successfully.", {}
					);
				}
			},
			setModelData: function (id) {
				this.id = id;
				var modelArr = ["unitRate3", "stockMax", "owner", "infoNoteToDisplay", "infoPicFileName", "infoPicFileLink", "unitRate1",
					"unitRate2", "unitRate3", "unit", "minimumUnitADay", "maximumUnitADay", "defaultStartTime", "defaultEndTime", "isCharge",
					"chargeFriSat", "mobEffortHours", "mobEndEffortHours", "chargeMobs", "consumablesCost"
				];
				var viewId = this.getView().sId;
				var serviceUrlsModel = this.getOwnerComponent().getServiceUrl();
				var ModelData = this.getOwnerComponent().genericAjax(serviceUrlsModel.getResourceById + id, "GET", "");
				console.log("model" + ModelData);
				var resourceModel = new sap.ui.model.json.JSONModel();
				// if(ModelData.responseDto['unitRate2']==undefined){
				// var modelInitial = this.getOwnerComponent().genericAjax(serviceUrlsModel.getResourceInitially, "GET", "");
				// resourceModel.setData(modelInitial);
				// this.responseDto = ModelData.responseDto;
				// }

				for (var i = 0; i < modelArr.length; i++) {
					var name = modelArr[i];
					if (ModelData.responseDto[name] == undefined) {
						if ((name == "chargeFriSat") || (name == "isCharge") || (name == "chargeMobs")) {
							ModelData.responseDto[name] = false;
						} else {
							ModelData.responseDto[name] = "";
						}
					} else {
						if ((name == "chargeFriSat") || (name == "isCharge") || (name == "chargeMobs")) {
							if (ModelData.responseDto[name] == "false") {
								ModelData.responseDto[name] = false;
							} else if (ModelData.responseDto[name] == "true") {
								ModelData.responseDto[name] = true;
							}
						}
					}
				}
				resourceModel.setData(ModelData.responseDto);

				this.getView().setModel(resourceModel, "InputValue");
			},
			onAfterRendering: function () {
				var that = this;
				var id = this.getView().sId;
				console.log(id);
				$(function () {
					var serviceUrlsModel = that.getOwnerComponent().getServiceUrl();
					var treeData = that.getOwnerComponent().genericAjax(serviceUrlsModel.treeUrl, "GET", "");
					treeData = treeData.cmrResourceNode;

					if (Array.isArray(treeData) == false) {
						var treeData = [];
						treeData.push(treeData);
					}
					console.log(treeData);
					for (var i = 0; i < treeData.length; i++) {
						var children = that.traverseArray(treeData[i].children);
						if (children != "") {
							treeData[i].children = children;
						}
					}
					console.log(treeData);
					$(window).resize(function () {
						var h = Math.max($(window).height() - 0, 420);
						$('#container, #data, #tree, #data .content').height(h).filter('.default').css('lineHeight', h + 'px');
					}).resize();

					$('#container-CoreLabs---labs--tree')
						.jstree({
							'core': {
								'data': treeData,
								'check_callback': function (o, n, p, i, m) {
									if (m && m.dnd && m.pos !== 'i') {
										return false;
									}
									if (o === "move_node" || o === "copy_node") {
										if (this.get_node(n).parent === this.get_node(p).id) {
											return false;
										}
									}
									var operation = "";
									var id = "";
									if (n.original != undefined) {
										if (n.original.id != undefined) {
											operation = "UPDATE";
											id = n.original.id;
										} else {
											operation = "CREATE";
										}
									} else {
										operation = "CREATE";
									}
									if (o == "rename_node") {

										var dataObj = {
											"operation": operation,
											"parentId": n.parent,
											"type": n.icon,
											"name": i,
											"categoryId": id
										};
										dataObj = JSON.stringify(dataObj);
										var response = that.getOwnerComponent().genericAjax(serviceUrlsModel.createResource, "POST", dataObj);
										that.setModelData(response.responseDto);
										// if(type == "RESOURCE"){
										// 	that.bindData();
										// 		}
									}
									return true;
								},
								'themes': {
									'responsive': false,
									'variant': 'small',
									'stripes': true
								}
							},
							'sort': function (a, b) {
								return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(
									b) ? 1 : -1);
							},
							'contextmenu': {
								'items': function (node) {
									var tmp = $.jstree.defaults.contextmenu.items();
									delete tmp.create.action;
									tmp.create.label = "New";
									tmp.create.submenu = {
										"create_folder": {
											"separator_after": true,
											"label": "Category",
											"action": function (data) {
												var inst = $.jstree.reference(data.reference),
													obj = inst.get_node(data.reference);
												inst.create_node(obj, {
													type: "default"
												}, "last", function (new_node) {
													setTimeout(function () {
														inst.edit(new_node);
													}, 0);
												});
											}
										},
										"create_file": {
											"label": "Resource",
											"action": function (data) {
												var inst = $.jstree.reference(data.reference),
													obj = inst.get_node(data.reference);
												inst.create_node(obj, {
													type: "file"
												}, "last", function (new_node) {
													setTimeout(function () {
														inst.edit(new_node);
													}, 0);
												});
											}
										}
									};
									if (this.get_type(node) === "file") {
										delete tmp.create;
									}
									return tmp;
								}
							},
							'types': {
								'default': {
									'icon': 'folder'
								},
								'file': {
									'valid_children': [],
									'icon': 'file'
								}
							},
							'unique': {
								'duplicate': function (name, counter) {
									return name + ' ' + counter;
								}
							},
							'plugins': ['state', 'dnd', 'sort', 'types', 'contextmenu', 'unique']
						})
						.on('delete_node.jstree', function (e, data) {
							$.get('?operation=delete_node', {
									'id': data.node.id
								})
								.fail(function () {
									data.instance.refresh();
								});
						})
						.on('create_node.jstree', function (e, data) {
							$.get('?operation=create_node', {
									'type': data.node.type,
									'id': data.node.parent,
									'text': data.node.text
								})
								.done(function (d) {
									data.instance.set_id(data.node, d.id);
								})
								.fail(function () {
									data.instance.refresh();
								});
						})
						.on('rename_node.jstree', function (e, data) {
							$.get('?operation=rename_node', {
									'id': data.node.id,
									'text': data.text
								})
								.done(function (d) {
									data.instance.set_id(data.node, d.id);
								})
								.fail(function () {
									data.instance.refresh();
								});
						})
						.on('move_node.jstree', function (e, data) {
							$.get('?operation=move_node', {
									'id': data.node.id,
									'parent': data.parent
								})
								.done(function (d) {
									//data.instance.load_node(data.parent);
									data.instance.refresh();
								})
								.fail(function () {
									data.instance.refresh();
								});
						})
						.on('copy_node.jstree', function (e, data) {
							$.get('?operation=copy_node', {
									'id': data.original.id,
									'parent': data.parent
								})
								.done(function (d) {
									//data.instance.load_node(data.parent);
									data.instance.refresh();
								})
								.fail(function () {
									data.instance.refresh();
								});
						})
						.on('changed.jstree', function (e, data) {
							if (data.node.original.type == "file") {
								if (data.node.original.text.includes("Vessel")) {
									that.getView().byId("vessel").setVisible(true);
								}
								that.setModelData(data.node.id);
								$("#" + id + "--adminForm").show();
								$("#" + id + "--resource").hide();
							} else {
								$("#" + id + "--adminForm").hide();
								$("#" + id + "--resource").show();

							}
							if (data && data.selected && data.selected.length) {
								$(data.selected).each(function (idx) {
									var node = data.instance.get_node(data.selected[idx]);
									$('#data .default').html(node.text);
								});
								$.get('?operation=get_content&id=' + data.selected.join(':'), function (d) {
									if (d && typeof d.type !== 'undefined') {
										$('#data .content').hide();
										switch (d.type) {
										case 'text':
										case 'txt':
										case 'md':
										case 'htaccess':
										case 'log':
										case 'sql':
										case 'php':
										case 'js':
										case 'json':
										case 'css':
										case 'html':
											$('#data .code').show();
											$('#code').val(d.content);
											break;
										case 'png':
										case 'jpg':
										case 'jpeg':
										case 'bmp':
										case 'gif':
											$('#data .image img').one('load', function () {
												$(this).css({
													'marginTop': '-' + $(this).height() / 2 + 'px',
													'marginLeft': '-' + $(this).width() / 2 + 'px'
												});
											}).attr('src', d.content);
											$('#data .image').show();
											break;
										default:
											$('#data .default').html(d.content).show();
											break;
										}
									}
								});
							} else {
								$('#data .content').hide();
								$('#data .default').html('Select a file from the tree.').show();
							}
						});
				});
			},
			onFileUploaderUploadComplete: function (oEvent, oModel) {
				//this.oModel = oModel
				sap.ui.core.BusyIndicator.show(1);
				var that = this;
				// var getfileName = sap.ui.getCore().byId("idEngineeringFileName").getValue();
				// var fileVersion = sap.ui.getCore().byId("idEngineeringVersion").getValue();
				var file = document.getElementById("container-CoreLabs---labs--admin_fileUploader-fu").files[0];
				if (file && window.File && window.FileList && window.FileReader) {
					var reader = new FileReader();
					reader.readAsArrayBuffer(file);
					reader.onload = function (evt) {
						var fileName = file.name;
						var fileType = "xls";
						var byteArray2 = new Uint8Array(evt.target.result);
						var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
						var UniqueFileId = new Date().getTime();
						that.createFile("CMR", UniqueFileId, fileName, fileEncodedData);
					};

				}
			},
			uint8ToString: function (buf) {
				var i, length, out = '';
				for (i = 0, length = buf.length; i < length; i += 1) {
					out += String.fromCharCode(buf[i]);
				}
				return out;
			},
			createFile: function (applicationArea, UniqueFileId, fileName, fileEncodedData) {
				var that = this;
				var uploadPayload = {

					"fileNm": fileName,
					"fileType": "xls",
					"fileByteArray": fileEncodedData

				};

				var newFile = {};
				var uploadUrl = "https://sthpodq.kaust.edu.sa:50501/kclrfs/rest/rfsExcelReport/uploadResourcesService";
				$.ajax({
						url: uploadUrl,
						type: "POST",
						async: true,
						dataType: "json",
						data: JSON.stringify(uploadPayload),
						contentType: "application/json",
						success: function (data, textStatus, jqXHR) {
							var newFile = {};
							var docManagerDto = jqXHR.responseJSON.docManagerDto;
							newFile.delFlag = false;
							if (data.correctExcelUploaded == "true") {
								sap.ui.core.BusyIndicator.hide();
								MessageBox.confirm(
									"Excel is uploaded successfully", {
										icon: MessageBox.Icon.INFORMATION,
										title: "Success",
										actions: [MessageBox.Action.OK],
										onClose: function (oAction) {
											window.location.reload();

										}
									}
								);
							} else {
								sap.ui.core.BusyIndicator.hide();
								MessageBox.confirm(
									"Error while uploaading excel", {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error",
										actions: [MessageBox.Action.OK],
										onClose: function (oAction) {

										}
									}
								);
							}
						}

					

				});
		},
		ontypeMissmatch: function () {
			sap.ui.core.BusyIndicator.hide();
			MessageBox.confirm(
				"Please upload xls template.", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [MessageBox.Action.OK],
					onClose: function (oAction) {

					}
				}
			);

		}

	});

});