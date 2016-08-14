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
		var originArr = [], tempArr;
		var cellsInfo = this.getElementsInfo('#grid td[colid="Genre"][role="gridcell"]');
		Array.prototype.forEach.call(cellsInfo, function(element, index) {
			originArr.push(element.text);
		});
		
		tempArr = originArr.concat();
		this.then(function checkResult(){
			
			// sort temparray and revers, then tempArr should equals to originArr
			tempArr = tempArr.sort().reverse();
			

			test.assert(originArr.toString() === tempArr.toString(), '01--The data in Genre column are sorted descendingly (equals the sorted then reversed one)!');

		})
		
	});

	//click the column header
	casper.then(function sortByColumnHeader(){
		
		var originArr = [], tempArr;

		//scroll to right body
		this.evaluate(function(){
			grid.hScroller.scroll(600);
		});
		//Now sort by Name column ascendingly
		this.then(function clickHeader(){
			this.click('#grid-Name');	
		});
		

		this.then(function checkResult(){
			var cellsInfo = this.getElementsInfo('#grid td[colid="Name"][role="gridcell"]');
			Array.prototype.forEach.call(cellsInfo, function(element, index) {
				originArr.push(element.text);
			});

			var tempArr = originArr.concat();
			
			//utils.dump(originArr);
			//sorted tempArr should equals to itself
			tempArr = tempArr.sort();
			//utils.dump(tempArr);

			test.assert(originArr.toString() === tempArr.toString(), '02--The data of Name column is sorted ascendingly!');
		});
		
		

	});

	//click the "Summary Genre and Year" column in the second grid
	casper.then(function sepecialData(){

		//scroll to right
		this.evaluate(function(){
			grid1.hScroller.scroll(600);
		});

		this.then(function sortAction(){
			this.click('#grid1-Summary');
		});

		this.then(function checkResult(){
			
			var originArr = [], tempArr, cellsInfo = this.getElementsInfo('#grid1 td[colid="Summary"][role="gridcell"]');

			Array.prototype.forEach.call(cellsInfo, function(element) {
				originArr.push(element.text);
			});

			tempArr = originArr.concat();
			utils.dump(tempArr);
			tempArr.sort();
			utils.dump(tempArr);

			test.assertEquals(tempArr, originArr, '03--The summary column is now sorted (the sorted data equals itself)!');

		})
	});

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

		utils.dump(originArr1);
		utils.dump(originArr2);
	})

	casper.run(function(){
		test.done();
	});
});