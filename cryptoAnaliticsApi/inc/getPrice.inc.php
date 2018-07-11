<?php

require('../fonction_api/apiPrice.php');
if ($_GET['function']) {
	$function = $_GET['function'];
	if($_GET['fsym']){
		$fsym = $_GET['fsym'];
	}else{
		$fsym = ["BTC"];
	}

	if($_GET['tsym']){
		$tsym = $_GET['tsym'];
	}else{
		$tsym = ["USD"];
	}
	echo $function($fsym, $tsym , 300);
}