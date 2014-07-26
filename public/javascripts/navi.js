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

var UserInfo = {
	name: '',
	meeting: ''
};

var WelcomeScreen = {
	name: '',
	nameErr: false,
	meeting: '',
	meetErr: false,
	load: function()
	{
		$('#origin').empty();
		$('#origin').append('<p>WELCOME TO TOHRU NAVIGATION TEST</p>');
		$('#origin').append('<p id="nameline"></p>');
		$('#origin').append('<p id="meetingline"></p>');
		$('#origin').append('<p id="buttonline"></p>');
		$('#nameline').append('Name: ');
		$('#nameline').append('<input type="text" id="namefield" value="'+this.name+'"></input>');
		if(this.nameErr) $('#nameline').append('<span style="color:#ff0000"> PLEASE INPUT A NAME</span>');
		$('#meetingline').append('Meeting Name: ');
		$('#meetingline').append('<input type="text" id="meetingfield" value="'+this.meeting+'"></input>');
		if(this.meetErr) $('#meetingline').append('<span style="color:#ff0000"> PLEASE INPUT A MEETING NAME</span>');
		$('#buttonline').append('<button onclick="WelcomeScreen.join();">Join Meeting</button>');
		$('#buttonline').append('<button onclick="WelcomeScreen.modpass();">Login as Moderator</button>');
	},
	join: function()
	{
		this.name = $('#namefield').val();
		this.nameErr = (this.name == '');
		this.meeting = $('#meetingfield').val();
		this.meetErr = (this.meeting == '');
		if(this.nameErr || this.meetErr) this.load();
		else
		{
			//CHECK IF MEETING EXISTS
			//LOAD THE MAIN APP PAGE
		}
	},
	modpass: function()
	{
		this.name = $('#namefield').val();
		this.nameErr = (this.name == '');
		this.meeting = $('#meetingfield').val();
		this.meetErr = (this.meeting == '');
		if(this.nameErr || this.meetErr) this.load();
		else
		{
			//CHECK IF MEETING EXISTS
			//LOAD MODPASS SCREEN
		}
	}
};

var ModPassScreen = {
	
};


$(document).ready(function()
{
	WelcomeScreen.load();
});
