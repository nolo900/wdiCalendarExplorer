console.log('JS file connected...');

$( document ).ready(function(){
	$(".button-collapse").sideNav();

	$("#signupForm").validate({
		rules:  {

			signup_email:  {
				required: true,
				email: true
			},
			signup_password: {
				required: true
			},
			signup_password2:{
				required: true,
				equalTo: "#signup_password"
			}
		},
		errorElement : 'div',
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		}

	});

	$("#loginForm").validate({
		rules:  {

			login_email:  {
				required: true,
				email: true
			},
			login_password: {
				required: true
			}
		},
		errorElement : 'div',
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		}

	});

})

$("#searchField").on('keyup click input', function () {
	$("tr").show();
	if (this.value.length > 0){
		$("tr").not(function(){
			return $(this).text().toLowerCase().indexOf($("#searchField").val().toLowerCase()) != -1;
		}).hide();
	}
});