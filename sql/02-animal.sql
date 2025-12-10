create table animal
(
    id      integer not null
        constraint animal_pk
            primary key autoincrement,
    name text not null,
    species text not null
);
