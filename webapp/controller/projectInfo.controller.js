sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageBox',
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("PlantGrowth.CoreLabs.controller.projectInfo", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf RFS-PlantGrowth.view.CMR_RequestForm
		 */
		onInit: function () {
			var serviceUrls = this.getOwnerComponent().getServiceUrl();
			var postObj = this.getOwnerComponent().genericAjax(serviceUrls.CMR_ReqForm_POST, "GET", "");
			var currDate = this.getOwnerComponent().getCurrentDate();
			postObj["currDate"] = currDate;
			var Reqmodel = new sap.ui.model.json.JSONModel();
			Reqmodel.setData(postObj);
			this.getView().setModel(Reqmodel, "reqModel");

			/* Group Information Model Declaration  */
			this.AHdata = [];
			this.oModelAH = new JSONModel();
			this.onAddGrop();
			this.Reasercher = [];
			this.oModelReasercherAH = new JSONModel();
			this.onAddReacher();
		},
		// showOptions: function () {
		// 	if (this.getView().byId('marine').getSelected()) {
		// 		this.getView().byId('fieldWork').setVisible(true);
		// 		this.getView().byId('fieldEquip').setVisible(true);
		// 	} else {
		// 		this.getView().byId('fieldWork').setVisible(false);
		// 		this.getView().byId('fieldEquip').setVisible(false);
		// 	}
		// },
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf RFS-PlantGrowth.view.CMR_RequestForm
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf RFS-PlantGrowth.view.CMR_RequestForm
		 */
		onAfterRendering: function () {
			var id = this.getView().getId();

			$(document).ready(function () {
			
				var dateFormat = "dd/mm/yy";
				var startDate, endDate = "";
				startDate = $("#" + id + "--startDate")
					.datepicker({
						showOn: "button",
						buttonImage: "Images/calendar-copy@2x.png",
						buttonImageOnly: true,
						dateFormat: 'dd/mm/yy',
						changeMonth: true,
						changeYear: true
					})
					.on("change", function () {
						endDate.datepicker("option", "minDate", getDate(this));
					});
				endDate = $("#" + id + "--endDate").datepicker({
						showOn: "button",
						buttonImage: "Images/calendar-copy@2x.png",
						buttonImageOnly: true,
						dateFormat: 'dd/mm/yy',
						changeMonth: true,
						changeYear: true
					})
					.on("change", function () {
						startDate.datepicker("option", "maxDate", getDate(this));
					});

				function getDate(element) {
					var date;
					try {
						date = $.datepicker.parseDate(dateFormat, element.value);
					} catch (error) {
						date = null;
					}

					return date;
				}
			});

			$("#" + id + "--startDate").val(this.getView().getModel("reqModel").getProperty('/projectStartDate'));
			$("#" + id + "--endDate").val(this.getView().getModel("reqModel").getProperty('/projectEndDate'));
		},
		createReqObj: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var id = this.getView().getId();
			var chcboxSelect = false;
			var reqObj = this.getView().getModel("reqModel").getData();
			reqObj['projectStartDate'] = $("#" + id + "--startDate").val();
			reqObj['projectEndDate'] = $("#" + id + "--endDate").val();
			// if ((this.getView().byId('marine').getSelected()) || (this.getView().byId('engineering').getSelected()) || (this.getView().byId(
			// 		'seaLabs').getSelected()) || (this.getView().byId('fieldWork').getSelected()) || (this.getView().byId('fieldEquip').getSelected())) {
			// 	chcboxSelect = true;
			// }
			if ((reqObj['projectStartDate'] == "") || (reqObj['endDate'] == "") || (reqObj['projectTitle'] == "") || (reqObj['projectId'] == "") ||
				(reqObj['descriptionOfWork'] == "")) {
				MessageBox.information(
					"Please Fill all Mandatory Fields.", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else {
				this.getOwnerComponent().setJsonObj(reqObj);
				this.getView().byId("idIconTabBarMulti").setSelectedKey("groupInfo");
				MessageBox.information(
					"Information Saved Succesfully.", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
				
			}
		},
		inputValidation: function () {
			console.log("hey");
		},
		createReqObj2:function (){
			   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("labs");
		},

		/* ##############Group Information Events ################*/

		onAddGrop: function () {
			this.AHdata.push({
				"Name": "",
				"Department": "",
				"Groupname": ""
			});
			this.oModelAH.setData({
				GroupInfo: this.AHdata
			});
			var oTableH = this.getView().byId("idGroupInfo");
			oTableH.setModel(this.oModelAH);
		},
		onDeleteGroup: function (oEvent) {
			var aTable = this.getView().byId("idGroupInfo");
			var path = oEvent.getSource().getBindingContext().getPath();
			var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
			this.AHdata.splice(idx, 1);
			this.oModelAH.setData({
				GroupInfo: this.AHdata
			});
			aTable.setModel(this.oModelAH);
		},
		onAddReacher: function () {
			this.Reasercher.push({
				"Name": "",
				"KaustId": "",
				"Groupname": ""
			});
			this.oModelReasercherAH.setData({
				reasercherInfo: this.Reasercher
			});
			var oTableH = this.getView().byId("idLabReasercherInfo");
			oTableH.setModel(this.oModelReasercherAH);
		},
		onDeleteResearcher: function (oEvent) {
			var aTable = this.getView().byId("idLabReasercherInfo");
			var path = oEvent.getSource().getBindingContext().getPath();
			var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
			this.Reasercher.splice(idx, 1);
			this.oModelReasercherAH.setData({
				reasercherInfo: this.Reasercher
			});
			aTable.setModel(this.oModelReasercherAH);
		},
		onFileUploaderUploadComplete:function(){
			var attachmentController = sap.ui.controller("RFS-PlantGrowth.controller.attachment");
			attachmentController.onFileUploaderUploadComplete();
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf RFS-PlantGrowth.view.CMR_RequestForm
		 */
		//	onExit: function() {
		//
		//	}

	});

});