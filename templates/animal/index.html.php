<?php

/** @var \App\Model\Animal[] $animals */
/** @var \App\Service\Router $router */

$title = 'Animal List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Animals List</h1>

    <a href="<?= $router->generatePath('animal-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($animals as $animal): ?>
            <li><h3><?= $animal->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('animal-show', ['id' => $animal->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('animal-edit', ['id' => $animal->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
