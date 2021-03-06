const express = require("express")
const app = express()
const cors = require("cors")
const chalk = require("chalk")
const { log } = console
const { port } = require("./src/config/enviroment")
const routerIndex = require("./src/http/router")
const formData = require("express-form-data")
const sequelize = require("./src/config/db_config")
const { createAdmin: createDefaultAdmin } = require("./src/loaders/admin_loder")

function logSuccess(message) {
	log(chalk.green(message))
}

function logError(message) {
	log(chalk.red(message))
}

require("./src/models/models")
require("./src/models/associations")

//  server configuration
app.use(cors())
app.use(express.urlencoded())
app.use(express.json())
app.use(formData.parse())
app.use("/api", routerIndex)

sequelize
	.sync({ logging: false, force: false })
	.then(() => {
		app.listen(port, () => {
			logSuccess(`server listening on port: ${port}`)
		})
		createDefaultAdmin()
			.then(() => {
				logSuccess("default admin was created successfully")
			})
			.catch((error) => {
				logError(error.message)
			})
	})
	.catch((error) => {
		console.log(error)
		logError(error.message)
	})
