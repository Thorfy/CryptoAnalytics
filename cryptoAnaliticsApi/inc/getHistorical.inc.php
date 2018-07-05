<?php

require('../fonction_api/apiHistorical.php');
if ($_GET['function']) {
    $function = $_GET['function'];
    echo $function("BTC", "USD", 300);
}