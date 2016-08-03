
var cases = require('./common').cases;
var config = require('./common').config;
var casper = require('casper').create(config);
var utils = require('utils');
var x = require('casper').selectXPath;
//var mouse = require('mouse').create(casper);

casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
	this.echo('refresh completed!','INFO');
};

var gridLoadCheck = function(){
		this.waitFor(function check(){
			return this.exists('div.gridxRowHeaderRow[rowid="0"] td');
		}, function then(){
			this.echo('page loaded!');
			this.capture('originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);	

};

casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('Resource error code: '+ error.errorCode+" error string is: "+error.errorString+" error url is: "+error.url+' id: '+error.id,'ERROR');
});
/*
casper.on('keypress', function(e){
	this.echo('pressed element is: '+e);
});*/

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg, 'INFO');
});

casper.start(cases.testPagePrefix+cases.ExtendedSelectRow, gridLoadCheck);
    
casper.then(function setup(){
	this.evaluate(function addEventListener(){
		document.body.addEventListener('keydown', function(e){
			console.log('the key of event is: '+e.keyIdentifier+' keyCode is: '+e.which||e.keyCode);
			console.log('target is: '+e.target.tagName+'.('+e.target.className+')');
			console.log('active element is: '+document.activeElement.tagName+'.('+document.activeElement.className+')');
		});
		grid.onRowHeaderCellKeyDown= function(e){console.log(e.which||e.keyCode||e.key||e.charCode); console.log('now in grid rowheader: '+document.activeElement.tagName+'.('+document.activeElement.className+')')}
	});
});


casper.then(function tabKey(){

/*	var focusedEle; 
	
	
	do{

			this.page.sendEvent('keypress', this.page.event.key.Tab);
			
			focusedEle = this.evaluate(function getfocused(){
				return document.activeElement.className;

			});
			this.echo(focusedEle,'ERROR');
		
	}while (focusedEle.indexOf('gridxRowHeaderCell') == -1);*/



	


	
});

casper.then(function spaceKey(){

	//press TAB 3 times
	for(var i=0;i<3;i++){
		this.page.sendEvent('keypress', this.page.event.key.Tab);
	}
	

	this.then(function(){

		//workaround for the bug not retain focus in rowheader from previous step
		this.page.sendEvent('keypress', this.page.event.key.Tab);

		var focusedEle = this.evaluate(function getfocused(){
					return document.activeElement.className;

		});

		var firstRow = this.evaluate(function(){
			return document.querySelector('.gridxRowHeaderRow[rowid="0"] td').className;
		});

		this.echo('Now in new step: '+focusedEle,'ERROR');
		this.echo('class of first row header: '+firstRow, 'ERROR');
		this.page.sendEvent('keypress', this.page.event.key.Down);
		this.page.sendEvent('keypress', this.page.event.key.Down);
		this.page.sendEvent('keypress', this.page.event.key.Space);
		this.then(function(){
			this.capture('aaaa.png');
		})
	})
	
	
});

casper.then(function multiSelectByKeyboard(){

		this.click('div.gridxRowHeaderRow[rowid="6"] td');

		var focusedEle = this.evaluate(function(){
			return document.activeElement.className;
		});

		this.echo('1st focused ele is: '+focusedEle, 'INFO');
		this.wait(1000);
		//press shift+arrow down twice
		this.then(function firstDwon(){
			this.sendKeys('#grid',this.page.event.key.Down, {modifiers:'shift'});
			//this.page.sendEvent('keypress', this.page.event.key.Down, null, null, 0x02000000);
			this.capture('afterFirstDown.png');
		});

		this.then(function refreshGrid(){
			//this.refreshGrid('grid');

		});

		

		this.wait(1000);

		this.then(function secondDwon(){
			focusedEle = this.evaluate(function(){
				return document.activeElement.className;
			});

			this.echo('2nd focused ele is: '+focusedEle, 'INFO');
			//this.page.sendEvent('keypress', this.page.event.key.Down, null, null, 0x02000000);


			this.sendKeys('#grid',this.page.event.key.Down, {modifiers:'shift'});
			this.capture('afterSecondDown.png');
		});
		
		this.wait(1000);

		this.then(function thirdDown(){
			//this.page.sendEvent('keypress', this.page.event.key.Down, null, null, 0x02000000);
			this.sendKeys('#grid',this.page.event.key.Down, {modifiers:'shift'});

		});
		
		

		this.then(function checkReult(){
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			this.echo(rowStatus);
			this.capture('afterShiftDownPressed.png');

			//test.assertEquals(rowStatus, '2\n3\n4', '25--The 2,3,4 rows should be selected!');

		})

	});

casper.then(function(){
	this.bypass(2);
});

casper.then(function testXPath(){
	
	this.click(x('//table[@class="testboard"]/tbody/tr[2]//button[text()="Select All"]'));
	this.capture('selectAll.png');
});

casper.then(function deselectAll(){
	this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
	this.capture('deselectAll.png');
});



/*casper.then(function shiftClick(){

	this.evaluate(function(selector){
		var ele = document.querySelector(selector), spacePress = document.createEvent("KeyboardEvent");
		spacePress.initKeyboardEvent("keypress",       // typeArg,                                                           
                   true,             // canBubbleArg,                                                        
                   true,             // cancelableArg,                                                       
                   null,             // viewArg,  Specifies UIEvent.view. This value may be null.     
                   false,            // ctrlKeyArg,                                                               
                   false,            // altKeyArg,                                                        
                   false,            // shiftKeyArg,                                                      
                   false,            // metaKeyArg,                                                       
                    32,               // keyCodeArg,                                                      
         32);              // charCodeArg);
		ele.dispatchEvent(spacePress);
	}, 'div.gridxRowHeaderRow[rowid="2"]');
	//this.sendKeys('div.gridxRowHeaderRow[rowid="2"]', '\uE00D');

	this.capture('aaaa.png');
});*/


	
   
  
/*
casper.thenOpen('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});*/

casper.run();