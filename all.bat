@echo on
For /R ./ %%I IN (*.js) DO (
	IF "%%~nxI" == "common.js" (
		echo skip %%~nxI !!!
	) ELSE (
		IF "%%~nxI" == "foo.js" (
			echo skip %%~nxI !!!
		) ELSE (
			IF "%%~nxI" == "template.js" (
				echo skip %%~nxI !!!
			) ELSE (
				casperjs test "%%~nxI" --xunit=reports/"%%~nI".xml

				rem wait for 1 second
				ping 192.0.2.2 -n 1 -w 1000 > nul
			)
		)
	)	
	
)	