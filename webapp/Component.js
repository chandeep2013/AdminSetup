sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"PlantGrowth/CoreLabs/model/models"
], function (UIComponent, Device, models) {
	"use strict";
	var serviceUrlsModel = "";
	var jsonObj = {};
	return UIComponent.extend("PlantGrowth.CoreLabs.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
			init: function () {
			// call the base component's init function
			   $.ajax({
                url: "model/serviceUrls.json",
                dataType: 'json',
                async: false,
                type: "GET",
              
                success: function(response) {
                  serviceUrlsModel   = response;
                  console.log(serviceUrlsModel);
                },
                error: function(textStatus, errorThrown) {
                    console.log(textStatus.responseText);
                }
            });
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			var oRouter = this.getRouter();
			if (oRouter) {
				oRouter.initialize();
			}

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		getServiceUrl:function(){
			return serviceUrlsModel;
		},
		setJsonObj:function(requestObj){
			jsonObj = requestObj;
			console.log(requestObj);
		},
		getJsonObj:function(){
			return jsonObj;
		},
		
		getCurrentDate:function(){
		var d = new Date();	
		var month = d.getMonth()+1;
		var day = d.getDate();
		var currDate =  ((''+day).length<2 ? '0' : '') + day+'/'+((''+month).length<2 ? '0' : '') + month + '/' +d.getFullYear();
		return currDate;
		},
		genericAjax:function(url,type,dataObj){
			var data = "";
			  $.ajax({
                url: url,
                dataType: 'json',
            	 async: false,
                data:dataObj,
                type: type,
            	beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "Basic Auth");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
            	complete:function(xhr,status){
            	},
                success: function(response) {
                  data   = response;

                },
                error: function(textStatus, errorThrown) {
                    console.log(textStatus.responseText);
                }
            });
            return data;
		}
	});
});