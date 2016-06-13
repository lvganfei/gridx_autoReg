var option ={
	verbose: true, 
	logLevel:'debug',
	viewportSize: {width:800, height:600}
};

var casper = require('casper').create(option);

casper.start('http://idx.ibm.com/dojo_1.10.4/gridx/tests/test_grid.html');

capser.then(function(){
	this.echo(this.exists('td.gridxCell '));
});

capser.run();