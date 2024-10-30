import config from "@/fumapy.config";
import { exec } from "child_process";

Object.values(config.sources).forEach((source) => {
  exec(`python3 ${__dirname}/py/create.py ${source.pkgName} --dir ${__dirname}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
