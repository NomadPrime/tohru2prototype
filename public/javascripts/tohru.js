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

var UserInfo = {
	name: '',
	meeting: '',
	key: '',
	modpass: '',
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
		$('#origin').append('<p>WELCOME TO TOHRU</p>');
		$('#origin').append('<p id="nameline"></p>');
		$('#origin').append('<p id="meetingline"></p>');
		$('#origin').append('<p id="buttonline"></p>');
		$('#nameline').append('Name(affil.): ');
		$('#nameline').append('<input type="text" id="namefield" value="'+UserInfo.name+'"></input>');
		$('#meetingline').append('Meeting Name: ');
		$('#meetingline').append('<input type="text" id="meetingfield" value="'+UserInfo.meeting+'"></input>');
		$('#buttonline').append('<button onclick="WelcomeScreen.create();">Create Meeting</button>');
		$('#buttonline').append('<button onclick="WelcomeScreen.join();">Join Meeting</button>');
		$('#buttonline').append('<button onclick="WelcomeScreen.modpass();">Login as Moderator</button>');
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
		$('#origin').append('<p>Please Enter the Moderator Password for "'+UserInfo.meeting+'"');
		$('#origin').append('<p id="passline"></p>');
		$('#passline').append('Password: ');
		$('#passline').append('<input type="password" id="passfield" value=""></input>');
		$('#passline').append(' ');
		$('#passline').append('<button onclick="ModPassScreen.submit()">Login</button>');
		$('#passline').append('<button onclick="ModPassScreen.goback()">Go Back</button>');
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
		$('#origin').append('<p>Create a New Meeting:</p>');
		$('#origin').append('<p id="meetingline"></p>');
		$('#origin').append('<p id="passline"></p>');
		$('#origin').append('<p id="buttonline"></p>');
		$('#meetingline').append('Meeting Name: ');
		$('#meetingline').append('<input type="text" id="meetingfield" value="'+UserInfo.meeting+'"></input>');
		$('#passline').append('Moderator Password: ');
		$('#passline').append('<input type="password" id="passfield" value=""></input>');
		$('#buttonline').append('<button onclick="CreateScreen.create();">Create Meeting</button>');
		$('#buttonline').append('<button onclick="CreateScreen.goback();">Go Back</button>');
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
	load: function()
	{
		$('#origin').empty();
		$('#origin').append('<div id="MOTD"></div>');
		$('#origin').append('<div id="controls"></div>');
		$('#origin').append('<div id="theList"></div>');
		updateLoop = true;
		this.drawControls();
		this.drawList();
	},
	drawControls: function()
	{
		$('#controls').empty();
		$('#controls').append('<p id="commentline"></p>');
		$('#controls').append('<p id="buttonline"></p>');
		$('#controls').append('<p></p>');	//for spacing
		$('#commentline').append('<input id="comment" type="text" size=100 value="Add a comment (optional)" onclick="this.value=\'\'"></input>');
		$('#buttonline').append('<button onclick="drawControls.raise(\'S\');">Same Topic</button>');
		$('#buttonline').append('<button onclick="drawControls.raise(\'N\');">New Topic</button>');
		$('#buttonline').append('<button onclick="drawControls.raise(\'A\');">Answer to Question</button>');
		$('#buttonline').append('<button onclick="drawControls.raise(\'P\');">Propose Resolution</button>');
		if(UserInfo.hand.raised)	//change to check if hand is currently raised
		{
			$('#buttonline').append('      ');
			$('#buttonline').append('<button onclick="drawControls.down();">Lower Hand</button>');
		}
	},
	drawList: function()
	{
		//
	},
	raise: function(raisetype)
	{
		UserInfo.hand.type = raisetype;
		if($('#comment').val() != 'Add a comment (optional)') UserInfo.hand.comment = $('#comment').val();
		$.get('/list/raise', UserInfo);
		UserInfo.hand.raised = true;
		this.drawControls();
	},
	down: function()
	{
		UserInfo.hand.type = '';
		UserInfo.hand.raised = false;
		UserInfo.hand.comment = '';
		$.get('/list/lower', UserInfo);
		this.drawControls();
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
