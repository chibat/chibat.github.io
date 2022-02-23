#!/usr/bin/env -S deno run -A

//
// Tasks
//

const TASKS = [start, deploy];

async function deploy() {
  await $("git add .");
  await $("git commit -m deploy");
  await $("git push");
}

async function start() {
  await denoRun([
    "--allow-net=:4507",
    "--allow-read",
    "https://deno.land/std@0.106.0/http/file_server.ts",
  ]);
}

//
// Utility
//

async function $(cmd: string[] | string) {
  const command = cmd instanceof Array ? cmd : cmd.split(" ");
  const status = await Deno.run({
    cmd: command,
    stdout: "inherit",
    stderr: "inherit",
  }).status();
  if (status.code != 0) {
    Deno.exit(status.code);
  }
}

async function denoRun(params: string[]) {
  await $(
    [Deno.execPath(), "run", "--allow-run"].concat(params),
  );
}

//
// main
//

if (import.meta.main) {
  const taskName = Deno.args[0];
  if (!taskName) {
    TASKS.forEach((task) => console.log(task.name));
    Deno.exit(0);
  }
  const tasks = TASKS.filter((task) => task.name === taskName);
  if (tasks.length == 0) {
    console.log("Unknown task name");
    Deno.exit(1);
  }

  tasks.find((task) => task());
}
