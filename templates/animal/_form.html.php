<?php
    /** @var $animal ?\App\Model\Animal */
?>

<div class="form-group">
    <label for="subject">Name</label>
    <input type="text" id="name" name="animal[name]" value="<?= $animal ? $animal->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Species</label>
    <textarea id="species" name="animal[species]"><?= $animal ? $animal->getSpecies() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
