var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/ExtendedSelectRow/';

//edit the capser object properties in test instance
casper.options.verbose = config.verbose;
casper.options.logLevel = config.logLevel;
casper.options.viewportSize = config.viewportSize;

//error event handlers
casper.on("page.error", function(msg, trace) {
    this.echo("[Page Error]: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('[Resource error code]: '+ error.errorCode+" [error string]: "+error.errorString+" [error url]: "+error.url+' [id]: '+error.id,'ERROR');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('ExtendedSelect Row test case', 1, function suite1(test){
	casper.start(cases.testPagePrefix+cases.ExtendedSelectRow, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);

	});

	//test case start here
	//Select by buttons
	casper.then(function selectBtn(){
		this.clickLabel('Select', 'button');
		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});
		this.echo(rowStatus);
		var selectedId = this.getElementsAttribute('div.gridxRow.gridxRowSelected', 'rowid');
		utils.dump(selectedId);
		this.echo(typeof selectedId);
		//check if the style of selected row is changed.
		test.assertEquals(selectedId, ['0','1','2','3','4','5'], '01--The selected ID should be 0-5!')
		test.assertEquals(rowStatus, '0\n1\n2\n3\n4\n5', '02--Select row is right!');
		test.assertElementCount('div.gridxRow.gridxRowSelected', 6, '03--The selected rows count is 6!');
	});

	casper.run(function(){
		test.done();
	});
});