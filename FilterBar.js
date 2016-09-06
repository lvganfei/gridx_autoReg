var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/FilterBar/';

//edit the capser object properties in test instance

casper.options.verbose = true;// config.verbose;
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
			this.echo('page loaded!!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);	

};

//language setting



/*<------------------------------test filter bar and filter dialog----------------------------------------------------------------------------------*/
casper.test.begin('Filter bar & dialog test case', 14, function suite(test){


	casper.start();
	casper.then(function(){
		this.open(cases.testPagePrefix+cases.FilterBar, {

			//customHeaders: {'Accept-Language': 'en-US,en'}

			headers: {'Accept-Language': 'fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3'}

		}).then(casper.gridLoadCheck);
	});
		
	//casper.start(cases.testPagePrefix+cases.FilterBar, casper.gridLoadCheck);

	//test case start here
	casper.then(function(){

		this.waitForSelector('#grid1', function clickFilterBar(){
			this.click('#grid1 div.gridxFilterBarStatus');
		});

		this.waitUntilVisible('div.gridxFilterDialog', function checkFilterDialog(){
			this.wait(1000, function checking(){	
				var preDefRule = JSON.parse(this.getElementInfo('#preFilterInput').text);
				var titles = this.getElementsInfo('span.dijitAccordionText');
				var filterCons = this.evaluate(function(){
					return grid1.filterBar.filterData.conditions;
				});

				this.capture(screenshotFolder+'afterClickFilterBar.png');

				utils.dump(preDefRule);
				utils.dump(filterCons);
				//compare the filterData with predefined rules
				//match type is any
				test.assertEquals(preDefRule.type, 'any', '01--The match type should be any!');

				//compare conditions
				test.assertEquals(preDefRule.conditions[0], filterCons[0], '02--The filterDate[0] should be equal to the pre defined rules!');
				test.assertEquals(preDefRule.conditions[1], filterCons[1], '02--The filterDate[1] should be equal to the pre defined rules!');
				//test.assertEquals(preDefRule.conditions[2], filterCons[2], '02--The filterDate[2] should be equal to the pre defined rules!');
				test.assertEquals(preDefRule.conditions[2].value.amount, filterCons[2].value.amount, '02--The filterDate[2] should be equal to the pre defined rules!');
				test.assertEquals(preDefRule.conditions[2].value.interval, filterCons[2].value.interval, '02--The filterDate[2] should be equal to the pre defined rules!');


				//compare the text of domNode
				test.assertEquals(titles[0].text, 'Download Date before 11/20/2000', '03--The first rule should be correct!');

				test.assertEquals(titles[1].text, 'Date Time after 11/20/1950 00:00:00', '04--The second rule should be correct!');
				
				test.assertEquals(titles[2].text, 'Download Date past 2000 days', '05--The second rule should be correct!');

			})
			

		});
		

		
		//this.capture(screenshotFolder+'originGrid.png');
	});


	casper.run(function(){
		test.done();
	});
});