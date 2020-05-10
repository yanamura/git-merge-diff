# Git Merge Diff

This action generate git merge diff between tags.

# Usage

```yaml
- uses: actions/checkout@v2
- run: git fetch --prune --unshallow
- name: Diff
    id: diff
    uses: yanamura/git-merge-diff@v1
```

> Note: don't forget to fetch.(actions/checkout only fetch depth=0)

## get output(merge diff)

```
steps.<step id>.outputs.diff
```

# Senario

```yaml
- uses: actions/checkout@v2
- run: git fetch --prune --unshallow
- name: Diff
    id: diff
    uses: yanamura/git-merge-diff@v1
- name: Create Release
    uses: actions/create-release@v1
    env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        body: |
            ${{ steps.diff.outputs.diff }}
        draft: false
        prerelease: false
```