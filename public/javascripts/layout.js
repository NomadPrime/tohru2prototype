var PageLayout = {
	WelcomeScreen: '<p>WELCOME TO TOHRU</p><p>Name(affil.): <input type="text" id="namefield" value="UserInfo.name"></input></p><p>Meeting Name:<input type="text" id="meetingfield" value="UserInfo.meeting"></input></p><p><button onclick="WelcomeScreen.create();">Create Meeting</button><button onclick="WelcomeScreen.join();">Join Meeting</button><button onclick="WelcomeScreen.modpass();">Login as Moderator</button></p>',
	ModPassScreen: '<p>Please Enter the Moderator Password for "<span id="MEETINGNAME">[MEETING NAME]</span>"</p><p>Password:<input type="password" id="passfield" value=""> <button onclick="ModPassScreen.submit()">Login</button><button onclick="ModPassScreen.goback()">Go Back</button></p>',
	CreateScreen: '<p>Create a New Meeting:</p><p id="meetingline">Meeting Name:<input type="text" id="meetingfield" value="UserInfo.meeting"></p><p id="passline">Moderator Password:<input type="password" id="passfield" value=""></p><p id="buttonline"><button onclick="CreateScreen.create();">Create Meeting</button><button onclick="CreateScreen.goback();">Go Back</button></p>',
	MainScreen: '',
	genListing: function(uid, name, ID, type, comment, isMine, isMod)
	{
		var reply = '<p id='+uid+'>';
		if(isMod) reply += '<img src="./images/Delete_Icon.png" height=20 onclick="ModFunctions.forceDown('+name+', '+ID+')">';
		reply += '<img src="./images/'+type+'_Icon.png" height=20>';
		if(isMod) reply += '<img src="./images/Totop_Icon.png" height=20 onclick="ModFunctions.toTop('+name+', '+ID+')">';
		if(isMine) reply += '<span style="color: blue">';
		reply += '<span style="font-weight: bold">';
		reply += name;
		reply += '</span>';
		reply += '  ';
		if(comment != '') reply += '['+comment+']';
		if(isMine) reply += '</span>';
		reply += '</p>';
		return reply;
	}
};
