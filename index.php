<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once ('access.inc.php');

$bodyPath = "/apps/sage-tables";
$title = "Sage 100 Tables";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, true);
$ui->version = "2019-05-29";
$ui->bodyClassName = 'container-fluid';
$ui->AddCSS("public/styles.css");
$ui->addManifest('public/js/manifest.json');
$ui->Send();
