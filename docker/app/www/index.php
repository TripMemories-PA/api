<?php

//define('SERVER', 'sparql'); # switch resolver to pure sparql
header('Access-Control-Allow-Credentials: true', true);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$payload = null;

switch($_SERVER['REQUEST_METHOD']) {
    case "POST":
        if (isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawBody = file_get_contents('php://input');
            try {
                $requestData = json_decode($rawBody ?: '', true, 512, JSON_THROW_ON_ERROR);
            } catch(\JsonException $e) {
                http_response_code(400);
                echo json_encode(['errors' => [['message' => $e->getMessage()]]]);
                exit;
            }
        } else {
            $requestData = $_POST;
        }
        break;
    case "GET":
        $requestData = $_GET;
        if (isset($requestData['variables'])) {
            try {
                $requestData['variables'] = json_decode($requestData['variables'], true, 512, JSON_THROW_ON_ERROR);
            } catch(\JsonException $e) {
                http_response_code(400);
                echo json_encode(['errors' => [['message' => 'variables : ' . $e->getMessage()]]]);
                exit;
            }
        }
        break;
    default:
        exit;
}

$payload = isset($requestData['query']) ? $requestData['query'] : null;
$variables = !empty($requestData['variables']) ? $requestData['variables'] : [];

require_once __DIR__.'/../vendor/autoload.php';

$processor = \Datatourisme\Api\DatatourismeApi::create('http://blazegraph:9999/blazegraph/namespace/kb/sparql');
$response = $processor->process($payload, $variables);
header('Content-Type: application/json');
echo json_encode($response);
exit;
