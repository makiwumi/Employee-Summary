const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs")

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


let employees = []

const mainQuestions = [
    {
        type: `input`,
        name: `name`,
        message: `Please enter your name`
    },
    {
        type: `input`,
        name: `ID`,
        message: `Please enter your ID`
    },
    {
        type: `input`,
        name: `email`,
        message: `Please enter your email`
    },

    {
        type: `list`,
        name: `role`,
        message: `Please enter your role`,
        choices: [
            `Manager`,
            `Engineer`,
            `Intern`
        ]
    },
]

const managerQuestion =  [
    {
        type: 'input',
        name: 'officeNumber',
        message: 'What is your office number?',
    }]

const engineerQuestion = [
    {
        type: 'input',
        name: 'github',
        message: 'What is your github?',
    }]

const internQuestion = [
    {
        type: 'input',
        name: 'school',
        message: 'What is your school?',
    }
]

const loopQuestion = [
    {
        type: `confirm`,
        name: `addMore`,
        message: `Do you want to add more employees?`
    }
]

function addEmployee() { 
    
    return inquirer.prompt(mainQuestions).then(answers => {
        let role = answers.role;
        let id = answers.ID;
        let email = answers.email;
        let name = answers.name

        if (role == `Manager`) {
            inquirer.prompt(managerQuestion).then(managerAnswer => {
                let officeNum = managerAnswer.officeNumber;
                employees.push(new Manager(name, id, email, officeNum));
                inquirer.prompt(loopQuestion).then(loopAnswer => {
                    addMore = loopAnswer.addMore;
                    addMoreEmployees(addMore);
                })
            }
        )}

        else if (role == `Engineer`) {
            inquirer.prompt(engineerQuestion).then(engineerAnswer => {
                let github = engineerAnswer.github;

                employees.push(new Engineer(name, id, email, github));

                inquirer.prompt(loopQuestion).then(loopAnswer => {
                    addMore = loopAnswer.addMore;
                    addMoreEmployees(addMore);
                })
            }
        )}

        else if (role == `Intern`) {
            inquirer.prompt(internQuestion).then(internAnswer => {
                let school = internAnswer.school;

                employees.push(new Intern(name, id, email, school));

                inquirer.prompt(loopQuestion).then(loopAnswer => {
                    addMore = loopAnswer.addMore;
                    addMoreEmployees(addMore);
                })
            }
        )}
    })
    .catch(error => {
        console.log(error)
    })
}

function addMoreEmployees(boolean) {
    if (boolean === true) {
        addEmployee();
    }
    else {
        let newHTML = render(employees);
        fs.writeFile(outputPath,newHTML, error => {
            if (error) {
                console.log(error);
            } else {
                console.log(`File was successfully written at ${outputPath}`);
            }
        })
    }
}

addEmployee();