const { inc } = require('semver');
const { uncommittedChanges, gitBranchName, runCommand } = require('./utils');
const readlineSync = require('readline-sync');
const WriteStream = require('./WriteStream');
const conventionalChangelog = require('conventional-changelog');

main()
  .then(() => console.log('Script execution complete.'))
  .catch((error) => console.error(`Error: ${error.message}`))
  .finally(() => process.exit(0));

async function main() {
  await validateUncommittedChanges();
  const branchName = await gitBranchName();

  switch (true) {
    case branchName === 'develop':
      await handleDevelopBranch();
      return;
    case branchName === 'main':
      await handleMainBranch();
      return;
    case branchName.startsWith('hotfix/'):
      await handleHotfixBranch(branchName);
      return;
    default:
      throw new Error(
        `Error: Current branch is '${branchName}'. Please switch to 'main', 'develop', or 'hotfix/<name>' before proceeding.`
      );
  }
}

async function validateUncommittedChanges() {
  const hasUncommittedChanges = await uncommittedChanges();
  if (hasUncommittedChanges) {
    throw new Error('Uncommitted changes detected. Aborting.');
  }
}

async function handleDevelopBranch() {
  const releaseType = promptUser(
    ['minor', 'major', 'preminor', 'premajor', 'prerelease'],
    'Select the release type:'
  );

  let preReleaseIdentifier;
  if (releaseType.startsWith('pre')) {
    preReleaseIdentifier = promptUser(
      ['alpha', 'beta', 'rc'],
      'Select the pre-release identifier:'
    );
  }

  const newVersion = getNewVersion(releaseType, preReleaseIdentifier);

  console.log(`Starting release process for version v${newVersion}...`);
  await runCommand(`git flow release start v${newVersion}`);

  await bumpVersion(newVersion);
  await generateChangelog(newVersion);
  await commitChanges(newVersion);

  console.log(`Finishing release process for version v${newVersion}...`);
  await runCommand(
    `git flow release finish v${newVersion} -m "Release v${newVersion}"`
  );

  console.log(`Release process for version v${newVersion} complete!`);
  await pushChanges();
}

async function handleMainBranch() {
  const releaseType = promptUser(
    ['patch', 'prepatch', 'prerelease'],
    'Select the hotfix release type:'
  );

  let preReleaseIdentifier;
  if (releaseType.startsWith('pre')) {
    preReleaseIdentifier = promptUser(
      ['alpha', 'beta', 'rc'],
      'Select the pre-release identifier:'
    );
  }

  const newVersion = getNewVersion(releaseType, preReleaseIdentifier);

  console.log(`Starting hotfix release process for version v${newVersion}...`);
  await runCommand(`git flow hotfix start v${newVersion}`);
}

async function handleHotfixBranch(branchName) {
  const newVersion = branchName.replace('hotfix/v', '');

  await bumpVersion(newVersion);
  await generateChangelog(newVersion);
  await commitChanges(newVersion);

  console.log('Finishing hotfix release process...');
  await runCommand(`git flow hotfix finish v${newVersion} -m "v${newVersion}"`);
  await pushChanges();
}

function getNewVersion(releaseType, preReleaseIdentifier) {
  const currentVersion = require('../package.json').version;
  return inc(currentVersion, releaseType, preReleaseIdentifier);
}

async function bumpVersion(newVersion) {
  console.log(`Bumping version to v${newVersion}...`);
  await runCommand(`npm version ${newVersion} --no-git-tag-version`);
}

async function generateChangelog(newVersion) {
  return new Promise((resolve, reject) => {
    if (!newVersion) {
      reject(new Error('Error: Invalid version.'));
    }
    console.log('Generating changelog...');
    const customStream = new WriteStream();
    conventionalChangelog({
      releaseCount: 1
    })
      .on('error', (error) => {
        reject(error);
      })
      .pipe(customStream)
      .on('finish', async () => {
        await runCommand(`npx changelog --release ${newVersion}`);
        resolve();
      });
  });
}

async function commitChanges(newVersion) {
  console.log('Committing changes...');
  await runCommand('git add package.json package-lock.json CHANGELOG.md');
  await runCommand(
    `git commit -m "chore(release): :bookmark: bump version to v${newVersion} and update CHANGELOG.md"`
  );
}

async function pushChanges() {
  console.log('Pushing changes...');
  if (readlineSync.keyInYN('Do you want to push changes to remote?')) {
    await runCommand('git push --follow-tags origin main develop');
    return;
  }
  console.log('Changes not pushed to remote.');
  console.log('Please run the following commands to push changes:');
  console.log('git push --follow-tags origin main develop');
}

function promptUser(options, message = 'Select an option:') {
  console.log(message);
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  const userInput = readlineSync.question(
    'Enter the number corresponding to your choice: '
  );

  const selectedIndex = parseInt(userInput, 10) - 1;

  if (
    isNaN(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= options.length
  ) {
    console.error(
      `Error: Invalid option selected. Please enter a number between 1 and ${options.length}, or press Ctrl+C to exit.`
    );
    return promptUser(options, message);
  }

  return options[selectedIndex];
}
