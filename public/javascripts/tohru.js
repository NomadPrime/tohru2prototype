//Unique ID generator for JQuery HTML objects (for dynamic lists)
var IDGen = {
	UIDCounter: 0,	//global counter for ID assignment
	//creates a new ID string
	newID: function()
	{
		if(this.UIDCounter == Number.MAX_INTEGER)	//just in case :P
		{
			this.UIDCounter = 0;
		}
		var thisID = this.UIDCounter.toString(36);
		this.UIDCounter++;
		return 'uid'+thisID;
	},
	//creates and returns a new ID string tying it to obj as well
	genID: function(obj)
	{
		var id = this.newID();
		obj.ID = id;
		return id;
	}
};

var updateLoop = false;
var currentMOTD = '';

var UserInfo = {
	name: '',
	ID: Math.floor((Math.random()*1000000)+1),
	meeting: '',
	key: '',
	modpass: '',	//TODO: secure this somehow? Or clear it? (yknow, for get requests)
	isMod: false,
	hand: {
		raised: false,
		type: '',
		comment: ''
	}
};

var WelcomeScreen = {
	load: function()
	{
		$('#origin').empty();
		$('#origin').append(PageLayout.WelcomeScreen);
		$('#namefield').val(UserInfo.name);
		$('#meetingfield').val(UserInfo.meeting);
	},
	create: function()
	{
		UserInfo.name = $('#namefield').val();
		UserInfo.meeting = $('#meetingfield').val();
		CreateScreen.load();
	},
	join: function()
	{
		UserInfo.name = $('#namefield').val();
		UserInfo.meeting = $('#meetingfield').val();
		if($('#namefield').val() == '')
		{
			alert('Please input your name');
			WelcomeScreen.load();
		}
		else if($('#meetingfield').val() == '')
		{
			alert('Please input a meeting name');
			WelcomeScreen.load();
		}
		else
		{
			$.post('/list/register', UserInfo, function(data)
			{
				if(parseInt(data.key) < 0)
				{
					alert('No record found of meeting "'+UserInfo.meeting+'"');
					WelcomeScreen.load();
				}
				else
				{
					UserInfo.key = data.key;
					MainScreen.load();
				}
			});
		}
	},
	modpass: function()
	{
		UserInfo.name = $('#namefield').val();
		UserInfo.meeting = $('#meetingfield').val();
		if($('#namefield').val() == '')
		{
			alert('Please input your name');
			WelcomeScreen.load();
		}
		else if($('#meetingfield').val() == '')
		{
			alert('Please input a meeting name');
			WelcomeScreen.load();
		}
		else
		{
			$.post('/list/meetexists', UserInfo, function(data)
			{
				if(data.exists)
				{
					ModPassScreen.load();
				}
				else
				{
					alert('No record found of meeting "'+UserInfo.meeting+'"');
					WelcomeScreen.load();
				}
			});
		}
	}
};

var ModPassScreen = {
	load: function()
	{
		$('#origin').empty();
		$('#origin').append(PageLayout.ModPassScreen);
		$('#MEETINGNAME').replaceWith(UserInfo.meeting);
	},
	submit: function()
	{
		UserInfo.modpass = $('#passfield').val();
		$.post('/list/registermod', UserInfo, function(data)
		{
			if(parseInt(data.key) < 0)
			{
				alert('Invalid password');
				ModPassScreen.load();
			}
			else
			{
				UserInfo.key = data.key;
				UserInfo.isMod = true;
				UserInfo.name = UserInfo.name + ' (Moderator)';
				MainScreen.load();
			}
		});
	},
	goback: function()
	{
		WelcomeScreen.load();
	}
};

var CreateScreen = {
	load: function()
	{
		$('#origin').empty();
		$('#origin').append(PageLayout.CreateScreen);
		$('#meetingfield').val(UserInfo.meeting);
	},
	create: function()
	{
		UserInfo.meeting = $('#meetingfield').val();
		UserInfo.modpass = $('#passfield').val();
		if($('#meetingfield').val() == '')
		{
			alert('Please input a meeting name');
			CreateScreen.load();
		}
		else if($('#passfield').val() == '')
		{
			alert('Please input a moderator password');
			CreateScreen.load();
		}
		else
		{
			$.post('/list/createnew', UserInfo, function(data)
			{
				if(data.nameTaken)
				{
					alert('Record for meeting "'+UserInfo.meeting+'" already exists');
					CreateScreen.load();
				}
				else
				{
					alert('Meeting "'+UserInfo.meeting+'" registered');
					WelcomeScreen.load();
				}
			});
		}
	},
	goback: function()
	{
		UserInfo.meeting = $('#meetingfield').val();
		WelcomeScreen.load();
	}
};

var MainScreen = {
	lastRev: '',
	load: function()
	{
		this.lastRev = '';
		$('#origin').empty();
		//$('#origin').append('<div id="title"></div>');
		//$('#origin').append('<div id="controls"></div>');
		//$('#origin').append('<div id="theList"></div>');
		//$('#title').append('<table><tr><td><img src="images/TOHRU_Hand.png"></img></td><td><p>Trace Online Hand Raising Utility</p><p id="MOTD"></p></td></tr></table>');
		/*
		$('#title').append('<img src="images/TOHRU_Hand.png" style="float:left"></img>');
		$('#title').append('<p style="float:left">Trace Online Hand Raising Utility</p>');
		$('#title').append('<div id="MOTD"></div>');
		*/
		$('#origin').append(PageLayout.MainScreen);
		updateLoop = true;
		$.get('/list/fetch', UserInfo, function(data)	//set initial display data
		{
			if(data.key != '')
			{
				currentMOTD = data.MOTD;
			}
		});
		this.drawControls();
		this.drawList();
	},
	drawControls: function()
	{
		/*
		var comval;
		$('#controls').empty();
		$('#controls').append('<p id="commentline"></p>');
		$('#controls').append('<p id="buttonline"></p>');
		$('#controls').append('<p></p>');	//for spacing
		if(UserInfo.hand.comment == '') comval = 'value="Add a comment (optional)" onclick="this.value=\'\'"';
		else comval = 'value = "'+UserInfo.hand.comment+'"';
		$('#commentline').append('<input id="comment" type="text" size=100 '+comval+'></input>');
		$('#buttonline').append('<button onclick="MainScreen.raise(\'S\');"><img src="./images/S_Icon.png" height=20>ame Topic</button>');
		$('#buttonline').append('<button onclick="MainScreen.raise(\'N\');"><img src="./images/N_Icon.png" height=20>ew Topic</button>');
		$('#buttonline').append('<button onclick="MainScreen.raise(\'A\');"><img src="./images/A_Icon.png" height=20>nswer to Question</button>');
		$('#buttonline').append('<button onclick="MainScreen.raise(\'P\');"><img src="./images/P_Icon.png" height=20>ropose Resolution</button>');
		if(UserInfo.hand.raised)	//change to check if hand is currently raised
		{
			$('#buttonline').append('      ');
			$('#buttonline').append('<button onclick="MainScreen.down();">Lower Hand</button>');
		}
		if(UserInfo.isMod)
		{
			$('#controls').append('<p id="advbuttonline"></p>');
			$('#controls').append('<p id="insertline"></p>');
			$('#advbuttonline').append('<button onclick="ModFunctions.advance()">ADVANCE QUEUE</button>');
			$('#insertline').append('<input id="suggestionbox" type="text" value="Add name to queue" onclick="this.value=\'\'"></input>');
			$('#insertline').append('  ');
			$('#insertline').append('<button onclick="ModFunctions.suggest()">Add</button>');
		}
		*/
		if(UserInfo.isMod)
		{
			$('#MOTD').empty();
			$('#MOTD').append('<input id="MOTDbox" type="text" value="'+currentMOTD+'"><button onclick="ModFunctions.setMOTD()">Set Message</button>');
		}
		$('#controls').empty();
		$('#modcontrols').empty();
		$('#controls').append(PageLayout.controls.main);
		if(UserInfo.hand.raised) $('#controls').append(PageLayout.controls.down);
		if(UserInfo.isMod)
		{
			$('#controls').append(PageLayout.controls.suggest);
			$('#modcontrols').append(PageLayout.controls.modbox);
		}
		
	},
	drawList: function()
	{
		$.get('/list/fetch', UserInfo, function(data)
		{
			if(data.key != '' && data._rev != MainScreen.lastRev)
			{
				currentMOTD = data.MOTD;
				
				MainScreen.lastRev = data._rev;
				if(!UserInfo.isMod)
				{
					$('#MOTD').empty();
					$('#MOTD').append(data.MOTD);
				}
				//$('#MOTD').empty();
				//$('#MOTD').append('<p>'+data.MOTD+'</p>');
				$('#speaker').empty();
				$('#speaker').append(data.hands[0].name);
				if(data.hands[0].comment != '') $('#speaker').append(' ['+data.hands[0].comment+']');
				$('#theList').empty();
				//var firstformat = ' style="color: #ff3333; font-size: 25px"';
				//var firsttext = 'Current Speaker: ';
				//var uid;
				var first = true;
				data.hands.forEach(function(hand)
				{
					if(first) first = false;
					else
					{
						$('#theList').append(PageLayout.genListing(IDGen.newID(), hand.name, hand.ID, hand.type, hand.comment, (hand.name==UserInfo.name&&hand.ID==UserInfo.ID), UserInfo.isMod));
					}
					/*
					uid = IDGen.newID();
					$('#theList').append('<p id="'+uid+'"'+firstformat+'></p>');
					if(hand.type == 'S') $('#'+uid).append('<img src="images/S_Icon.png" height="25" width="25"></img>');
					else if(hand.type == 'N') $('#'+uid).append('<img src="images/N_Icon.png" height="25" width="25"></img>');
					else if(hand.type == 'A') $('#'+uid).append('<img src="images/A_Icon.png" height="25" width="25"></img>');
					else if(hand.type == 'P') $('#'+uid).append('<img src="images/P_Icon.png" height="25" width="25"></img>');
					else $('#'+uid).append('['+hand.type+']');
					$('#'+uid).append('  ');
					if(UserInfo.isMod)
					{
						$('#'+uid).append('<img src="images/Delete_Icon.png" onclick="ModFunctions.forceDown(\''+hand.name+'\',\''+hand.ID+'\');"></img>');
						$('#'+uid).append('<img src="images/Totop_Icon.png" onclick="ModFunctions.toTop(\''+hand.name+'\',\''+hand.ID+'\');"></img>');
						$('#'+uid).append('  ');
					}
					$('#'+uid).append(firsttext+hand.name);
					if(hand.comment != '')
					{
						$('#'+uid).append('  Comment:');
						$('#'+uid).append(hand.comment);
					}
					
					firstformat = '';
					firsttext = '';
					*/
				});
			}
		});
	},
	raise: function(raisetype)
	{
		UserInfo.hand.type = raisetype;
		if($('#comment').val() != '(optional) reminder/hint about what you are going to say') UserInfo.hand.comment = $('#comment').val();
		$.post('/list/raise', UserInfo);
		UserInfo.hand.raised = true;
		this.drawControls();
	},
	down: function()
	{
		UserInfo.hand.type = '';
		UserInfo.hand.raised = false;
		UserInfo.hand.comment = '';
		$.post('/list/lower', UserInfo);
		this.drawControls();
	},
	userList: function()
	{
		updateLoop = false;
		UserList.load();
	}
};

var UserList = {
	load: function() {
		$('#origin').empty();
		$('#origin').append('<p><button onclick="MainScreen.load();">Go Back</button></p>');
		$('#origin').append('<p>FULL MEETING ATTENDANCE:</p>');
		$.get('/list/fetch', UserInfo, function(data)
		{
			data.users.forEach(function(user)
			{
				$('#origin').append('<p>'+user.name+'</p>');
			});
		});
	}
};

var ModFunctions = {	//Holds all the shiny things mods can do
	forceDown: function(uname, uID)	//forces someone to put their hand down
	{
		var composite = {
			name: uname,
			ID: uID,
			meeting: UserInfo.meeting,
			key: UserInfo.key,
			modpass: '',
			isMod: false,
			hand: {	
				raised: true,
				type: '',
				comment: ''
			}
		};
		$.post('/list/lower', composite);
	},
	toTop: function(uname, uID)	//forces someone to put their hand down
	{
		var composite = {
			name: uname,
			ID: uID,
			meeting: UserInfo.meeting,
			key: UserInfo.key,
			modpass: '',
			isMod: false,
			hand: {	
				raised: true,
				type: '',
				comment: ''
			}
		};
		$.post('/list/totop', composite);
	},
	suggest: function()
	{
		var composite = {
			name: $('#suggestionbox').val(),
			ID: Math.floor((Math.random()*100000)+1),
			meeting: UserInfo.meeting,
			key: UserInfo.key,
			modpass: '',
			isMod: false,
			hand: {	
				raised: true,
				type: '+',
				comment: ''
			}
		};
		$.post('/list/raise', composite);
	},
	advance: function()
	{
		$.post('/list/advance', UserInfo);
	},
	modnext: function()
	{
		$.post('/list/modnext', UserInfo);
	},
	setMOTD: function()
	{
		var composite = {
			name: UserInfo.name,
			ID: UserInfo.ID,
			meeting: UserInfo.meeting,
			key: UserInfo.key,
			modpass: '',
			isMod: true,
			hand: {
				raised: false,
				type: '!',
				comment: $('#MOTDbox').val()
			}
		};
		$.post('/list/changeMOTD', composite);
	}
};


$(document).ready(function()
{
	WelcomeScreen.load();
	setInterval(function()
	{
		if(updateLoop)
		{
			MainScreen.drawList();
		}
	}, 1000);	//frame delay in milliseconds
});
