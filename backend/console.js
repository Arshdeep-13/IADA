const repl = require("node:repl");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

mongoose.connect(process.env.DB_STRING);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB. Starting interactive console...");

  const r = repl.start({
    prompt: "server-console> ",
  });

  const logFilePath = process.env.CONSOLE_HISTORY_PATH
  const logDirectory = path.dirname(logFilePath);

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
    console.log("Created directory:", logDirectory);
  }

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ""); // Create the file if it doesn't exist
    console.log("Created log file:", logFilePath);
  }

  r.on("line", (line) => {
    const now = new Date();
    const istTime = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    fs.appendFileSync(logFilePath, `[${istTime}] : -> ${line}\n`);
  });

  function protectModel(model) {
    return new Proxy(model, {
      get(target, prop) {
        if (["deleteOne", "deleteMany", "findByIdAndDelete", "findOneAndDelete", "remove"].includes(prop)) {
          throw new Error(`❌ Deletion is disabled: ${prop} is blocked.`);
        }
        return target[prop];
      },
    });
  }

  function protectDocument(document) {
    return new Proxy(document, {
      get(target, prop) {
        if (["deleteOne", "deleteMany", "remove"].includes(prop)) {
          throw new Error(`❌ Deletion is disabled: ${prop} is blocked on documents.`);
        }
        return target[prop];
      },
    });
  }


  const modelsPath = path.join(__dirname, "models");
  fs.readdirSync(modelsPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const modelName = file.replace(".js", "");
      const model = require(`./models/${file}`);

      console.log(`Loading model: ${modelName}`, model);

      if (!model || !model.prototype) {
        console.error(`❌ Invalid model: ${modelName}. Skipping...`);
        return;
      }

      const protectedModel = protectModel(model);

      const findMethods = ["findOne", "find", "findById"];
      findMethods.forEach(methodName => {
        const originalMethod = protectedModel[methodName];
        protectedModel[methodName] = new Proxy(originalMethod, {
          apply(target, thisArg, args) {
            return originalMethod.apply(thisArg, args).then(result => {
              if (Array.isArray(result)) {
                return result.map(doc => protectDocument(doc));
              } else if (result) {
                return protectDocument(result);
              }
              return result;
            });
          }
        });
      });


      r.context[modelName] = protectedModel;
      console.log(`Loaded model: ${modelName} (deletion protected)`);
    }
  });

  r.context.mongoose = mongoose;
  r.context.db = mongoose.connection;

  console.log("Interactive console started. Use models, utilities, and services.");
});