<?php

declare(strict_types=1);

class Database {

    //parameters to use in constructor (which allows access to our database)
    private array $options;
    private string $username;
    private string $password;
    private string $host;
    private string $db;

    //connection variable with PDO variable-type
    private PDO $conn;

    //constructor function taking in the environment variables allowing us to access the database
    public function __construct() {
        $this->options = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
            PDO::MYSQL_ATTR_SSL_CA => getenv('MYSQL_SSL_CA'),
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
            PDO::MYSQL_ATTR_SSL_KEY => getenv('MYSQL_SSL_KEY'),
            PDO::MYSQL_ATTR_SSL_CERT => getenv('MYSQL_SSL_CERT'),
        );
        $this->username = getenv('MYSQL_USERNAME');
        $this->password = getenv('MYSQL_PASSWORD');
        $this->host = getenv('MYSQL_HOST');
        $this->db = getenv('MYSQL_DATABASE');
    }

    //the function we are calling after constructing the object above, returns a PDO object (value in variable conn)
    public function getConnection(): PDO {

        try {
            $this->conn = new PDO (
                "mysql:host=$this->host;dbname=$this->db", $this->username, $this->password, $this->options);
        } catch (PDOException $exception){
            echo "Something went wrong. Here's what: " . $exception->getMessage();
        }

        return $this->conn;
    }
}