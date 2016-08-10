var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var x = require('casper').selectXPath;
var screenshotFolder = 'screenshot/SingleSort/';

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

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg, 'INFO');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('SingleSort test case', 2, function suite1(test){
	casper.start(cases.testPagePrefix+cases.SingleSort, function pageLoadCheck(){
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

	
	casper.then(function beforeStart(){
		//verify the original sorting order is descending by Genre
		var tempArr = [];
		var cellsInfo = this.getElementsInfo('#grid td[colid="Genre"][role="gridcell"]');
		Array.prototype.forEach.call(cellsInfo, function(element, index) {
			tempArr.push(element.text);
		});

		this.then(function checkResult(){

			//the sorted array (by ) equals reversed array
			test.assert(tempArr.sort() === tempArr.reverse(), '01--The ascendingly sorted column string equals the reversed one!');

		})
		
	});

	//click the column header
	casper.then(function sortByColumnHeader(){
		
		this.click('#grid-Year');

		//Now sort by Year column
		var tempArr = [], finalArr;
		var cellsInfo = this.getElementsInfo('#grid td[colid="Genre"][role="gridcell"]');
		Array.prototype.forEach.call(cellsInfo, function(element, index) {
			tempArr.push(element.text);
		});

		this.then(function sort(){
			finalArr = tempArr.sort();
		});

		this.then(function checkResult(){

			
			//the ascendingly sorted column string equals itself
			utils.dump(tempArr);
			utils.dump(finalArr);
			test.assert(tempArr === finalArr, '02--The ascendingly sorted column strings equals itself casue its already ascendingly sorted! ');

		})
	})

	casper.run(function(){
		test.done();
	});
});