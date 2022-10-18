INSERT INTO department (name)
VALUES  ("Accounting"),
        ("Human Resources"),
        ("Marketing"),
        ("Technology");

INSERT INTO role (title, salary, department_id)
VALUES  ("Chief Accountant", 150000, 1),
        ("Senior Accountant", 120000, 1),
        ("Junior Accountant", 80000, 1),
        ("Recruiter", 60000, 2),
        ("HR Manager", 100000, 2),
        ("Employee Relations", 75000, 2),
        ("Product Manager", 150000, 3),
        ("Market Analyst", 90000, 3),
        ("Marketing Director", 200000, 3),
        ("Developer", 150000, 4),
        ("Senior Developer", 200000, 4),
        ("Chief Engineer", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Lewis", "Hamilton", 1, NULL),
        ("David", "Coulthard", 2, 1),
        ("Fernando", "Alonso", 3, 1),
        ("James", "Hunt", 4, 5),
        ("Niki", "Lauda", 5, NULL),
        ("Sergio", "Perez", 6, 5),
        ("Mark", "Webber", 7, 9),
        ("Ayrton", "Senna", 8, 9),
        ("Mika", "Hakkinen", 9, NULL),
        ("Michael", "Schumacher", 10, 12),
        ("Kimi", "Raikkonen", 11, 12),
        ("Sebastian", "Vettel", 12, NULL);