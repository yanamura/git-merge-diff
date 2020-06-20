# Git Merge Diff

This action generate git merge diff between tags.

# Usage

## Diff between latest and previous tag
```yaml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0
- name: Diff
    id: diff
    uses: yanamura/git-merge-diff@v1
```

or 

```yaml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0
- name: Diff
    id: diff
    uses: yanamura/git-merge-diff@v1
    with:
        from: prev
        to: latest
```

## Diff between HEAD and latest tag
```yaml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0
- name: Diff
    id: diff
    uses: yanamura/git-merge-diff@v1
    with:
        from: latest
        to: HEAD
```

## Diff between specified tags
```yaml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0
- name: Diff
    id: diff
    uses: yanamura/git-merge-diff@v1
    with:
        from: v1.0.0
        to: v1.1.0
```

> Note: don't forget to fetch.(actions/checkout only fetch depth=0)

## get output(merge diff)

```
steps.<step id>.outputs.diff
```

# Senario

```yaml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0
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