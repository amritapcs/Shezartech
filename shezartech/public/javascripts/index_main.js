$(document).ready(function(){

	$('.open_close').hide();

	$('.template_id').on('change', function () {
		console.log("ttttttt");
		console.log($(this).val());
		var tmp_id = $(this).val();
		$.ajax({
			method : 'get',
			url : 'form_contact',
			data : {tmp_id:tmp_id},
			success: function(result){
		        console.log(result)
		        $('.text_content').val(result)
		    }
		});
	});

	$('.templates_scheduling').on('change', function () {
		var tmp_id = $(this).val();
		$.ajax({
			method : 'get',
			url : 'form_contact',
			data : {tmp_id:tmp_id},
			success: function(result){
				console.log("ioioio")
		        console.log(result)
		        $('.templates_scheduling_content').val(result)
		    }
		});
	});

	$('#broadcast_form').on('submit', function () {
		var form = $(this);
		var status = formValidate(form);
		console.log("ikikik")
		if(status) {
			var data = $(this).serializeArray();
			console.log(data)
			$.ajax({
				method : 'post',
				url : 'form_contact',
				data : data,
				success: function(result){
					console.log("klkklk")
			        console.log(result)
			        $('.success_div').text(result)
			    }
			});
		}
		return false;
	});

	$('.select_message_days').on('click', function () {
		console.log($(this).val())
		if($(this). prop("checked") == true){
			$('.open_close').show();
		}
		else {
			$('.open_close').hide();
		}
	});

	$('#Scheduling_form').on('submit', function () {
		var form = $(this);
		var status = formValidate(form);
		var data = $(this).serializeArray();
		console.log("bbbbbbbbbbbbbb");
		//console.log(data);
		if(status) {
			var data = $(this).serializeArray();
			console.log(data)
			var obj = [];
			$.each(data, function (key, extra_data) {

			});
			$.ajax({
				method : 'post',
				url : 'scheduling',
				data : data,
				success: function(result){
					console.log("klkklk")
			        console.log(result)
			        $('.success_div').text(result)
			    }
			});
		}
		return false;
	});

	function formValidate(form) {
		console.log("form")
		var inputs = form.find('input[type=text][rule=required]:enabled,input[type=number]:enabled, select:enabled , textarea[rule=required]');
		var status = true;

		$.each(inputs, function(i,v){
		
			var input = $(inputs[i])
			console.log(input.val())
			
			if( $(inputs[i]).val() == null || $(inputs[i]).val().trim() == ''){
				//if($())
				$(input).addClass('validation_error');
				$(input).next('.error-fade').text("");
				$(input).after('<span class="error-fade text-danger">Oops ! this field is required</span>');
				$('.error-fade').delay(3000).fadeOut(400);
				
				// !!! And remove the span from html code when fadeOut finished
				status = false;
			}

		});
		console.log(status)
		return status;

	}

});