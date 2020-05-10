const core = require('@actions/core')
const exec = require('@actions/exec')

async function run() {
    const command = 'changelog=$(git log $(git tag --sort version:refname | tail -n 2 | head -n 1)..$(git tag --sort version:refname | tail -n 1) --merges --reverse --pretty=format:"* %b")'
    console.log(command)

    let output = ''

    const options = {};
    options.listeners = {
    stdout: (data) => {
        output += data.toString();
    }
    }

    await exec.exec(command, [], options).catch(error => {
        core.setFailed(error.message)
    })

    console.log(output)

    output = output.replace(/%/g, '%25')
    output = output.replace(/\n/g, '%0A')
    output = output.replace(/\r/g, '%0D')

    console.log(output)

    const setoutput_command = `echo "::set-output name=diff::${output}"`
    exec.exec(setoutput_command).catch(error => {
        core.setFailed(error.message)
    })
}

run()