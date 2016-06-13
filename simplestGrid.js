//var require = patchRequire(require);
/*var common = require('./common');
testUrl = common.testPagePrefix;
testPage = common.SimplestGrid;*/
/*
var option ={
	verbose: true, 
	logLevel:'debug',
	viewportSize: {width:800, height:600}
};


var casper = require('casper').create(option);
*/
var screenshotFolder = 'screenshot/SimplestGrid';

casper.test.begin('SimplestGrid test', 3, function suite1(test){

	casper.start('http://idx.ibm.com/dojo_1.10.4/gridx/tests/test_grid.html');

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

//test step1 change column structure
	casper.then(function changeStructure(){
		this.clickLabel('Change column structure', 'span');
		this.capture(screenshotFolder+'/afterChangeStructure.png');
		test.assertElementCount('td[role=columnheader]', 7, '02--the column count should be 7 after click change structure button');
	});

//test step2 change grid store
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
		test.assertNotEquals(storeLenbefore, storeLenAfter,'the before store and after store should not equal!');
	})


	casper.run(function(){
		test.done();
	});
});






