<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Animal;
use App\Service\Router;
use App\Service\Templating;

class AnimalController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $animals = Animal::findAll();
        $html = $templating->render('animal/index.html.php', [
            'animals' => $animals,
            'router' => $router,
        ]);
        return $html;
    }
    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $animal = Animal::fromArray($requestPost);
            // @todo missing validation
            $animal->save();

            $path = $router->generatePath('animal-index');
            $router->redirect($path);
            return null;
        } else {
            $animal = new Animal();
        }

        $html = $templating->render('animal/create.html.php', [
            'animal' => $animal,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $animalId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $animal = Animal::find($animalId);
        if (! $animal) {
            throw new NotFoundException("Missing animal with id $animalId");
        }

        if ($requestPost) {
            $animal->fill($requestPost);
            // @todo missing validation
            $animal->save();

            $path = $router->generatePath('animal-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('animal/edit.html.php', [
            'animal' => $animal,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $animalId, Templating $templating, Router $router): ?string
    {
        $animal = Animal::find($animalId);
        if (! $animal) {
            throw new NotFoundException("Missing animal with id $animalId");
        }

        $html = $templating->render('animal/show.html.php', [
            'animal' => $animal,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $animalId, Router $router): ?string
    {
        $animal = Animal::find($animalId);
        if (! $animal) {
            throw new NotFoundException("Missing animal with id $animalId");
        }

        $animal->delete();
        $path = $router->generatePath('animal-index');
        $router->redirect($path);
        return null;
    }
}
