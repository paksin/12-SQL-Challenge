const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
},
console.log(`Connected to the company_db database.\n\n------------------------------------\n|                                  |\n|         EMPLOYEE MANAGER         |\n|                                  |\n------------------------------------\n`)
);

function init() {
    inquirer
        .prompt([{
            type: 'list',
            message: 'What would you like to do?',
            name: 'todo',
            choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'Total Budget of Department',
                'Quit'
            ],
        },])
        .then(function (input) {
            if (input.todo == 'View All Departments'){
                viewDept();
            }else if (input.todo == 'View All Roles'){
                viewRole();
            }else if (input.todo == 'View All Employees'){
                viewEmployee();
            }else if (input.todo == 'Add Department'){
                addDept();
            }else if (input.todo == 'Add Role'){
                addRole();
            }else if (input.todo == 'Add Employee'){
                addEmployee();
            }else if (input.todo == 'Update Employee Role'){
                updateRole();
            }else if (input.todo == 'Update Employee Manager'){
                updateMan();
            }else if (input.todo == 'View Employees by Manager'){
                viewEmpByMan();
            }else if (input.todo == 'View Employees by Department'){
                viewEmpByDept();
            }else if (input.todo == 'Delete Department'){
                delDept();
            }else if (input.todo == 'Delete Role'){
                delRole();
            }else if (input.todo == 'Delete Employee'){
                delEmp();
            }else if (input.todo == 'Total Budget of Department'){
                totalBudgetByDept();
            }else{
                console.log("Goodbye. Please press Ctrl + Z to return to terminal.");
            }
            
        });
};

function viewDept() {
    db.query('SELECT * FROM department;', function(err, results){
        if (err){
            res.status(400).send('Error in Database');
        }else{
            console.table(results);
            init();
        }
    });
};

function viewRole(){
    db.query('SELECT role.id, role.title, department.name as department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            console.table(results);
            init();
        }
    });
};

function viewEmployee(){
    db.query('SELECT a.id, a.first_name, a.last_name, role.title, department.name as department, role.salary, concat(b.first_name, " ", b.last_name) AS manager FROM employee AS a LEFT JOIN employee AS b ON a.manager_id = b.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            console.table(results);
            init();
        }
    });
}; 

function addDept(){
    inquirer
        .prompt([{
            type: 'input',
            message: "Name of department?",
            name: 'deptName',
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO department (name) VALUES ("${answer.deptName}");`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success");
                init();
            }
        });
    })
};

function addRole(){
    const deptList = [];
    db.query('SELECT name, id FROM department;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(dept => {
                let temp = {
                    name: dept.name,
                    value: dept.id
                }
                deptList.push(temp);
            });
        }
    });
    inquirer
        .prompt([{
            type: 'input',
            message: "Title of role?",
            name: 'roleName',
        },{
            type: 'input',
            message: "Salary of role?",
            name: 'roleSalary',
        },{
            type: 'list',
            message: "Department of role?",
            name: 'roleDept',
            choices: deptList,
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleName}", ${answer.roleSalary}, ${answer.roleDept});`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function addEmployee(){
    const roleList = [];
    const empList =[];
    db.query('SELECT title, id FROM role;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(role => {
                let temp = {
                    name: role.title,
                    value: role.id
                }
                roleList.push(temp);
            });
        }
    });
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                empList.push(temp);
            });
        }
    });
    inquirer
        .prompt([{
            type: 'input',
            message: "Employee first name?",
            name: 'firstName',
        },{
            type: 'input',
            message: "Employee last name?",
            name: 'lastName',
        },{
            type: 'list',
            message: "Employee role?",
            name: 'empRole',
            choices: roleList,
        },{
            type: 'list',
            message: "Employee manager?",
            name: 'empMan',
            choices: empList,
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${answer.empRole}, ${answer.empMan});`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function updateRole(){
    const roleList = [];
    const empList =[];
    db.query('SELECT title, id FROM role;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(role => {
                let temp = {
                    name: role.title,
                    value: role.id
                }
                roleList.push(temp);
            });
        }
    });
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                empList.push(temp);
            });
        }
    });
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Change who's role?",
            name: 'employee',
            choices: empList,
        },
        {
            type: 'list',
            message: "Change to which role?",
            name: 'empRole',
            choices: roleList,
        },
    ])
    .then(answer => {
        db.query(`UPDATE employee SET role_id = ${answer.empRole} WHERE id = ${answer.employee};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function updateMan(){
    const empList =[];
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                empList.push(temp);
            });
        }
    });
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Change who's manager?",
            name: 'employee',
            choices: empList,
        },
        {
            type: 'list',
            message: "New manager name?",
            name: 'manager',
            choices: empList,
        },
    ])
    .then(answer => {
        db.query(`UPDATE employee SET manager_id = ${answer.manager} WHERE id = ${answer.employee};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function viewEmpByMan(){
    const manList =[];
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee WHERE manager_id IS NULL;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                manList.push(temp);
            });
        }
    });
    
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Which manager's subordinates?",
            name: 'manager',
            choices: manList,
        },
    ])
    .then(answer => {
        db.query(`SELECT a.id, a.first_name, a.last_name, role.title, department.name as department, role.salary, concat(b.first_name, " ", b.last_name) AS manager FROM employee AS a LEFT JOIN employee AS b ON a.manager_id = b.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE a.manager_id = ${answer.manager};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.table(results);
                init();
            }
        });
    })
};

function viewEmpByDept(){
    const deptList =[];
    db.query('SELECT name, id FROM department;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                deptList.push(temp);
            });
        }
    });
    
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Which department?",
            name: 'dept',
            choices: deptList,
        },
    ])
    .then(answer => {
        db.query(`SELECT a.id, a.first_name, a.last_name, role.title, department.name as department, role.salary, concat(b.first_name, " ", b.last_name) AS manager FROM employee AS a LEFT JOIN employee AS b ON a.manager_id = b.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ${answer.dept};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.table(results);
                init();
            }
        });
    })
};

function delDept(){
    const deptList =[];
    db.query('SELECT name, id FROM department;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                deptList.push(temp);
            });
        }
    });
    
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Delete which department?",
            name: 'dept',
            choices: deptList,
        },
    ])
    .then(answer => {
        db.query(`DELETE FROM department WHERE id = ${answer.dept};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function delRole(){
    const roleList =[];
    db.query('SELECT title, id FROM role;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(role => {
                let temp = {
                    name: role.title,
                    value: role.id
                }
                roleList.push(temp);
            });
        }
    });
    
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Delete which role?",
            name: 'role',
            choices: roleList,
        },
    ])
    .then(answer => {
        db.query(`DELETE FROM role WHERE id = ${answer.role};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function delEmp(){
    const empList =[];
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                empList.push(temp);
            });
        }
    });
    
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Delete which employee?",
            name: 'emp',
            choices: empList,
        },
    ])
    .then(answer => {
        db.query(`DELETE FROM employee WHERE id = ${answer.emp};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function totalBudgetByDept(){
    const deptList =[];
    db.query('SELECT name, id FROM department;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                deptList.push(temp);
            });
        }
    });
    
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press enter to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Delete which department?",
            name: 'dept',
            choices: deptList,
        },
    ])
    .then(answer => {
        db.query(`SELECT SUM(salary) AS Total_Budget_of_Department FROM role WHERE department_id = ${answer.dept};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.table(results);
                init();
            }
        });
    })
};

init();