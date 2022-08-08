INSERT INTO departments (name)
VALUES ("Marketing"),
       ("Finance"),
       ("Human Resource"),
       ("Information Tech"),
       ("Sales"),
       ("Operations");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Digital Marketing Manager", 48058, 1),
        ("Digital Marketing Coordinator", 40718, 1),
        ("Chief Financial Officer", 192500, 2),
        ("Financial Controller", 115000, 2),
        ("HR Manager", 75256, 3),
        ("HR Specialist", 52517, 3),
        ("Chief Information Office", 144493, 4),
        ("System Administrator", 64574, 4),
        ("Sales Manager", 75675, 5),
        ("Sales Representative", 59842, 5),
        ("Program Manager", 86231, 6),
        ("Operations Analyst", 67318, 6);

INSERT INTO employees (first_name, Last_name, role_id, manager_id)
VALUES  ("Mike", "Ehrmentraut", 11, 4),
        ("Jesse", "Pinkman", 10, 2),
        ("Walter", "White", 9 , 5),
        ("Gustavo", "Fring", 3, NULL),
        ("Skylar", "White", 10, NULL);