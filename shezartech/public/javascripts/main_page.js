$(document).ready(function(){
    
	$('.export_database_button').on('click', function () {
		$.ajax({
			method : 'get',
			url : '/form_contact',
			success: function(result){
		        console.log(result)
		    }
		});
	});

});