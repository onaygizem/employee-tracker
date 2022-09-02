SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE employee_tracker.employee;
TRUNCATE employee_tracker.role;
TRUNCATE employee_tracker.department;

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO
    employee_tracker.department (name)
VALUES
    ("Engineering"),
    ("Sales"),
    ("Finance"),
    ("Human Resources");
    
INSERT INTO
    employee_tracker.role (title, salary, department_id)
VALUES
    ("Software Engineer", 90000, 1),
    ("Tester", 80000, 1),
    ("Sales Representative", 100000, 2),
    ("Accountant", 100000, 3),
    ("Human Resource Associate", 60000, 4);

INSERT INTO
    employee_tracker.employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Onay", "Karakulak", 1, NULL),
    ("Nancy", "Chernov", 3, NULL),
    ("Bob", "Money", 4, NULL),
    ("Wendy", "Hitler", 5, NULL);
    
INSERT INTO
    employee_tracker.employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Stas", "Snigir", 1, 1),
    ("John", "Smith", 2, 1),
    ("Jennifer", "Saint", 3, 2);