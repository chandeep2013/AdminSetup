sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox'
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("PlantGrowth.CoreLabs.controller.labs", {
		onInit: function () {
			this.index=0;
			/*Assign values */
			var data2 = {
			"length":["1","2"]
			};
			var serviceUrlsModel = this.getOwnerComponent().getServiceUrl();
			this.data = this.getOwnerComponent().genericAjax(serviceUrlsModel.requestInfo, "GET", "");
			var oModel = new sap.ui.model.json.JSONModel();
			var panelModel = new sap.ui.model.json.JSONModel(data2);
			oModel.setData(this.data);
			this.getView().setModel(oModel, "data");
			sap.ui.getCore().setModel(oModel, "data");
			sap.ui.getCore().setModel(panelModel,"panelContent");
			console.log("panel"+panelModel);
			/* Tree table data*/
			this.clothingData = this.getOwnerComponent().genericAjax(serviceUrlsModel.Clothing, "GET", "");
			var clothingModel = new sap.ui.model.json.JSONModel();
			var clothingModel2 = new sap.ui.model.json.JSONModel();
			clothingModel.setData(this.clothingData);
			this.getView().setModel(clothingModel);
			sap.ui.getCore().setModel(clothingModel);
			clothingModel2.setData(this.clothingData);
			this.getView().setModel(clothingModel2,"clothing");
			sap.ui.getCore().setModel(clothingModel2,"clothing");
			// this.getView().setModel(clothingModel);
			this._aClipboardData = [];
		},
		onSelectMarineLab: function () {
			var SelectedValue = this.getView().byId("idMarineSelect").getSelected();
			if (SelectedValue === true) {
				this.getView().byId("idlistForMarine").setVisible(true);
				this.getView().byId("idmarineFieldRequestLab").setVisible(true);
				this.getView().byId("idDefaultText").setVisible(false); // aug 30
			} else {
				this.getView().byId("idlistForMarine").setVisible(false);
				this.getView().byId("idMarineLabInfoLoad").setEnabled(false);
				this.getView().byId("idMarine_FieldRequest").setEnabled(false);
				this.getView().byId("idMarine_FieldEquipement").setEnabled(false);
				var IcontabId = this.getView().byId("idIconTabBarMulti");
				(IcontabId.getContent()[0] === undefined) ? null: IcontabId.getContent()[0].destroy();
				this.getView().byId("idFieldEquipmentSelect").setSelected(false);
				this.getView().byId("idFieldWorkSelect").setSelected(false);
				this.getView().byId("idmarineFieldRequestLab").setVisible(false);
				this.getView().byId("idDefaultText").setVisible(true); // aug 30
				this.destroy();
			}
			this.buttonHidden();
		},
		onSelectEngineeringLab: function () {
			/* ######### Engineering Lab Fragment #########*/
			var SelectedValue = this.getView().byId("idEngineeringSelect").getSelected();
			var IcontabId = this.getView().byId("idEngineeringLabInfoLoad");
			if (SelectedValue === true) {
				IcontabId.addContent(new sap.ui.xmlfragment("PlantGrowth.CoreLabs.Fragments.EngineeringLab", this));
				this.getView().byId("idEngineeringLabInfoLoad").setEnabled(true);
				this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
				///############## Engineering Lab Table - Model Data ################//////////
				//	sap.ui.getCore().byId("idTodaysDateLabel").setText(new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear());
				this.Engineeringdata = [];
				// this.onPressAddEquipments();
			} else {
				this.getView().byId("idEngineeringLabInfoLoad").setEnabled(false);
				//	IcontabId.getContent()[0].destroy();
				(IcontabId.getContent()[0] === undefined) ? null: IcontabId.getContent()[0].destroy();
			}
			this.buttonHidden();
		},
		onSelectSeaLab: function () {
			/* ######### Sea Lab Fragment #########*/
			var SelectedValue = this.getView().byId("idSeaLabSelect").getSelected();
			var IcontabId = this.getView().byId("idSeaLabLabInfoLoad");
			if (SelectedValue === true) {
				this.getView().byId("idSeaLabLabInfoLoad").setEnabled(true);
				IcontabId.addContent(new sap.ui.xmlfragment("PlantGrowth.CoreLabs.Fragments.SeaLab", this));
				this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
				this.Chemicals = [];
				this.CompressGas = [];
				this.others = [];
				this.othersDetailed = [];
				this.Aquarium = [];
				this.seatableList = ["chemicalsButtonID", "idCompressGasButton", "idOthersButton", "idOthersDetailedButton", "idAquariumButton"]
				this.onPressAddSeaLabTable_Chemicals();
			} else {
				IcontabId.getContent()[0].destroy();
				this.getView().byId("idSeaLabLabInfoLoad").setEnabled(false);
			}
			this.buttonHidden();
		},
		destroy: function () {
			var IcontabId = this.getView().byId("idMarine_FieldRequest");
			var IcontabId1 = this.getView().byId("idMarine_FieldEquipement");
			var SelectedValue = this.getView().byId("idFieldWorkSelect").getSelected();
			if (SelectedValue === false) {
				(IcontabId.getContent()[1] === undefined) ? null: IcontabId.getContent()[1].destroy();
				(IcontabId.getContent()[1] === undefined) ? null: IcontabId.getContent()[1].destroy();
				(IcontabId.getContent()[1] === undefined) ? null: IcontabId.getContent()[1].destroy();
			}
			var SelectedValue1 = this.getView().byId("idFieldEquipmentSelect").getSelected();
			if (SelectedValue1 === false) {
				(IcontabId1.getContent()[0] === undefined) ? null: IcontabId1.getContent()[0].destroy();
				(IcontabId1.getContent()[0] === undefined) ? null: IcontabId1.getContent()[0].destroy();
				(IcontabId1.getContent()[0] === undefined) ? null: IcontabId1.getContent()[0].destroy();
			}

		},
		onSelectMarineLabSelect: function () {
			this.getView().byId("idMarineLabInfoLoad").setEnabled(true);
			this.getView().byId("idDefaultText1").setVisible(false);
			this.destroy();
			var SelectedValue = this.getView().byId("idFieldWorkSelect").getSelected();
			var SelectedValue1 = this.getView().byId("idFieldEquipmentSelect").getSelected();
			this.getView().byId("idIconTabBarMulti").setSelectedKey("marine");
			this.getView().byId("idMarine_FieldRequest").setEnabled(false);
			this.getView().byId("idMarine_FieldEquipement").setEnabled(false);
			var IcontabId = this.getView().byId("idMarine_FieldRequest");
			if (IcontabId.getContent()[1] === undefined) {
				if (SelectedValue === true) {
					/* ######### Field Work Request Lab Fragment #########*/
					this.destroy();
					this.getView().byId("idMarine_FieldRequest").setEnabled(true);
					this.getView().byId("idmarineFieldRequestLab").setSelectedKey("FieldRequest");
					var IcontabId = this.getView().byId("idMarine_FieldRequest");
					IcontabId.addContent(new sap.ui.xmlfragment("PlantGrowth.CoreLabs.Fragments.FieladWorkRequirementLab", this));
					this.tripParticipants = [];
					this.onPressTripParticipantsTable();
					sap.ui.getCore().byId("idStartDate").setMinDate(new Date());
					sap.ui.getCore().byId("idEndDate").setMinDate(new Date());
					sap.ui.getCore().byId("idCMRStartdate").setMinDate(new Date());
					sap.ui.getCore().byId("idCMREnddate").setMinDate(new Date());
					var oV1Radiobuttons2 = sap.ui.getCore().byId("idDiveGear").setSelectedIndex(200);
					try {
						oV1Radiobuttons2.setSelectedIndex(oV1Radiobuttons2.getButtons().length);
					} catch (err) {};
				}
			} else {
				this.getView().byId("idMarine_FieldRequest").setEnabled(true);
			}
			var IcontabId1 = this.getView().byId("idMarine_FieldEquipement");
			if (IcontabId1.getContent()[0] === undefined) {
				if (SelectedValue1 === true) {
					/* ######### Field equipment Request Lab Fragment #########*/
					this.destroy();
					this.getView().byId("idmarineFieldRequestLab").setSelectedKey("Equipment");
					this.getView().byId("idMarine_FieldEquipement").setEnabled(true);
					var IcontabId1 = this.getView().byId("idMarine_FieldEquipement");
					IcontabId1.addContent(new sap.ui.xmlfragment("PlantGrowth.CoreLabs.Fragments.FieldEquipmentRequestLab", this));
					//	sap.ui.getCore().byId("idTodaysDateLabel3").setText(new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear());
					this.FieldEquipmentdata = [];
					//	this.onPressAddFieldsEquipments();
				}
			} else {
				this.getView().byId("idMarine_FieldEquipement").setEnabled(true);
			}
			if (SelectedValue1 === false && SelectedValue === false) {
				this.destroy();
				this.getView().byId("idFieldEquipmentSelect").setSelected(false);
				this.getView().byId("idFieldWorkSelect").setSelected(false);
				this.getView().byId("idMarineLabInfoLoad").setEnabled(false);
				this.getView().byId("idMarine_FieldRequest").setEnabled(false);
				this.getView().byId("idDefaultText1").setVisible(true);
			}
			this.buttonHidden();
		},
		onSelectDiveGearSelect: function () {
			var radioButton = sap.ui.getCore().byId("idDiveGear").getSelectedButton().getText();
			if (radioButton === "Yes") {
				sap.ui.getCore().byId("idDivegearForm").setVisible(true);
			} else {
				sap.ui.getCore().byId("idDivegearForm").setVisible(false);
			}

		},
		onSelectIconTabr: function () {
			//this.addDatepicker();
		},
		onPressAddEquipments: function () {
			this.EngineeringInfoModel = new JSONModel();
			this.Engineeringdata.push({
				"Category": "",
				"Description": "",
				"Start": "",
				"End": "",
				"Quantity": "",
				"Rate": "",
				"Unit": "",
				"CalcultedCharge": ""
			});
			this.EngineeringInfoModel.setData({
				EngineeringInfo: this.Engineeringdata
			});
			var oTableH = sap.ui.getCore().byId("idEngineeringLab");
			oTableH.setModel(this.EngineeringInfoModel);

		},
		onPressAddFieldsEquipments: function () {
			this.FieldEquipmentInfoModel = new JSONModel();
			this.FieldEquipmentdata.push({
				"category": "",
				"subCategory1": "",
				"subCategory2": "",
				"description": "",
				"startDate": "",
				"endDate": "",
				"quantity": "",
				"rate": "",
				"unit": "",
				"calculatedCharge": ""
			});
			this.FieldEquipmentInfoModel.setData({
				FieldEquipmentInfo: this.FieldEquipmentdata
			});
			var oTableH = sap.ui.getCore().byId("idFieldEquipmentRequestLab");
			oTableH.setModel(this.FieldEquipmentInfoModel);
			sap.ui.getCore().getModel("data").getData().marineOperationsForm.fieldEquipmentRequestForm.equipmentsRequested = this.FieldEquipmentdata;

		},
		onPressTripParticipantsTable: function () {
			this.ParticipantsInfoModel = new JSONModel();
			this.tripParticipants.push({
				"name": "",
				"passportNum": "",
				"contactType": ""
			});
			this.ParticipantsInfoModel.setData({
				ParticipantsInfoInfo: this.tripParticipants
			});
			var oTableH = sap.ui.getCore().byId("idParticipantsInfo");
			oTableH.setModel(this.ParticipantsInfoModel);
			sap.ui.getCore().getModel("data").getData().marineOperationsForm.fieldWorkRequestForm.tripParticipants = this.tripParticipants;

		},
		onPressAddSeaLabTable_Chemicals: function (oEvent) {
			if (oEvent) {
				this.seatableList = [];
				this.seatableList.push(oEvent.getSource().getId());
			}
			for (var i = 0; i < this.seatableList.length; i++) {
				if (this.seatableList[i] === "chemicalsButtonID") {
					this.SeaLabTable_ChemicalsInfoModel = new JSONModel();
					this.Chemicals.push({
						"Chemicals": "",
						"Liquid": "",
						"Concentration": "",
						"Amount": "",
						"Participants": "",
						"waste": ""
					});
					this.SeaLabTable_ChemicalsInfoModel.setData({
						chemicals: this.Chemicals
					});
					var oTableH = sap.ui.getCore().byId("idSeaLabTable_Chemicals");
					oTableH.setModel(this.SeaLabTable_ChemicalsInfoModel);
				}
				if (this.seatableList[i] === "idCompressGasButton") {
					this.SeaLabTable_CompressesInfoModel = new JSONModel();
					this.CompressGas.push({
						"Gas": "",
						"Classification": "",
						"Concentration": "",
						"PackageType": "",
						"Cylinder": "",
						"Participant": "",
						"WasteOfAmount": ""

					});
					this.SeaLabTable_CompressesInfoModel.setData({
						CompressGas: this.CompressGas
					});
					var oTableidSeaLabTable_Compresses = sap.ui.getCore().byId("idSeaLabTable_Compresses");
					oTableidSeaLabTable_Compresses.setModel(this.SeaLabTable_CompressesInfoModel);
				}
				if (this.seatableList[i] === "idOthersButton") {
					this.SeaLabTable_OthersInfoModel = new JSONModel();
					this.others.push({
						"List": "",
						"Information": "",
						"Notes": "",
						"Cylinder": "",
						"Name": "",
						"WasteOfAmount": ""

					});
					this.SeaLabTable_OthersInfoModel.setData({
						others: this.others
					});
					var oTableidSeaLabTable_Compresses1 = sap.ui.getCore().byId("idSeaLabTable_others");
					oTableidSeaLabTable_Compresses1.setModel(this.SeaLabTable_OthersInfoModel);
				}
				// if (this.seatableList[i] === "idOthersDetailedButton") {
				// 	this.SeaLabTable_othersDetailedInfoModel = new JSONModel();
				// 	this.othersDetailed.push({
				// 		"Category": "",
				// 		"SubCat1": "",
				// 		"SubCat2": "",
				// 		"SubCat3": "",
				// 		"Description": "",
				// 		"Start": "",
				// 		"End": "",
				// 		"Quantity": "",
				// 		"Rate": "",
				// 		"Calculated": ""

				// 	});
				// 	this.SeaLabTable_othersDetailedInfoModel.setData({
				// 		othersDetailed: this.othersDetailed
				// 	});
				// 	var othersDTable = sap.ui.getCore().byId("idSeaLabTable_EquipmentRequested");
				// 	othersDTable.setModel(this.SeaLabTable_othersDetailedInfoModel);
				// }
				if (this.seatableList[i] === "idAquariumButton") {
					this.SeaLabTable_AquariumInfoModel = new JSONModel();
					this.Aquarium.push({
						"Aquarium": "",
						"Size": "",
						"Type": "",
						"Temperature": "",
						"Lightrequirement": "",
						"Watertype": "",
						"Chemicals": "",
						"Quantity": "",
						"Concentration": ""
					});
					this.SeaLabTable_AquariumInfoModel.setData({
						Aquarium: this.Aquarium
					});
					var AquariumTable = sap.ui.getCore().byId("idSeaLabTable_Aquarium");
					AquariumTable.setModel(this.SeaLabTable_AquariumInfoModel);
				}
			}
		},

		/* ################## Validation for prev next icontab filters ##############*/
		buttonHidden: function () {
			this.show = [];
			var check1 = this.getView().byId("idFieldWorkSelect").getSelected();
			var check0 = this.getView().byId("idFieldEquipmentSelect").getSelected();
			if (check1 || check0) {
				this.show.push("check1");
			}
			var check2 = this.getView().byId("idEngineeringSelect").getSelected();
			if (check2 == true) {
				this.show.push("Engineering");
			}
			var check3 = this.getView().byId("idSeaLabSelect").getSelected();
			if (check3 == true) {
				this.show.push("sea");
			}
			if (this.show.length == 2) {
				if (this.getView().byId("idIconTabBarMulti").getSelectedKey() == "marine") {
					this.getView().byId("idNext").setVisible(true);
					this.getView().byId("idPrev").setVisible(false);
					this.getView().byId("idSubmit").setVisible(false);
				} else if (this.getView().byId("idIconTabBarMulti").getSelectedKey() == "sea" || (check1 && check2)) {
					this.getView().byId("idNext").setVisible(false);
					this.getView().byId("idPrev").setVisible(true);
					this.getView().byId("idSubmit").setVisible(true);
				} else if (this.getView().byId("idIconTabBarMulti").getSelectedKey() == "Engineering" || (check1 && check2)) {
					if (this.getView().byId("idMarineLabInfoLoad").getEnabled() == true) {
						this.getView().byId("idNext").setVisible(false);
						this.getView().byId("idPrev").setVisible(true);
						this.getView().byId("idSubmit").setVisible(true);
					} else {
						this.getView().byId("idNext").setVisible(true);
						this.getView().byId("idPrev").setVisible(false);
						this.getView().byId("idSubmit").setVisible(false);
					}

				} else {
					this.getView().byId("idNext").setVisible(true);
					this.getView().byId("idPrev").setVisible(false);
				}
			}
			if (this.show.length == 3) {
				if (this.getView().byId("idIconTabBarMulti").getSelectedKey() == "sea") {
					this.getView().byId("idNext").setVisible(false);
					this.getView().byId("idPrev").setVisible(true);
					this.getView().byId("idSubmit").setVisible(true);

				} else if (this.getView().byId("idIconTabBarMulti").getSelectedKey() == "marine") {
					this.getView().byId("idPrev").setVisible(false);
					this.getView().byId("idNext").setVisible(true);
					this.getView().byId("idSubmit").setVisible(false);
				} else {
					this.getView().byId("idNext").setVisible(true);
					this.getView().byId("idPrev").setVisible(true);
					this.getView().byId("idSubmit").setVisible(false);
				}
			}
			if (this.show.length == 1) {
				this.getView().byId("idPrev").setVisible(false);
				this.getView().byId("idNext").setVisible(false);
				this.getView().byId("idSubmit").setVisible(true);
			}
		},
		onPressPrev: function () {
			var selectedKey = this.getView().byId("idIconTabBarMulti").getSelectedKey();
			if (selectedKey == "sea") {
				if (this.getView().byId("idEngineeringLabInfoLoad").getEnabled() == true) {
					this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
				} else {
					this.getView().byId("idIconTabBarMulti").setSelectedKey("marine");
				}
			} else if (selectedKey == "Engineering") {
				this.getView().byId("idIconTabBarMulti").setSelectedKey("marine");
			}
			this.buttonHidden();
		},
		onPressNext: function () {
			var selectedKey = this.getView().byId("idIconTabBarMulti").getSelectedKey();
			if (selectedKey == "marine") {
				this.MandatoryFieldsForMarine();
				if (this.Mandatory == true) {
					if (this.getView().byId("idEngineeringLabInfoLoad").getEnabled() == true) {
						this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
					} else {
						this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
					}
					this.buttonHidden();
				} else {
					MessageBox.error("Enter Mandatory fields");
				}
			} else if (selectedKey == "Engineering") {
				var value1 = sap.ui.getCore().byId("idConsultation").getSelected();
				var value2 = sap.ui.getCore().byId("idFabrication").getSelected();
				var value3 = sap.ui.getCore().byId("idFacilities").getSelected();
				if (value1 == false && value2 == false && value3 == false) {
					MessageBox.error("Enter Mandatory fields");
					this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
					this.buttonHidden();
				} else {
					this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
					this.buttonHidden();
				}
			}
		},
		onSelectIcontabBar: function () {
			var selectedKey = this.getView().byId("idIconTabBarMulti").getSelectedKey();
			if (selectedKey == "marine") {
				this.getView().byId("idIconTabBarMulti").setSelectedKey("marine");
				this.getView().byId("idPrev").setVisible(false);
				this.getView().byId("idNext").setVisible(true);
				this.getView().byId("idSubmit").setVisible(false);
			} else if (selectedKey == "Engineering") {
				if (this.getView().byId("idMarineLabInfoLoad").getEnabled() == true) {
					this.MandatoryFieldsForMarine();
					if (this.Mandatory == true) {
						this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
						this.buttonHidden();
					} else {
						MessageBox.error("Enter Mandatory fields");
						this.getView().byId("idIconTabBarMulti").setSelectedKey("marine");
					}
				} else {
					this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
					this.getView().byId("idPrev").setVisible(true);
					this.getView().byId("idNext").setVisible(true);
					this.getView().byId("idSubmit").setVisible(false);
				}

			} else if (selectedKey == "sea") {
				if (this.getView().byId("idMarineLabInfoLoad").getEnabled() == true) {
					this.MandatoryFieldsForMarine();
					if (this.Mandatory == true) {
						this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
					} else {
						MessageBox.error("Enter Mandatory fields");
						this.getView().byId("idIconTabBarMulti").setSelectedKey("marine");
					}
				} else if (this.getView().byId("idEngineeringLabInfoLoad").getEnabled() == true) {
					var value1 = sap.ui.getCore().byId("idConsultation").getSelected();
					var value2 = sap.ui.getCore().byId("idFabrication").getSelected();
					var value3 = sap.ui.getCore().byId("idFacilities").getSelected();
					if (value1 == false && value2 == false && value3 == false) {
						MessageBox.error("Enter Mandatory fields");
						this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
					} else {
						this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
						this.buttonHidden();
					}
				} else {
					this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
					this.buttonHidden();
				}
			}

		},
		MandatoryFieldsForMarine: function () {
			var selectedLab = this.getView().byId("idFieldWorkSelect").getSelected();
			if (selectedLab === true) {
				var VesselRequested = sap.ui.getCore().byId("idVessel").getValue();
				var VesselTotalPrice = sap.ui.getCore().byId("idVesselTotalPrice").getValue();
				var StartDate = sap.ui.getCore().byId("idStartDate").getValue();
				var EndDate = sap.ui.getCore().byId("idEndDate").getValue();
				//	var TotalPriceMarine = sap.ui.getCore().byId("idTotalPriceMarine").getValue();
				var CMRStartDate = sap.ui.getCore().byId("idCMRStartdate").getValue();
				var CMREndDate = sap.ui.getCore().byId("idCMREnddate").getValue();
				if (VesselRequested === "" || VesselTotalPrice === "" || StartDate === "" || EndDate === "" ||
					CMRStartDate ===
					"" || CMREndDate === "") {
					this.Mandatory = false;
				} else {
					this.Mandatory = true;
				}
			} else {
				this.Mandatory = true;
			}
		},
		onPressSubmit: function () {
			var MarineSelect = this.getView().byId("idMarineLabInfoLoad").getEnabled();
			var EngineeringSelect = this.getView().byId("idEngineeringLabInfoLoad").getEnabled();
			var SeaLabSelect = this.getView().byId("idSeaLabLabInfoLoad").getEnabled();
			var Error = [];
			if (MarineSelect === true) {
				this.MandatoryFieldsForMarine();
				if (this.Mandatory === false) {
					Error.push(" mandatory fields from Marine Lab");
				}
			}
			if (EngineeringSelect === true) {
				var value1 = sap.ui.getCore().byId("idConsultation").getSelected();
				var value2 = sap.ui.getCore().byId("idFabrication").getSelected();
				var value3 = sap.ui.getCore().byId("idFacilities").getSelected();
				if (value1 === false && value2 === false && value3 === false) {
					Error.push(" mandatory fields from Engineering Lab");
				}
			}
			if (SeaLabSelect === true) {
				var idWetLab = sap.ui.getCore().byId("idWetLab").getSelected();
				var idDryLab = sap.ui.getCore().byId("idDryLab").getSelected();
				if (idWetLab === false && idDryLab === false) {
					Error.push(" mandatory fields from Sea Lab");
				}
			}
			if (Error.length > 0) {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
					"Please enter " + Error + " ", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {

						}
					}
				);
			} else {
				var saveData = sap.ui.getCore().getModel("data").getData();
				var serviceUrlsModel = this.getOwnerComponent().getServiceUrl();
				this.PostDatas = this.getOwnerComponent().genericAjax(serviceUrlsModel.postRequestForLab, "POST", JSON.stringify(saveData));
				if (this.PostDatas.status === "SUCCESS") {
					MessageBox.show(
						"Data Saved Successfully" + this.PostDatas.responseDto, {
							icon: MessageBox.Icon.SUCCESS,
							title: "Success",
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {}
						}
					);
				}
			}

		},

		/* Inside Form validations*/

		onPressNextFieldWorkRequestForm: function () {
			var selectedKey = sap.ui.getCore().byId("idFieldWorkRequestForm").getSelectedKey();
			var VesselRequested = sap.ui.getCore().byId("idVessel").getValue();
			var VesselTotalPrice = sap.ui.getCore().byId("idVesselTotalPrice").getValue();
			var StartDate = sap.ui.getCore().byId("idStartDate").getValue();
			var EndDate = sap.ui.getCore().byId("idEndDate").getValue();
			//	var TotalPriceMarine = sap.ui.getCore().byId("idTotalPriceMarine").getValue();
			var CMRStartDate = sap.ui.getCore().byId("idCMRStartdate").getValue();
			var CMREndDate = sap.ui.getCore().byId("idCMREnddate").getValue();
			if (selectedKey === "TripSpecs") {
				if (VesselRequested === "" || VesselTotalPrice === "" || StartDate === "" || EndDate === "") {
					sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("TripSpecs");
					sap.m.MessageBox.show(
						"Please enter mandatory fields", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {}
						}
					);
				} else {
					setTimeout(function () {
						$("#idTripSpecs").addClass("addColor");
					}, 200);
					sap.ui.getCore().byId("idCMRAssitance").setEnabled(true);
					sap.ui.getCore().byId("idBackFieldReqForm").setVisible(true);
					sap.ui.getCore().byId("idContinue").setVisible(true);
					sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("AssistReq");
					$("#idTripSpecs").addClass("addColor");
					sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(false);
				}
			} else if (selectedKey === "AssistReq") {
				if (CMREndDate === "" || CMRStartDate === "") {
					sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("AssistReq");
					sap.m.MessageBox.show(
						"Please enter mandatory fields", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {}
						}
					);
				} else {
					setTimeout(function () {
						$("#idTripSpecs").addClass("addColor");
						$("#idCMRAssitance").addClass("addColor");
					}, 200);
					sap.ui.getCore().byId("idTripParticipantInfo").setEnabled(true);
					sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("PartInfo");
					sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(true);
					sap.ui.getCore().byId("idContinue").setVisible(false);
					sap.ui.getCore().byId("idBackFieldReqForm").setVisible(true);
				}
			}
		},
		onPressBackFieldWorkRequestForm: function () {
			var selectedKey = sap.ui.getCore().byId("idFieldWorkRequestForm").getSelectedKey();
			if (selectedKey === "PartInfo") {
				sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("AssistReq");
				sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(false);
				sap.ui.getCore().byId("idBackFieldReqForm").setVisible(true);
				sap.ui.getCore().byId("idContinue").setVisible(true);
			} else if (selectedKey === "AssistReq") {
				sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("TripSpecs");
				sap.ui.getCore().byId("idBackFieldReqForm").setVisible(false);
				sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(false);
				sap.ui.getCore().byId("idContinue").setVisible(true);
			}
		},
		/* field request form save */
		onPressSaveFieldWorkRequestForm: function () {

			if (this.getView().byId("idMarine_FieldEquipement").getEnabled() === true) {
				sap.m.MessageToast.show("Details Saved");
				this.getView().byId("idmarineFieldRequestLab").setSelectedKey("Equipment");
			} else if (this.getView().byId("idEngineeringLabInfoLoad").getEnabled() === true) {
				sap.m.MessageToast.show("Details Saved");
				this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
			} else if (this.getView().byId("idSeaLabLabInfoLoad").getEnabled() === true) {
				sap.m.MessageToast.show("Details Saved");
				this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
			} else {
				sap.m.MessageToast.show("Details Saved");
			}
		},
		/* field equipment Request form*/
		onPressSaveFieldEquipmentRequestForm: function () {
			if (this.getView().byId("idEngineeringLabInfoLoad").getEnabled() === true) {
				sap.m.MessageToast.show("Details Saved");
				this.getView().byId("idIconTabBarMulti").setSelectedKey("Engineering");
			} else if (this.getView().byId("idSeaLabLabInfoLoad").getEnabled() === true) {
				sap.m.MessageToast.show("Details Saved");
				this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
			} else {
				sap.m.MessageToast.show("Details Saved");
			}
		},
		/*Save Enginnering Lab */
		onPressSaveEnginneringRequestForm: function () {
			if (this.getView().byId("idSeaLabLabInfoLoad").getEnabled() === true) {
				sap.m.MessageToast.show("Details Saved");
				this.getView().byId("idIconTabBarMulti").setSelectedKey("sea");
			} else {
				sap.m.MessageToast.show("Details Saved");
			}
		},
		/*Save Sea Lab*/
		onPressSaveSeaRequestForm: function () {
			sap.m.MessageToast.show("Details Saved");
		},

		onSelectIconTabrFieldWorkRequestForm: function () {
			var selectedKey = sap.ui.getCore().byId("idFieldWorkRequestForm").getSelectedKey();
			if (selectedKey === "PartInfo") {
				sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("PartInfo");
				sap.ui.getCore().byId("idBackFieldReqForm").setVisible(true);
				sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(true);
				sap.ui.getCore().byId("idContinue").setVisible(false);
			} else if (selectedKey === "AssistReq") {
				sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("AssistReq");
				sap.ui.getCore().byId("idBackFieldReqForm").setVisible(true);
				sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(false);
				sap.ui.getCore().byId("idContinue").setVisible(true);
			} else if (selectedKey === "TripSpecs") {
				sap.ui.getCore().byId("idFieldWorkRequestForm").setSelectedKey("TripSpecs");
				sap.ui.getCore().byId("idBackFieldReqForm").setVisible(false);
				sap.ui.getCore().byId("idSaveFieldReqForm").setVisible(false);
				sap.ui.getCore().byId("idContinue").setVisible(true);
			}
		},
		onPressNextSeaLabs: function () {
			this.validationSealab();
			var selectedKey = sap.ui.getCore().byId("idIconTabBarSea").getSelectedKey();
			if (selectedKey === "idProjectSpecification" && this.SeaLabValidation === true) {
				sap.ui.getCore().byId("idEquipmentRequested").setEnabled(true);
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idEquipmentRequested");
				sap.ui.getCore().byId("idBackSeaLab").setVisible(true);
				setTimeout(function () {
					$("#idProjectSpecification").addClass("addColor");
				}, 200);
			} else if (selectedKey === "idEquipmentRequested") {
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
				sap.ui.getCore().byId("idResearchActivities").setEnabled(true);
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idResearchActivities");
				setTimeout(function () {
					$("#idProjectSpecification").addClass("addColor");
					$("#idEquipmentRequested").addClass("addColor");;
				}, 200);
			} else if (selectedKey === "idResearchActivities") {
				sap.ui.getCore().byId("idEngineeringControls").setEnabled(true);
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idEngineeringControls");
				setTimeout(function () {
					$("#idProjectSpecification").addClass("addColor");
					$("#idEquipmentRequested").addClass("addColor");
					$("#idResearchActivities").addClass("addColor");
				}, 200);

			} else if (selectedKey === "idEngineeringControls") {
				sap.ui.getCore().byId("idProcedure").setEnabled(true);
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(false);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(true);
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idProcedure");
				setTimeout(function () {
					$("#idProjectSpecification").addClass("addColor");
					$("#idEquipmentRequested").addClass("addColor");
					$("#idResearchActivities").addClass("addColor");
					$("#idEngineeringControls").addClass("addColor");
				}, 200);
			} else if (this.SeaLabValidation === false) {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idProjectSpecification");
				sap.m.MessageBox.show(
					"Please enter mandatory fields", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {}
					}
				);
			}
		},
		onPressBackSealabs: function () {
			var selectedKey = sap.ui.getCore().byId("idIconTabBarSea").getSelectedKey();
			if (selectedKey === "idProcedure") {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idEngineeringControls");
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
			} else if (selectedKey === "idEngineeringControls") {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idResearchActivities");
			} else if (selectedKey === "idResearchActivities") {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idEquipmentRequested");
			} else if (selectedKey === "idEquipmentRequested") {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idProjectSpecification");
				sap.ui.getCore().byId("idBackSeaLab").setVisible(false);
			}
		},
		validationSealab: function () {
			var idWetLab = sap.ui.getCore().byId("idWetLab").getSelected();
			var idDryLab = sap.ui.getCore().byId("idDryLab").getSelected();
			if (idWetLab === false && idDryLab === false) {
				this.SeaLabValidation = false;
			} else {
				this.SeaLabValidation = true;
			}
		},
		onSelectIcontabBarSea: function () {
			var selectedKey = sap.ui.getCore().byId("idIconTabBarSea").getSelectedKey();
			sap.ui.getCore().byId("idBackSeaLab").setVisible(true);
			this.validationSealab();
			if (selectedKey === "idProcedure" && this.SeaLabValidation === true) {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idProcedure");
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(false);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(true);
			} else if (selectedKey === "idEngineeringControls" && this.SeaLabValidation === true) {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idEngineeringControls");
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
			} else if (selectedKey === "idResearchActivities" && this.SeaLabValidation === true) {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idResearchActivities");
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
			} else if (selectedKey === "idEquipmentRequested" && this.SeaLabValidation === true) {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idEquipmentRequested");
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
			} else if (selectedKey === "idProjectSpecification") {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idProjectSpecification");
				sap.ui.getCore().byId("idBackSeaLab").setVisible(false);
				sap.ui.getCore().byId("idContinueSeaLab").setVisible(true);
				sap.ui.getCore().byId("idSaveSeaLab").setVisible(false);
			} else if (this.SeaLabValidation === false) {
				sap.ui.getCore().byId("idIconTabBarSea").setSelectedKey("idProjectSpecification");
				sap.m.MessageBox.show(
					"Please enter mandatory fields", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {}
					}
				);
			}
		},

		/* on select live gear*/
		onDiveGear: function () {
			var selectedRadioButton = sap.ui.getCore().byId("idDiveGear").getSelectedButton().getText();
			if (selectedRadioButton == "Yes") {
				sap.ui.getCore().byId("idDiveGearVisibility").setVisible(true);
				this.GearLab = [];
				this.Accessories = [];
				this.list = ["idAddGearButton", "idGearAccessories"];
				this.onPressAddDiveGear();
			} else {
				sap.ui.getCore().byId("idDiveGearVisibility").setVisible(false);
			}
		},
		onPressAddDiveGear: function (oEvent) {
			if (oEvent) {
				this.list = [];
				this.list.push(oEvent.getSource().getId());
			}
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i] === "idAddGearButton") {
					this.AddDiveEquipmentInfoModel = new JSONModel();
					this.GearLab.push({
						"name": "",
						"SubCat1": "",
						"SubCat2": "",
						"SubCat3": ""
					});
					this.AddDiveEquipmentInfoModel.setData({
						GearLab: this.GearLab
					});
					var oTableH = sap.ui.getCore().byId("idDiveGeartable");
					oTableH.setModel(this.AddDiveEquipmentInfoModel);
				}
				if (this.list[i] === "idGearAccessories") {
					this.AddDiveAccessoriesInfoModel = new JSONModel();
					this.Accessories.push({
						"name": "",
						"SubCat1": "",
						"SubCat2": "",
						"SubCat3": ""
					});
					this.AddDiveAccessoriesInfoModel.setData({
						AccessoriesLab: this.Accessories
					});
					var oTableH = sap.ui.getCore().byId("idDiveGeartable1");
					oTableH.setModel(this.AddDiveAccessoriesInfoModel);
				}
			}
			var StartDate = sap.ui.getCore().byId("DTP1");
			StartDate.setMinDate(new Date());
			StartDate.setMaxDate(this.addDays(new Date(), 30));

			var EndDate = sap.ui.getCore().byId("DTP2");
			EndDate.setMinDate(new Date());
			EndDate.setMaxDate(this.addDays(new Date(), 30));
			/*	var str = "2019-09-01T17:14:00";
				var dt = new Date(str + "Z");*/
			var Today = new Date();
			var Month = (Today.getMonth() + 1 < 10) ? "0" + (Today.getMonth() + 1) : (Today.getMonth() + 1);
			var DateValue = (Today.getDate() < 10) ? "0" + Today.getDate() : Today.getMonth();
			var str = Today.getFullYear() + "-" + Month + "-" + DateValue + "T17:14:00";
			var dt = new Date(str + "Z");
			var oCalendarStartDate = StartDate;
			///////////// Adding Special dates for Start date //////////
			for (var i = 0; i <= 30; i++) {
				var SpecialDate = this.addDays(new Date(dt.toString()), i);
				var Day = SpecialDate.getDay();
				if (Day == 5 || Day == 6) {
					oCalendarStartDate.addSpecialDate(new sap.ui.unified.DateTypeRange({
						startDate: this.addDays(new Date(dt.toString()), i),
						type: sap.ui.unified.CalendarDayType.NonWorking
					}));
				} else {
					oCalendarStartDate.addSpecialDate(new sap.ui.unified.DateTypeRange({
						startDate: this.addDays(new Date(dt.toString()), i),
						type: sap.ui.unified.CalendarDayType.Type01
					}));
				}
			}
			var oCalendar = EndDate;
			////////////////////Adding SpecialDates EndDate/////////////////
			for (var i = 0; i <= 30; i++) {
				var SpecialDate = this.addDays(new Date(dt.toString()), i);
				var Day = SpecialDate.getDay();
				if (Day == 5 || Day == 6) {
					oCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
						startDate: this.addDays(new Date(dt.toString()), i),
						type: sap.ui.unified.CalendarDayType.Type03
					}));
				} else {
					oCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
						startDate: this.addDays(new Date(dt.toString()), i),
						type: sap.ui.unified.CalendarDayType.Type06
					}));
				}
			}
			var oLegend = sap.ui.getCore().byId("calendar1");
			oLegend.setStandardItems([]);
			oLegend.addItem(new sap.ui.unified.CalendarLegendItem({
				text: "Available",
				type: "Type06"
			}));
			oLegend.addItem(new sap.ui.unified.CalendarLegendItem({
				text: "Not Available",
				type: "Type03"
			}));

		},
		/////// Date Calculation for specialdates/////////////
		addDays: function (oDate, nDays) {
			var oResultDate = new Date(oDate); //get copy of input date
			oResultDate.setDate(oResultDate.getDate() + nDays);
			return oResultDate;
		},
		handleChangeDateTime: function (oEvent) {
			if (oEvent.getSource().getId() == "DTP1") {
				var day = sap.ui.getCore().byId("DTP1").getDateValue().getDay();
				var time = sap.ui.getCore().byId("DTP1").getDateValue().getHours();
				if ((day === 5 || day === 6) || (time < 7 || time > 16)) {
					sap.m.MessageToast.show(' Pick up /Drop off in between 7am and 4pm Sunday to Thursday');
					sap.ui.getCore().byId("DTP1").setValue('');
					return;
				}
			} else {
				var day = sap.ui.getCore().byId("DTP2").getDateValue().getDay();
				var time = sap.ui.getCore().byId("DTP2").getDateValue().getHours();
				if ((day === 5 || day === 6) || (time < 7 || time > 16)) {
					sap.m.MessageToast.show(' Pick up /Drop off in between 7am and 4pm Sunday to Thursday');
					sap.ui.getCore().byId("DTP2").setValue('');
					return;
				}
			}
		},
		addPanel: function(){
		this.index = this.index+1;
				var index = this.index;
			  //var oPanel = new sap.m.Panel("abc");
     //         oPanel.setExpandable(true);
     //         oPanel.setHeaderText("Sub-Request ");
		  this.clothingData.results.push("");
	var clothingModel = new sap.ui.model.json.JSONModel();
		
			clothingModel.setData(this.clothingData);
			this.getView().setModel(clothingModel,"clothing");
			sap.ui.getCore().setModel(clothingModel,"clothing");
			this.addPanelContent();
	                   
	
		  },
		  addPanelContent:function(){
		  	var index = this.index;
		  		var myCustomListItem = new sap.m.CustomListItem({
		 content: new sap.ui.core.HTML({
	    content: { parts: [
	                         
	                          {path: 'clothing>/name'},
	                          //{path: 'quotationNumber'},
	                          ////{path: 'trackShipmentModel>dispatchDate',type: 'sap.ui.model.type.Date',formatOptions: { source: {pattern: 'yyyyMMdd'}, pattern: 'dd/MM/yyyy' }},
	                          //{path: 'spRepName'},
	                          //{path: 'spRepKaustId'},
	                          ////  {path: 'spRepName'},
	                          //{path: 'rFQStartDate' }
	                          
	                      ],
	            formatter: function(name) {
	             	var htmlString = ""+
	             	
             "<div class='container-wrapper'>"+
                                        "<div class='row font-s14 margin-t10'>"+
                                            "<div class='cols-10'>"+
                                            "Laboratory Use Request Form"+
                                            "</div>"+
                                            "<div class='cols-2'>"+
                                            "</div>"+
                                        "</div>"+
                                        "<div class='row font-s13'>"+
                                            "<div class='cols-12 fieldwork-request-container'>"+
                                                "<div class='table-container'>"+
                                                    "<div class='row border-btm'>"+
                                                        "<div class='cols-12 font-s13'>"+
                                                        name+
                                                        "</div>"+
                                                    "</div>"+
                                                    "<div class='row border-btm'>"+
                                                        "<div class='cols-6 border-right flex-wrap'>"+
                                                            "<div class='row padding-b10'>"+
                                                                "<div class='label-col'>"+
                                                                "Name of Procedure"+
                                                                "</div>"+
                                                                "<div class='description-detail no-padding-top'>"+
                                                                    "<Input class='input-text small' placeholder='' value='{data>/laboratoryUseRequestForm/standardOperatingProcedures/procedureName}'/>"+
                                                                "</div>"+
                                                            "</div>"+
                                                        "</div>"+
                                                        "<div class='cols-6 flex-wrap col-small-padding'>"+
                                                            "<div class='row padding-b10'>"+
                                                                "<div class='label-col'>"+
                                                                "Steps"+
                                                                "</div>"+
                                                                "<div class='description-detail no-padding-top'>"+
                                                                    "<TextArea placeholder=''>"+
                                                                    "</TextArea>"+
                                                                "</div>"+
                                                            "</div>"+
                                                        "</div>"+
                                                    "</div>"+
                                                "</div>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div class='container-wrapper'>"+
         "<div class='row font-s14 margin-t10'>"+
          "<div class='cols-10'>"+
          "Laboratory Use Request Form"+
          "</div>"+
          "<div class='cols-2'>"+
          "</div>"+
         "</div>"+
         "<div class='row font-s13'>"+
          "<div class='cols-12 fieldwork-request-container'>"+
           "<div class='table-container'>"+
            "<div class='row border-btm'>"+
             "<div class='cols-12 font-s13'>"+
             "Engineering Controls"+
              "<span class='inline-block margin-l10 font-12'>"+
              "The following personal protective equipment must be used while performing this procedure:"+
              "</span>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm space-between'>"+
             "<div class='cols-5'>"+
              "<ul class='flex flex-wrap'>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Chemical Fume Hood"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck0"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Glove Box"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck1"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Snorkel Device"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck2"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Ventilated Gas Cabinet"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck3"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Flammable Gas Monitor"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck4"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Safety Interlock"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck5"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Safety Shower"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck6"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Eyewash Station"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck7"+index+"'></input>"+
                "</div>"+
               "</li>"+
              "</ul>"+
             "</div>"+
             "<div class='cols-5'>"+
              "<ul class='flex flex-wrap'>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Fire Extinguisher"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck8"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Biological Safety Cabinet"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck9"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Laminor Flow Hood"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck10"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Bench Top Dust Enclosure"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck11"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Radiation Shielding"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck12"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Toxic Gas Monitor"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck13"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Low Level Oxygen Monito"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck14"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Other"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck15"+index+"'></input>"+
                "</div>"+
               "</li>"+
              "</ul>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm'>"+
             "<div class='cols-12 font-s13'>"+
             "Personal Protective Equipment (PPE)"+
              "<span class='inline-block margin-l10 font-12'>"+
              "The following personal protective equipment must be used while performing this procedure:"+
              "</span>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm space-between align-items-top'>"+
             "<div class='cols-5'>"+
              "<ul class='flex flex-wrap'>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Laboratory Coat"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck16"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Safety Glasses"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck17"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Full face Shield"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck18"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Cryogenic Gloves"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck19"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Disposable Gloves Type"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<input type='checkbox' id='chck20"+index+"'></input>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+
                "Chemical Resistant Glove (Describe Type)"+
                "</div>"+
                "<div class='cols-6 justify-content-right'>"+
                "<Input class='input-small' placeholder=''/>"+
                "</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Respirator (Describe Type)"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<Input class='input-small' placeholder=''/>"+"</div>"+
               "</li>"+
              "</ul>"+
             "</div>"+
             "<div class='cols-5'>"+
              "<ul class='flex flex-wrap'>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Chemical Apron"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck21"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Chemical Splash Goggles"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck22"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Laser Goggles"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck23"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Heat Resistant Gloves"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck24"+index+"'></input>"+"</div>"+
               "</li>"+
              "</ul>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm'>"+
             "<div class='cols-12 font-s13'>"+"Training Required"+
              "<span class='inline-block margin-l10 font-12'>"+
              "The following training is required as part of the SOP"+
              "</span>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm space-between align-items-top'>"+
             "<div class='cols-5'>"+
              "<ul class='flex flex-wrap'>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Chemical Spill Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck25"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Electrical Safety Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck26"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Flammable Liquid Safety Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck27"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Hazardous Waste Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck28"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Hydrofluoric Acid Awarness Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck29"+index+"'></input>"+"</div>"+
               "</li>"+
              "</ul>"+
             "</div>"+
             "<div class='cols-5'>"+
              "<ul class='flex flex-wrap'>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Laboratory Safety Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck30"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Laser Safety Training Radiation Safety Training"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck31"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Safe Handling of Liquid Nitrogen"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<input type='checkbox' id='chck32"+index+"'></input>"+"</div>"+
               "</li>"+
               "<li class='row col-xsmall-padding'>"+
                "<div class='cols-6'>"+"Other"+"</div>"+
                "<div class='cols-6 justify-content-right'>"+"<Input class='input-small' placeholder=''/>"+"</div>"+
               "</li>"+
              "</ul>"+
             "</div>"+
            "</div>"+
           "</div>"+
          "</div>"+
         "</div>"+
        "</div>"+
                "<div class='container-wrapper'>"+
         "<div class='row font-s14 margin-t10'>"+
          "<div class='cols-10'>"+"Laboratory Use Request Form"+"</div>"+
          "<div class='cols-2'>"+"Date:04/09/2019"+"</div>"+
         "</div>"+
         "<div class='row font-s13'>"+
          "<div class='cols-12 fieldwork-request-container'>"+
           "<div class='table-container'>"+
            "<div class='row border-btm'>"+
             "<div class='cols-12 bold'>"+"Hazards"+"</div>"+
             "<div class='cols-12'>"+
              "<p>"+"Briefly describe possible hazards associated with this procedure. This includes chemical hazards, physical hazards, equipment related hazards, etc."+"</p>"+
             "</div>"+
             "<div class='cols-8'>"+
              "<TextArea placeholder='Work Description'>"+"</TextArea>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm'>"+
             "<div class='cols-12 bold'>"+"Emergency Procedures"+"</div>"+
             "<div class='cols-12'>"+
              "<p>"+"Briefly discuss the specific procedures to be followed if emergency situations arise from the process/procedure. Describe steps to take in case of accidental spill, splash, exposure, etc."+"</p>"+
             "</div>"+
             "<div class='cols-8'>"+
              "<TextArea placeholder='Work Description'>"+"</TextArea>"+
             "</div>"+
            "</div>"+
            "<div class='row border-btm'>"+
             "<div class='cols-12 bold'>"+"Waste Disposal"+"</div>"+
             "<div class='cols-12'>"+
              "<p>"+"Outline waste materials to be generated and appropriate waste management procedure for the work."+"</p>"+
             "</div>"+
             "<div class='cols-8'>"+
              "<TextArea placeholder='Work Description'>"+"</TextArea>"+
             "</div>"+
            "</div>"+
            "<div class='row col-small-padding margin-b10'>"+
             "<div class='cols-12 align-items-center'>"+
              "<Button class='addmore' icon='sap-icon://sys-add' text='Add Procedure' press='onPressTripParticipantsTable'>"+"</Button>"+
             "</div>"+
            "</div>"+
            
           "</div>"+
          "</div>"+
         "</div>"+
        "</div>";

 

                  
   
	      return htmlString;
	    
	    }}})
	 // type : 'Navigation' //({type} if provided by the model)
	
	});
		  myCustomListItem.placeAt("panel-__panel0-"+this.index);
		  }
		  
		});
	});