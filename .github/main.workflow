workflow "build, lint, and test on push" {
  on = "push"
  resolves = [
    "test"
  ]
}

action "install" {
  uses = "docker://node:10"
  args = "install"
  runs = "yarn"
}

action "lint" {
  needs = [
    "install"
  ]
  uses = "docker://node:10"
  args = "lint"
  runs = "yarn"
}

action "test" {
  needs = [
    "install",
    "lint"
  ]
  uses = "docker://node:10"
  args = "test"
  runs = "yarn"
}

