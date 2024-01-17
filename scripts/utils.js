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

async function uncommittedChanges() {
  return runCommand('git status --porcelain');
}

function gitBranchName() {
  return runCommand('git rev-parse --abbrev-ref HEAD');
}

async function validateUncommittedChanges() {
  const hasUncommittedChanges = await uncommittedChanges();
  if (hasUncommittedChanges) {
    throw new Error('Uncommitted changes detected. Aborting.');
  }
}

exports.runCommand = runCommand;
exports.uncommittedChanges = uncommittedChanges;
exports.gitBranchName = gitBranchName;
exports.validateUncommittedChanges = validateUncommittedChanges;
