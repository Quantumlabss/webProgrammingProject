const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'logins.json');

// Setup readline for CLI input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper to prompt questions
const ask = (question) => {
    return new Promise(resolve => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
};

async function main() {
    const name = await ask('Enter your full name: ');
    const email = await ask('Enter your email: ');
    const phone = await ask('Enter your phone number: ');

    let userType = '';
    while (userType !== '1' && userType !== '2') {
        console.log('Are you:');
        console.log('1) New User');
        console.log('2) Studio Owner');
        userType = await ask('Select (1 or 2): ');
    }

    const type = (userType === '1') ? 'new_user' : 'studio_owner';

    const loginEntry = {
        name,
        email,
        phone,
        userType: type
    };

    let logins = [];

    // Read existing logins if the file exists
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        try {
            logins = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON, starting fresh.');
        }
    }

    logins.push(loginEntry);

    // Save back to JSON file
    fs.writeFileSync(filePath, JSON.stringify(logins, null, 2), 'utf8');
    console.log('Login data saved!');

    rl.close();
}

main();




//other
