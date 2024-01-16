const { exec } = require('child_process');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      console.error(stderr);
      resolve(stdout.trim());
    });
  });
}

function uncommittedChanges() {
  return runCommand('git status --porcelain').then((output) => output.trim());
}

function gitBranchName() {
  return runCommand('git rev-parse --abbrev-ref HEAD').then((output) =>
    output.trim()
  );
}

exports.runCommand = runCommand;
exports.uncommittedChanges = uncommittedChanges;
exports.gitBranchName = gitBranchName;
