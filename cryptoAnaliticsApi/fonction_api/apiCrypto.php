<?php
require_once("../core/bdd.php");
if(isset($_GET["getCurrencies"]) && $_GET["getCurrencies"] === "true"){
	if ($result = $bdd->query("SELECT * FROM monnaie_crypto")) {
		echo json_encode($result->fetch_all(MYSQLI_ASSOC));
		$result->close();
	}else{
		echo json_encode("pas de connection");
	}
}else{
	echo json_encode("merci d'appeler une fonction valide");
}