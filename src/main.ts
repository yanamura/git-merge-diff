import * as core from '@actions/core'
import * as exec from '@actions/exec'

function getTag(tags: string[], name: string): string {
  if (name === 'prev') {
    if (tags.length < 2) {
      core.setFailed('need more than 2 tags.')
      return ''
    }

    return tags[tags.length - 2]
  } else if (name === 'latest') {
    return tags[tags.length - 1]
  } else {
    return name
  }
}

async function run(): Promise<void> {
  const from = core.getInput('from')
  const to = core.getInput('to')
  const shouldUseFirstParent = core.getInput('first-parent')

  let output = ''
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  }

  const tagCommand = 'git tag --sort version:refname'
  core.info(tagCommand)
  await exec.exec(tagCommand, [], options).catch(error => {
    core.setFailed(error.message)
  })

  const tags = output.split('\n').filter(Boolean)
  core.info(tags.toString())

  output = ''

  const fromTag = getTag(tags, from)
  const toTag = getTag(tags, to)

  if (fromTag.length === 0 || toTag.length === 0) {
    core.setFailed('from or to is invalid')
    return
  }

  const firstParentOption = shouldUseFirstParent ? '--first-parent' : ''
  const command = `git log ${fromTag}..${toTag} --merges ${firstParentOption} --reverse --pretty=format:"* %b"`
  core.info(command)

  await exec.exec(command, [], options).catch(error => {
    core.setFailed(error.message)
  })

  core.info(output)
  output = removeStarLines(output)
  core.info(output)

  core.setOutput("diff", output)
}

function removeStarLines(inputString: string, lineBreak: string = '\n'): string {
  const lines = inputString.split(lineBreak)
  const filteredLines = lines.filter(line => line.trim() !== '*')
  return filteredLines.join(lineBreak)
}

run()
