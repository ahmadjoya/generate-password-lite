import { generatePswd } from "./lib/password-generator";
import { checkError } from "./lib/check-options-error";
import { processOption } from "./lib/process-options";
import { GenerateOptions } from "./lib/types";

function GeneratePassword(options?: GenerateOptions) {
  let pswd;
  if (options) {
    options = processOption(options);

    checkError(options);

    pswd = generatePswd(options);
    return pswd;
  } else {
    let opt = {
      length: 10,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: false,
      exclude: "",
      minLengthLowercase: 1,
      minLengthUppercase: 1,
      minLengthNumbers: 1,
      minLengthSymbols: 0,
    };
    options = processOption(opt);

    checkError(options);

    pswd = generatePswd(options);
    return pswd;
  }
}

console.log(GeneratePassword({ minLengthLowercase: 4 }));
export { GeneratePassword };
export default { GeneratePassword };
