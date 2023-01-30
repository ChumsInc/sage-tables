<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once ('access.inc.php');

$bodyPath = "/apps/sage-list";
$title = "Sage 100 Tables";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, 5);
$ui->version = "2019-05-29";
$ui->bodyClassName = 'container-fluid';
$ui->AddCSS("public/styles.css", false, true);
$ui->addManifest('public/js/manifest.json');
$ui->Send();
