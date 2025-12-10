<?php
namespace App\Model;

use App\Service\Config;

class Animal
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $species = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Animal
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Animal
    {
        $this->name = $name;

        return $this;
    }

    public function getSpecies(): ?string
    {
        return $this->species;
    }
    public function setSpecies(?string $species): Animal
    {
        $this->species = $species;

        return $this;
    }

    public static function fromArray($array): Animal
    {
        $animal = new self();
        $animal->fill($array);

        return $animal;
    }

    public function fill($array): Animal
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['species'])) {
            $this->setSpecies($array['species']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM animal';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $animals = [];
        $animalsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($animalsArray as $animalArray) {
            $animals[] = self::fromArray($animalArray);
        }

        return $animals;
    }

    public static function find($id): ?Animal
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM animal WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $animalArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $animalArray) {
            return null;
        }
        $animal = Animal::fromArray($animalArray);

        return $animal;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO animal (name, species) VALUES (:name, :species)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'species' => $this->getSpecies(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE animal SET name = :name, species = :species WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':species' => $this->getSpecies(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM animal WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setSpecies(null);
    }
}
