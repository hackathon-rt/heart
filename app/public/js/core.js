$( document ).ready(function() {
    $.get('/getdata', {act:'getlogin'}, function(data) {
		data=JSON.parse(data);
		if(data.ans){
			$('#logon_forms').css('display','none');
			$('#content').html('Добрый день, '+data.username);			
		};
	});	
});

function register_user(){
	$.post("/register", {username:$('#r_username').val(), password: $('#r_password').val()},function(data){
		data=JSON.parse(data);
		if(data.ans){
			$('#r_username').val('');
			$('#r_password').val('');
			$('#a_status').html('Пользователь успешно зарегистрирован, можете авторизоваться');
		}else{
			$('#a_status').html('Ошибка, пользователь с таким именем уже существует');
		};
	});	
};

function auth_local(){
	$.post("/auth", {username:$('#l_username').val(), password: $('#l_password').val()},function(data){
		data=JSON.parse(data);
		if(data.ans){
			$('#logon_forms').css('display','none');
			$('#content').html('Добрый день, '+data.username);
		};
	});
};

function getusers(){
	$.get('/getdata', {act:'getusers'}, function(data) {
		$('#content').html(data);
	});	
};

function getusers(){
	$.get('/getdata', {act:'getcontacts'}, function(data) {
		$('#content').html(data);
	});	
};

function getfullusers(){
	$.get('/getdata', {act:'getfullusers'}, function(data) {
		$('#content').html(data);
	});	
};

function getpartners(){
	$.get('/getdata', {act:'getpartners'}, function(data) {
		$('#content').html(data);
	});	
};