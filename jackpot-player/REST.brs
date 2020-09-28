Function REST_Initialize(msgPort As Object, userVariables As Object, bsp as Object)

    REST = newREST(msgPort, userVariables, bsp)
    return REST

End Function


Function newREST(msgPort As Object, userVariables As Object, bsp as Object)

	' Create the object to return and set it up
	s 			= 	{}
	s.version 		= 	0.4
	s.msgPort 		= 	msgPort
	s.userVariables 	= 	userVariables
	s.bsp 			= 	bsp
	s.ProcessEvent 		= 	REST_ProcessEvent

	s.player = CreateObject("roAudioPlayer")
	s.player.MapStereoOutput(0)

	s.player = CreateObject("ROAUDIOPLAYERMX")
	s.player.SetAudioOutput(0)
	
	'Zone Msg
	s.zoneMsgSend 		= 	zoneMsgSend


	
	'HTTP Server
	s.newREST		=	createobject("roHttpServer", {port : 9000})
	s.newRest.SetPort(msgPort)
	s.newREST.AddGetFromEvent({	
		url_path 	: 	"/audio/play"
		user_data	:	"restControl"	
	})
		
	'Object Name
	s.objectName 		= 	"REST_object"
	
	return s

End Function

REM Event Process Region

Function REST_ProcessEvent(event As Object) as boolean

	retval = false
	
	? "Incoming event type is: " type(event)

	if type(event) = "roAssociativeArray" then
		? event
		if type(event["EventType"]) = "roString"
			? "RSCook: " event["EventType"]
			 if (event["EventType"] = "SEND_PLUGIN_MESSAGE") then
				if event["PluginName"] = "REST" then
					pluginMessage$ = event["PluginMessage"]
					? "SEND_PLUGIN/EVENT_MESSAGE:";pluginMessage$
					retval = ParsenetCommPluginMsg(pluginMessage$, m)
				endif
			endif
		endif			
	elseif type(event) = "roHttpEvent" then	
		'Protect against LFN type settings		
		if type(event.GetUserData()) = "roString" then			
			if event.GetUserData() = "restControl" then
				if event.GetRequestParam("fileName") <> "" then
					m.zoneMsgSend(event.GetRequestParam("fileName"))
					event.SetResponseBodyString("fileName_Received: "+event.GetRequestParam("fileName"))
					event.SendResponse(200)
					retval = true
				else
					? "There is no parameter"
					event.SetResponseBodyString("Invalid parameters")
					event.SendResponse(200)
					? "Don't pass this to another plugin"
					retval = true
				endif
			endif		
		endif			
	endif
	return retval	
	
End Function

REM Plugin Msg Parser - Not currently used but added here if needed at a later date
Function ParseRESTPluginMsg(origMsg as string, s as object) as boolean
	
	retval = false			
	return retval
	
End Function

REM Send a zone message to Presentation.
Function zoneMsgSend(fileName$ As String)



audio = {
    filename: "/jackpot_audio/"+fileName$+".wav",
    QueueNext: 1,
 }

m.player.PlayFile(audio)


	'm.player.PlayFile("/music.wav")
End Function