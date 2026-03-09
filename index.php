<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

use chums\ui\WebUI2;
use chums\user\Groups;


require_once("autoload.inc.php");

$ui = new WebUI2([
    'title' => 'Sage 100 Tables',
    'bodyClassName' => 'container-fluid',
    'requiredRoles' => [Groups::ADMIN],
    'contentFile' => 'body.inc.php'
]);
$ui->addViteManifest()
    ->render();


/**
 * @TODO: Alert when query fails (including 401)
 */
