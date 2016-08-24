var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/NestedSort/';

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

casper.test.begin('Nested sort test case', 14, function suite1(test){
	casper.start(cases.testPagePrefix+cases.NestedSort, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);

	});

	//test case start here
	//Nested sort test case on the third grid
	casper.then(function beforeNestedSort(){
		var originArr1 = [], tempArr1 = [], originArr2 = [], tempArr2 = [];
		var cellsInfo1 = this.getElementsInfo('#grid2 td[colid="Genre"][role="gridcell"]');
		var cellsInfo2 = this.getElementsInfo('#grid2 td[colid="Artist"][role="gridcell"]');


		Array.prototype.forEach.call(cellsInfo1, function(element){
			originArr1.push(element.text);
		});

		Array.prototype.forEach.call(cellsInfo2, function(element){
			originArr2.push(element.text);
		});

		var tempArr1 = originArr1.concat();

		this.then(function checkResult(){

			test.assertEquals(originArr1, tempArr1.sort().reverse(), '01--The genre column is sorted descending (the data of it equals to its sorted and reversed data)!')
		});

		//use array.reduce() and array.slice()

		/*utils.dump(originArr1);
		utils.dump(originArr2);*/
	});

	casper.then(function thirdNestedSort(){
		
		this.mouse.move('#grid2-Year');
		this.capture(screenshotFolder+'afterHoveronColumnHeader.png');
	})

	casper.run(function(){
		test.done();
	});
});