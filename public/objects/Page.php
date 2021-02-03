<?php

declare(strict_types=1);

class Page {

    //corresponds to columns of my table
    private int $id;
    public string $name;
    public string $content;

    //connection variable
    private PDO $conn;

    //constructor function with a pdo-object as a parameter and sets conn to that parameter
    public function __construct(PDO $db_connection) {
        $this->conn = $db_connection;
    }


    public function getAllPages(): PDOStatement {
        $query = 'select * from pages'; //this is the query we want to send to MySQL

        $statement = $this->conn->prepare($query); //separates layers for security reasons and returns the pdo-statement from the database
        $statement->execute(); //executes the statement

        //the statement is now what we have gotten back from our MySQL-database and is a PDO-Statement
        return $statement;
    }

    public function postPage($name, $content) : bool{
        $query = "insert into pages (name, content) values ('$name','$content')";

        $statement = $this->conn->prepare($query);

        //executes the statement and evaluates if it was successful
        if ($statement->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function deletePage($id) : bool{
        $query = "delete from page where id = '$id'";

        $statement = $this->conn->prepare($query);

        if ($statement->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function updatePage($id, $name, $content) : bool{
        $query = "update pages set name='$name', content='$content' where id='$id'";

        $statement = $this->conn->prepare($query);

        if ($statement->execute()) {
            return true;
        } else {
            return false;
        }
    }
}
