module.exports = {
    apps: [
        {
            name: 'expense-server',
            script: 'index.js',
            cwd: './server',
            env: {
                NODE_ENV: 'development',
            },
        },
        {
            name: 'expense-client',
            script: 'npm',
            args: 'run dev',
            cwd: './client',
        },
        {
            name: 'expense-mobile',
            script: 'npx',
            args: 'expo start',
            cwd: './mobile',
        },
    ],
};
