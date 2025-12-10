<?php

/** @var \App\Model\Animal $animal */
/** @var \App\Service\Router $router */

$title = "Edit Animal {$animal->getName()} ({$animal->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('animal-edit', ['id' => $animal->getId()]) ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="animal-edit">
        <input type="hidden" name="id" value="<?= $animal->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('animal-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('animal-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="animal-delete">
                <input type="hidden" name="id" value="<?= $animal->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
