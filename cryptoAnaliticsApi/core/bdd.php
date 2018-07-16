<?php

$hote = 'localhost';
$utilisateur = 'root';
$mdp = '';
$nombdd = 'cryptoanalytics'; // Nom de la base de données
$bdd = new mysqli($hote, $utilisateur, $mdp, $nombdd);
if ($bdd->connect_error) {
	$response = ['response'=>'Erreur de connexion (' . $bdd->connect_errno . ') ' . $bdd->connect_error];
	echo json_encode($response);
}
