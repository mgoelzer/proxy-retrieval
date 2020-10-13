import { config } from '../config'
import { insertClientType, updateStageType, updateFilePathType, getClientType } from './types'

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  },
})

export const initDB = () => {
  try {
    return knex.schema
      .createTable('clients', function (table) {
        table.increments('id').primary()
        table.string('client_secret', 128).notNullable()
        table.string('cid_requested', 128).notNullable()
        table.string('wallet_address', 128).notNullable()
        table.string('price_attofil', 128).notNullable()
        table.string('stage', 128).notNullable().defaultTo('RECEIVED_CID')
        table.string('temp_file_path', 128)
        table.timestamps(true, true)
      })
      .then()
  } catch (e) {
    console.error(e)
  }
}

export const insertClient = (args: insertClientType) => {
  try {
    return knex('clients').insert(args).then()
  } catch (e) {
    console.error(e)
  }
}

export const updateClientStage = (args: updateStageType) => {
  try {
    return knex('clients').where('client_secret', args.clientSecret).update('stage', args.stage).then()
  } catch (e) {
    console.error(e)
  }
}

export const updateClientFilePath = (args: updateFilePathType) => {
  try {
    return knex('clients').where('client_secret', args.clientSecret).update('temp_file_path', args.tempFilePath).then()
  } catch (e) {
    console.error(e)
  }
}

export const getClient = async (arg: getClientType) => {
  try {
    return knex('clients').where('client_secret', arg.clientSecret).andWhere('cid_requested', arg.cid).select().then()
  } catch (e) {
    console.error(e)
  }
}
