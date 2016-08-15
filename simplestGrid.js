//var require = patchRequire(require);
/*var common = require('./common');
testUrl = common.testPagePrefix;
testPage = common.SimplestGrid;*/
var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/SimplestGrid/';

//utils.dump(config);
casper.options.verbose = false;
casper.options.logLevel = 'debug';
casper.options.viewportSize = {width:1280, height:800};

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


//refresh grid function, eleId is the id of grid you want to refresh.
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('SimplestGrid test', 14, function suite1(test){

	casper.start(cases.testPagePrefix+cases.SimplestGrid, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'beforeChangeStructure.png');
			test.assertElementCount('td[role=columnheader]', 13, '01--the original columns count should be 13!');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);

	});


	//test change column structure section
	casper.then(function changeStructure(){
		this.clickLabel('Change column structure', 'span');
		this.capture(screenshotFolder+'afterChangeStructure.png');
		test.assertElementCount('td[role=columnheader]', 7, '02--the column count should be 7 after click change structure button');
	});

	//test change grid store section
	casper.then(function changeStore(){
		var storeLenbefore = this.evaluate(function(){
			return grid.store.data.length;
		});

		this.clickLabel('Change store','span');
		this.capture(screenshotFolder+'afterChangeStore.png');

		var storeLenAfter = this.evaluate(function(){
			return grid.store.data.length;
		});

		this.echo('!!The origin length and after length: '+storeLenbefore+'& '+storeLenAfter);
		test.assertNotEquals(storeLenbefore, storeLenAfter,'03--the before store and after store should not equal!');
	});

	//test add an empty new row section
	casper.then(function addNewEmptyRow(){

		var storeLenbefore = this.evaluate(function(){
			return grid.store.data.length;
		});

		this.clickLabel('Add an empty new row', 'span');
		test.assertEquals(this.evaluate(function(){
			return grid.store.data.length;
		}), storeLenbefore+1,'04--The new store should 1 longer than the older one!');
	});

	//test set year column of first row section
	casper.then(function setYear(){
		var yearBefore = this.getElementInfo('td[aria-describedby=grid-Year]').text;
		this.clickLabel('Set Year of the first row', 'span');
		test.assertNotEquals(this.getElementInfo('td[aria-describedby=grid-Year]').text, yearBefore, '05--the year value should change after click the button!');

		//skip the delete first row section temply due to the issue in casperjs clicking
		//this.bypass(1);
	});


	//test the destroy button section 
	casper.then(function destroyGrid(){
		test.assertEquals(this.exists('div.gridx'), true, '06--the grid node is existing!');
		this.clickLabel('Destroy', 'span');
		test.assertEquals(this.exists('div#grid'), false, '07--Now the grid node should be removed from document stream!');
	});

	//test create grid button section
	casper.then(function createGrid(){
		this.clickLabel('Create', 'span');
		test.assertEquals(this.exists('td[role=gridcell]'), true, '08--The grid should create correctly!');

	});



	//test the toggle header section
	casper.then(function toggleHeader(){
		this.clickLabel('Toggle Header', 'span');
		this.capture(screenshotFolder+'afterToggleHeader.png');
		test.assertEquals(this.exists('div.gridxHeaderRowHidden'), true, '09--The grid header should be hidden!');
		test.assertEquals(this.getElementBounds('div.gridxHeaderRowHidden').height, 0 , '10--The height of header should be ZERO now!');
	});

		//test delete the first row section
	casper.then(function deleteFirstRow(){
		this.capture(screenshotFolder+'beforeDelete.png');
		test.assertEquals(this.exists('div[rowid="0"]'), true , '11--the first row which rowid=0 should exist!');
		this.clickLabel('Delete the first row', 'span');
		this.click('#dijit_form_Button_4');
		this.refreshGrid('grid');
		var lenAfter = this.evaluate(function deleteRow(){
			return grid.store.data.length;
		});
		test.assertEquals(lenAfter, 98, '12--The store length after delete shoulb be 98!')
		this.echo('!!Is the rowid=0 exist? '+this.exists('div[rowid="0"][parentid]'));
		this.capture(screenshotFolder+'afterDelete.png');
		this.echo('!!the rowid of first row is: '+this.getElementAttribute('div[role=row][parentid]', 'rowid'));
		
		test.assertNotEquals(this.exists('div[rowid="0"]'), true, '13--the first row which rowid=0 should NOT exist!');
		
		test.assertNotEquals(this.getElementAttribute('div[role=row][parentid]', 'rowid'), '0', '14--the rowid of first row should not be 0!');
	});


	casper.run(function(){
		test.done();
	});
});






