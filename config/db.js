const { connect }=require('mongoose');
require('dotenv').config();

const dburl=process.env.dburl;

const connection=connect(dburl)

module.exports={connection};