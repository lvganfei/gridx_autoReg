//var require = patchRequire(require);
/*var common = require('./common');
testUrl = common.testPagePrefix;
testPage = common.SimplestGrid;*/

var screenshotFolder = 'screenshot/SimplestGrid';

casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('Resource error code: '+ error.errorCode+" error string is: "+error.errorString+" error url is: "+error.url+' id: '+error.id,'ERROR');
});

casper.test.begin('SimplestGrid test', 10, function suite1(test){

	casper.start('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html');

	// start the test page
	casper.then(function(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.capture(screenshotFolder+'/beforeChangeStructure.png');
			test.assertElementCount('td[role=columnheader]', 13, '01--the original columns count should be 13!');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);
	});

	//test change column structure section
	casper.then(function changeStructure(){
		this.clickLabel('Change column structure', 'span');
		this.capture(screenshotFolder+'/afterChangeStructure.png');
		test.assertElementCount('td[role=columnheader]', 7, '02--the column count should be 7 after click change structure button');
	});

	//test change grid store section
	casper.then(function changeStore(){
		var storeLenbefore = this.evaluate(function(){
			return grid.store.data.length;
		});

		this.clickLabel('Change store','span');
		this.capture(screenshotFolder+'/afterChangeStore.png');

		var storeLenAfter = this.evaluate(function(){
			return grid.store.data.length;
		});

		this.echo(storeLenbefore+'& '+storeLenAfter);
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
		this.bypass(1);
	});

	//test delete the first row section
	casper.then(function deleteFirstRow(){
		
		test.assertEquals(this.exists('div[rowid="0"]'), true , '06--the first row which rowid=0 should exist!');
		this.clickLabel('Delete the first row', 'span');
		this.click('#dijit_form_Button_4');
		this.echo(this.exists('div[rowid="0"][parentid]'));
		this.capture(screenshotFolder+'/afterDelete.png');
		test.assertNotEquals(this.exists('div[rowid="0"]'), true, '07--the first row which rowid=0 should NOT exist!');
		this.echo(this.getElementAttribute('div[role=row][parentid]', 'rowid'));
		test.assertNotEquals(this.getElementAttribute('div[role=row][parentid]', 'rowid'), '0', '08--the rowid of first row should not be 0!');
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
		this.capture(screenshotFolder+'/afterToggleHeader.png');
		test.assertEquals(this.exists('div.gridxHeaderRowHidden'), true, '09--The grid header should be hidden!');
		test.assertEquals(this.getElementBounds('div.gridxHeaderRowHidden').height, 0 , '10--The height of header should be ZERO now!');
	});

	casper.run(function(){
		test.done();
	});
});






