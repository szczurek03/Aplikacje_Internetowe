<?php

/** @var \App\Model\Animal $animal */
/** @var \App\Service\Router $router */

$title = "{$animal->getName()} ({$animal->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $animal->getName() ?></h1>
    <article>
        <?= $animal->getSpecies();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('animal-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('animal-edit', ['id'=> $animal->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
