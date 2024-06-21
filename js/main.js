$(document).ready(function () {

	$("#gtininput").on("mousedown", function () {
		$("#gtininput").val('');
	});

	$("#gtininput").on("keydown", function (evt) {
		let key = evt.which;
		if (key < 48 || key > 57) {
			alert('Please enter digits only');
		}
	});

	$("#resolverinput").on("mousedown", function () {
		$("#resolverinput").val('');
	});

	$("#linkset").on("mousedown", function () {
		checkResolverURL();
		checkGTINFormat();
		buildLinksetRequest();
	});

	$("#default").on("mousedown", function () {
		checkResolverURL();
		checkGTINFormat();
		buildDefaultRequest();
	});

	$("#specific").on("mousedown", function () {
		checkResolverURL();
		checkGTINFormat();
		addLinkType();
		addCurlParams();
		buildSpecificRequest();
	});

	$("#clipboard").on("mousedown", function () {
		copyToClipboard();
	});

	$('#clipboardnote').hide();
	$('#gtinhint').hide();
	$('#urlhint').hide();

});

function checkResolverURL() {
	let resolverURL = $("#resolverinput").val();
	if (!resolverURL.startsWith('http') || !resolverURL.endsWith('/')) {
		$('#urlhint').show();
		$('#urlhint').fadeOut(3000);
	}
};

function checkGTINFormat() {
	let GTIN = $("#gtininput").val();
	if (/^\d{14}$/.test(GTIN) == false) {
		$('#gtinhint').show();
		$('#gtinhint').fadeOut(3000);
	};
};

function buildDefaultRequest() {
	let curl = 'curl -L -X GET ' + $("#resolverinput").val() + '01/' + $("#gtininput").val() + revocationParam;
	$("#curl").html(curl);
};

function buildLinksetRequest() {
	let curl = 'curl -L -X GET ' + $("#resolverinput").val() + '01/' + $("#gtininput").val() + '?linkType=linkset -H "Accept: application/linkset+json"' + revocationParam;
	$("#curl").html(curl);
};

function buildSpecificRequest() {
	let curl = 'curl -L -X GET ' + $("#resolverinput").val() + '01/' + $("#gtininput").val() + 
	'?linkType=' + linkType + ' ' + curlParams + revocationParam;
	$("#curl").html(curl);
};

function copyToClipboard(value) {
	let textToCopy = $("#curl").html();
	navigator.clipboard.writeText(textToCopy)
		.then(() => {
			$('#clipboardnote').show().fadeOut(3000);
			$("#buttonText").css({
				'font-size': '1.1vw',
                'position': 'relative',
                'top': '-5px'       
            });
			setTimeout(() => {
                $("#buttonText").css({
                    'font-size': '', 
                    'top': ''        
                });
            }, 3000);

		});
};

let revocationParam = "";
$("#revocation").click(function() {
	if ($(this).is(':checked')) {
		revocationParam = "";
	} else {
		revocationParam += " --ssl-no-revoke";
	}
});

let linkType = "";
function addLinkType() {
	if ($('#linktype').val() != null) {
		linkType = $('#linktype').val();
	} else {
		linkType = 'gs1:defaultLink';
	};
};

let curlParams = "";
function addCurlParams() {
	curlParams = "";
	if ($('#mimetype').val() != null) {
		curlParams += '-H "Accept: ' + $('#mimetype').val() + '"';
	};
	if ($('#language').val() != null) {
		curlParams += ' -H "Accept-language: ' + $('#language').val() + '"';
	};
};

