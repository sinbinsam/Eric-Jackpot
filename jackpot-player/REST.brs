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

	's.player = CreateObject("roAudioPlayer")
	's.player.MapStereoOutput(0)

	s.player = CreateObject("ROAUDIOPLAYERMX")
	s.player.SetAudioOutput(0)
	
	'Zone Msg
	s.zoneMsgSend 		= 	zoneMsgSend


	
	'HTTP Server
	s.newREST		=	createobject("roHttpServer", {port : 9000})
	s.newRest.SetPort(msgPort)
	s.newREST.AddGetFromEvent({	
		url_path 	: 	"/rest/control"
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
				if event.GetRequestParam("cmd") <> "" then
					m.zoneMsgSend(event.GetRequestParam("cmd"))
					event.SetResponseBodyString("CMD_Received: "+event.GetRequestParam("cmd"))
					event.SendResponse(200)
					retval = true
				else
					? "There is no parameter"
					event.SetResponseBodyString("Invalid pararmeter. Try cmd=command")
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
Function zoneMsgSend(cmd$ As String)


arr = [
	{
		filename: "/jackpot_audio/1000jackpotmomentsago.wav",
		QueueNext: 1,
		ident: "1000jackpotmomentsago"
	},
	{
		filename: "/jackpot_audio/1000jackpotwaytogo.wav",
		QueueNext: 1,
		ident: "1000jackpotwaytogo"
	},
	{
		filename: "/jackpot_audio/1000Trigger.wav",
		QueueNext: 1,
		ident: "1000Trigger"
	},
	{
		filename: "/jackpot_audio/1000Trigger2.wav",
		QueueNext: 1,
		ident: "1000Trigger2"
	},
	{
		filename: "/jackpot_audio/GenericTrigger.wav",
		QueueNext: 1,
		ident: "GenericTrigger"
	},
	{
		filename: "/jackpot_audio/jackpotmaybenextgeneric.wav",
		QueueNext: 1,
		ident: "jackpotmaybenextgeneric"
	},
	{
		filename: "/jackpot_audio/prettyawesomejackpotgeneric.wav",
		QueueNext: 1,
		ident: "prettyawesomejackpotgeneric"
	},
	{
		filename: "/jackpot_audio/somebodywon1000jackpotgeneric.wav",
		QueueNext: 1,
		ident: "somebodywon1000jackpotgeneric"
	},
]

for each n in arr
	if cmd$ = n.ident
		'Playing = m.player.GetPlaybackStatus()
		'	if Playing.Playing = false
				m.player.PlayFile(n)
		'	end if
	end if
 End For

	'm.player.PlayFile("/music.wav")
End Function