/*global QUnit*/

sap.ui.define([
	"PlantGrowth/CoreLabs/controller/labs.controller"
], function (Controller) {
	"use strict";

	QUnit.module("labs Controller");

	QUnit.test("I should test the labs controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});