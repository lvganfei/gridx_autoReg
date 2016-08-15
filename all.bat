echo on
For /R ./ %%I IN (*.js) DO (
	IF "%%~nxI" == "common.js" (
		echo skip
	) ELSE (
	 	casperjs test "%%~nxI" --xunit=reports/"%%~nI".xml
	)
	
	
)	