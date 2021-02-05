<?php

declare(strict_types=1);

class Recipe {

    //corresponds to columns of my table
    private int $id;
    public string $heading;
    public string $ingredient;
    public string $instructions;

    //connection variable
    private PDO $conn;

    //constructor function with a pdo-object as a parameter and sets conn to that parameter
    public function __construct(PDO $db_connection) {
        $this->conn = $db_connection;
    }


    public function getAllRecipes(): PDOStatement {
        $query = 'select * from recipes'; //this is the query we want to send to MySQL

        $statement = $this->conn->prepare($query); //separates layers for security reasons and returns the pdo-statement from the database
        $statement->execute(); //executes the statement

        //the statement is now what we have gotten back from our MySQL-database and is a PDO-Statement
        return $statement;
    }

    public function postRecipe($heading, $ingredient, $instructions) : bool{
        $query = "insert into recipes (heading, ingredient, instructions) values ('$heading','$ingredient','$instructions')";

        $statement = $this->conn->prepare($query);

        //executes the statement and evaluates if it was successful
        if ($statement->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteRecipe($id) : bool{
        $query = "delete from recipes where id = '$id'";

        $statement = $this->conn->prepare($query);

        if ($statement->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function updateRecipe($id, $heading, $ingredient, $instructions) : bool{
        $query = "update recipes set heading='$heading', ingredient='$ingredient', instructions='$instructions' where id='$id'";
        $statement = $this->conn->prepare($query);


        if ($statement->execute()) {
            return true;
        } else {
            return false;
        }
    }
}