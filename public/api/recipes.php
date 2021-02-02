<?php

declare(strict_types=1);

//allow access from everywhere and set output to json
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../objects/Recipe.php';


//below is a PDO variable created from Database constructor and then calling getConnection function on it to establish the actual connection
$db_connection = (new Database())->getConnection();


//calls constructor function in Recipe class and passing in the connection to our MySQL database
$final_connection = new Recipe($db_connection);


//-----------------------------------------------------GET-----------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    //below gets back a PDO statement from our MySQL database
    $result = $final_connection->getAllRecipes();

    //rowCount is a built in PDO-statement function that returns the number of rows in the database
    $rows = $result->rowCount();

    if ($rows > 0){
        $final_array = array(); //associative array (you use keys instead of index-numbers)
        $final_array['recipes'] = array(); //declares a new array in the final_array that we call recipes

        //while there are rows, break out every row from result and gives back the values in an associated array, saved in $row
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            array_push($final_array['recipes'], $row);
        }

        //echo = what we send back to the browser
        echo json_encode($final_array); //encodes the final array to json and echo it
    } else {
        echo 'Oops, no records find, please add a recipe!';
    }
}

//-----------------------------------------------------POST-----------------------------------------------------
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //allows us to read raw data from the request body into a JSON string and then decode the JSON into a variable
    $input = json_decode(file_get_contents('php://input'));

    //saving input fields in individual variables
    $heading = $input->heading;
    $ingredient = $input->ingredient;
    $instructions = $input->instructions;

    //the response to our frontend must be encoded into JSON
    if ($final_connection->postRecipe($heading, $ingredient, $instructions)) {
        echo json_encode(array('message' => 'Success, your recipe is now posted!'));
    } else {
        echo json_encode(array('message' => 'Your post failed, please try again later.'));
    }
}

//-----------------------------------------------------DELETE-----------------------------------------------------
else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    //allows us to read raw data from the request body into a JSON string and then decode the JSON into a variable
    $id_object = json_decode(file_get_contents('php://input'));
    $id = $id_object->id;

    //the response to our frontend must be encoded into JSON
    if ($final_connection->DeleteRecipe($id)) {
        echo json_encode(array('message' => 'Success, the recipe is now deleted.'));
    } else {
        echo json_encode(array('message' => 'Something went wrong, please try again later.'));
    }
}