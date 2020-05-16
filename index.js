const core = require('@actions/core')
const exec = require('@actions/exec')

function getTag(tags, name) {
    if (name == "prev") {
        if (tags.length < 2) {
            core.setFailed("need more than 2 tags.")
            return ""
        }

        return tags[tags.length - 2]
    } else if (name == "latest") {
        return tags[tags.length - 1]
    } else {
        return name
    }
}

async function run() {
    const from = core.getInput("from")
    const to = core.getInput("to")

    let output = ''
    const options = {};
    options.listeners = {
        stdout: (data) => {
            output += data.toString();
        }
    }

    const tag_command = 'git tag --sort version:refname'
    console.log(tag_command)
    await exec.exec(tag_command, [], options).catch(error => {
        core.setFailed(error.message)
    })

    const tags = output.split('\n').filter(Boolean)
    console.log(tags)

    output = ''

    const from_tag = getTag(tags, from)
    const to_tag = getTag(tags, to)

    if (from_tag.length == 0 || to_tag.length == 0) {
        core.setFailed("from or to is invalid")
        return
    }

    const command = `git log ${from_tag}..${to_tag} --merges --reverse --pretty=format:"* %b"`
    console.log(command)

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