phantom.outputEncoding="UTF-8";
var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/Filter/';

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

//grid reload function
casper.gridLoadCheck = function(){
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

};

//test quick filter
casper.test.begin('Quick Filter test case', 14, function suite1(test){
	casper.start(cases.testPagePrefix+cases.QuickFilter, function pageLoadCheck(){
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

	//test first QuickFilter(case sensitive) grid, id=grid3
	casper.then(function QuickFilter1(){

		this.waitForSelector('#grid3', function(){
			this.click('#grid3 div.gridxQuickFilterInput');
			this.page.sendEvent('keypress', 'voo');
		});
		

		this.wait(1000, function checkResult1(){
			var rowCount = this.evaluate(function(){
				return grid3.rowCount();
			});

			var innerBody = this.getElementInfo('#grid3 div.gridxBody').html;
			this.capture(screenshotFolder+'afterSetDataOf1stQuickFilter.png');

			test.assertEquals(rowCount, 0, '01--There filter result of "voo" should be 0!');
			test.assertEquals(innerBody, '', '02--The body node should be empty!');
		});

		//fill "Voo" into quick filter box
		this.then(function inputUpper(){
			this.sendKeys('#grid3 div.gridxQuickFilterNoFilterBar input.dijitInputInner', 'Voo', {reset:true});
		});

		this.wait(1000, function checkResult2(){
			var rowCount = this.evaluate(function(){
				return grid3.rowCount();
			});

			var innerBody = this.getElementInfo('#grid3 div.gridxBody').html;
			this.capture(screenshotFolder+'afterSetDataOf1stQuickFilter.png');

			test.assertEquals(rowCount, 1, '03--There filter result of "voo" should be 1!');
			test.assertMatch(innerBody, /Voo/g, '04--The body node should contain "Voo"!');
		});
	});


	//test second QuickFilter(case insensitive) grid, id=grid4
	casper.then(function QuickFilter1(){
		this.click('#grid4 div.gridxQuickFilterInput');
		this.page.sendEvent('keypress', 'der');
		this.wait(1000, function checkResult(){
			this.capture(screenshotFolder+'afterSetDataOf2stQuickFilter.png');
		})
	});

	casper.run(function(){
		test.done();
	});
});

/*<------------------------------test filter bar and filter dialog----------------------------------------------------------------------------------*/
casper.test.begin('Filter bar&dialog test case', 14, function suite2(test){
	casper.start(cases.testPagePrefix+cases.FilterBar, function pageLoadCheck(){
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


	casper.run(function(){
		test.done();
	});
});