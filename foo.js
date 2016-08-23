
var cases = require('./common').cases;
var config = require('./common').config;
config.verbose = true;
var casper = require('casper').create(config);
var utils = require('utils');
var x = require('casper').selectXPath;
var screenshotFolder = 'screenshot/foo/';
//var mouse = require('mouse').create(casper);


casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
	this.echo('refresh completed!','INFO');
};

var gridLoadCheck = function(){
		this.waitFor(function check(){
			return this.exists('div.gridxRow[rowid="0"]');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture(screenshotFolder+'fail.png');
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

casper.start(cases.testPagePrefix+'test_grid_dndrow_betweengrids.html', gridLoadCheck);
    
casper.then(function setup(){
	this.evaluate(function addEventListener(){
		document.body.addEventListener('keydown', function(e){
			console.log('the key of event is: '+e.keyIdentifier+' keyCode is: '+e.which||e.keyCode);
			console.log('target is: '+e.target.tagName+'.('+e.target.className+')');
			console.log('active element is: '+document.activeElement.tagName+'.('+document.activeElement.className+')');
		});
		dijit.byId('grid1').onRowHeaderCellKeyDown= function(e){console.log(e.which||e.keyCode||e.key||e.charCode); console.log('now in grid rowheader: '+document.activeElement.tagName+'.('+document.activeElement.className+')')}
	});
});

casper.then(function drag1to2(){

	//click name cell in row#1
	this.wait(500, function click(){

		this.click('#grid1 div.gridxRow[rowid="0"] td[colid="Name"]');
		this.capture(screenshotFolder+'afterClick.png');
	});


	this.then(function dragToGrid2(){

	/*	this.then(function eval(){
			this.evaluate(function ctrlClikRow(startSelector, destSelector){
				var startEle = document.querySelector(startSelector), destEle = document.querySelector(destSelector);

				// create event in old ugly way
				var mouseDownEvt = document.createEvent('MouseEvents'), mouseMoveEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

				//mouse down on the start element
				mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
				startEle.dispatchEvent(mouseDownEvt);

				//mouseover to the destination element
				mouseMoveEvt.initMouseEvent('mousemove', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				destEle.dispatchEvent(mouseMoveEvt);

				//mouse up on the destination element
				mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, false, false, false, false, 0, null);
				destEle.dispatchEvent(mouseUpEvt);		


			}, '#grid1 div.gridxRow[rowid="1"] td[colid="Year"]', '#grid2 div.dojoDndTarget');
		});*/
		var targetPostion = this.getElementBounds('#grid2 div.dojoDndTarget');
		utils.dump(targetPostion);
		//hover on the selected row
		//this.mouseEvent('mouseover', '#grid1 div.gridxRow[rowid="1"] td[colid="Year"]');
		//mouse down
		this.mouse.down('#grid1 div.gridxRow[rowid="0"]');
		//this.mouse.move('#grid1 div.gridxRow[rowid="4"] td[colid="Name"]');
		//mouse move
		this.mouse.move(857, 350);
		//this.mouse.move(targetPostion.left+targetPostion.width/2, targetPostion.top+targetPostion.height/2);
		//mouse up
		this.capture(screenshotFolder+'debug.png');
		this.mouse.up(857, 350);
		
		//this.mouse.up('#grid1 div.gridxRow[rowid="4"] td[colid="Name"]');
		//this.mouse.up(targetPostion.left+targetPostion.width/2, targetPostion.top+targetPostion.height/2);
	});

	this.then(function checkResult2(){
		this.capture(screenshotFolder+'afterDragToGrid2.png');
	});

});


casper.then(function(){
	this.bypass(9);
});

casper.then(function shiftClick(){
	this.click('div.gridxRowHeaderRow[rowid="2"] td');
	this.then(function(){
		this.evaluate(function(selector){
			var ele = document.querySelector(selector), spacePress = document.createEvent("KeyboardEvent");
			spacePress.initKeyboardEvent("keypress", // typeAr                                                       
	                   true,             // canBubbleArg,                                                        
	                   true,             // cancelableArg,                                                       
	                   null,             // viewArg,  Specifies UIEvent.view. This value may be null.     
	                   false,            //ctrlKeyArg,                                                               
	                   false,            // altKeyArg,                                                        
	                   true,            // shiftKeyArg,                                                      
	                   false,            // metaKeyArg,                                                       
	                    40,               // keyCodeArg,                                                      
	         40);              // charCodeArg);
			ele.dispatchEvent(spacePress);
		}, '#grid');
	});

	//this.sendKeys('div.gridxRowHeaderRow[rowid="2"]', '\uE00D');

	this.capture('aaaa.png');
});


casper.then(function openTriggerOnCell(){

	this.evaluate(function(){
		grid.select.row.triggerOnCell = true;
	});

	this.then(function singleSelect(){
		this.click('div.gridxRow[rowid="3"] td[colid="Genre"]');
	})

});

 //holding CTRL, swipe multiple rows
casper.then(function multiSelectbyCtrlSwipe(){
		this.evaluate(function ctrlClikRow(startSelector, destSelector){
			var startEle = document.querySelector(startSelector), destEle = document.querySelector(destSelector);

			// create event in old ugly way
			var mouseDownEvt = document.createEvent('MouseEvents'), mouseMoveEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

			//mouse down on the start element
			mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
			startEle.dispatchEvent(mouseDownEvt);

			//mouseover to the destination element
			mouseMoveEvt.initMouseEvent('mouseover', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			destEle.dispatchEvent(mouseMoveEvt);

			//mouse up on the destination element
			mouseUpEvt.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
			destEle.dispatchEvent(mouseUpEvt);		


		}, 'div.gridxRow[rowid="5"] td[colid="Genre"]', 'div.gridxRow[rowid="8"] td[colid="Genre"]');

		this.then(function checkReult(){
			this.capture('afterCtrlSwipe.png');
		})
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
		});


		
		

		this.then(function checkReult(){
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			this.echo(rowStatus, 'INFO');
			this.capture('afterShiftDownPressed.png');

			var selected = this.getElementInfo('#rowStatus');
			utils.dump(selected);
			//test.assertEquals(rowStatus, '2\n3\n4', '25--The 2,3,4 rows should be selected!');

		})

	});






casper.then(function singleSelectOnCell(){
	this.click('div.gridxRow[rowid="5"] td[colid="Genre"]');
	this.capture('afterclickCell.png');
});

casper.then(function multiSelectOnCell(){

	//swipe select 5-8 row
	this.mouse.down('div.gridxRow[rowid="5"] td[colid="Genre"]');
	this.mouse.move('div.gridxRow[rowid="8"] td[colid="Genre"]');
	this.mouse.up('div.gridxRow[rowid="8"] td[colid="Genre"]');

	this.then(function checkReult(){
		
		this.capture('afterSwipeOnCell.png');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});

		this.echo(rowStatus, 'INFO');
		//test.assertEquals(rowStatus, '5\n6\n7\n8', '27--The row#5-8 should be selected by swiping the cell!');
	})

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